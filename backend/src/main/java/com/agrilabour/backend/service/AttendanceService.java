package com.agrilabour.backend.service;

import com.agrilabour.backend.dto.AttendanceRequest;
import com.agrilabour.backend.dto.AttendanceResponse;
import com.agrilabour.backend.dto.WageSummaryResponse;
import com.agrilabour.backend.entity.*;
import com.agrilabour.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final JobRepository jobRepository;
    private final FarmerProfileRepository farmerProfileRepository;
    private final LabourerProfileRepository labourerProfileRepository;
    private final JobApplicationRepository jobApplicationRepository;

    @Transactional
    public AttendanceResponse logAttendance(Long farmerUserId, AttendanceRequest request) {
        FarmerProfile farmer = farmerProfileRepository.findByUserId(farmerUserId)
                .orElseThrow(() -> new IllegalArgumentException("Farmer profile not found for user ID: " + farmerUserId));

        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new IllegalArgumentException("Job posting not found with ID: " + request.getJobId()));

        if (!job.getFarmerProfile().getId().equals(farmer.getId())) {
            throw new IllegalArgumentException("You are not authorized to log attendance for this job");
        }

        LabourerProfile labourer = labourerProfileRepository.findById(request.getLabourerProfileId())
                .orElseThrow(() -> new IllegalArgumentException("Labourer profile not found with ID: " + request.getLabourerProfileId()));

        JobApplication application = jobApplicationRepository.findByJobIdAndLabourerProfileId(job.getId(), labourer.getId())
                .orElseThrow(() -> new IllegalArgumentException("Labourer has not applied for this job"));

        if (application.getStatus() != JobApplicationStatus.ACCEPTED) {
            throw new IllegalArgumentException("Attendance can only be logged for workers with an ACCEPTED job application");
        }

        BigDecimal calculatedWage = calculateWage(job, request.getStatus(), request.getHoursWorked());

        Optional<Attendance> existingOpt = attendanceRepository.findByJobIdAndLabourerProfileIdAndWorkDate(
                job.getId(), labourer.getId(), request.getWorkDate()
        );

        Attendance attendance;
        if (existingOpt.isPresent()) {
            attendance = existingOpt.get();
            attendance.setStatus(request.getStatus());
            attendance.setHoursWorked(request.getHoursWorked());
            attendance.setWageCalculated(calculatedWage);
            if (request.getRemarks() != null) {
                attendance.setRemarks(request.getRemarks());
            }
        } else {
            attendance = Attendance.builder()
                    .job(job)
                    .labourerProfile(labourer)
                    .workDate(request.getWorkDate())
                    .status(request.getStatus())
                    .hoursWorked(request.getHoursWorked())
                    .wageCalculated(calculatedWage)
                    .remarks(request.getRemarks())
                    .build();
        }

        Attendance saved = attendanceRepository.save(attendance);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<AttendanceResponse> getAttendanceByJobAndDate(Long farmerUserId, Long jobId, LocalDate date) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job posting not found with ID: " + jobId));

        if (!job.getFarmerProfile().getUser().getId().equals(farmerUserId)) {
            throw new IllegalArgumentException("You are not authorized to view attendance for this job");
        }

        return attendanceRepository.findByJobIdAndWorkDateOrderByLabourerProfileIdAsc(jobId, date).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public WageSummaryResponse getJobWageSummary(Long farmerUserId, Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job posting not found with ID: " + jobId));

        if (!job.getFarmerProfile().getUser().getId().equals(farmerUserId)) {
            throw new IllegalArgumentException("You are not authorized to view wage summary for this job");
        }

        List<Attendance> records = attendanceRepository.findByJobIdOrderByWorkDateDesc(jobId);
        return buildWageSummaryResponse(jobId, job.getTitle(), records);
    }

    @Transactional(readOnly = true)
    public WageSummaryResponse getLabourerWageSummary(Long labourerUserId, LocalDate startDate, LocalDate endDate) {
        LabourerProfile labourer = labourerProfileRepository.findByUserId(labourerUserId)
                .orElseThrow(() -> new IllegalArgumentException("Labourer profile not found for user ID: " + labourerUserId));

        List<Attendance> records;
        if (startDate != null && endDate != null) {
            records = attendanceRepository.findByLabourerProfileIdAndWorkDateBetweenOrderByWorkDateDesc(labourer.getId(), startDate, endDate);
        } else {
            records = attendanceRepository.findByLabourerProfileIdOrderByWorkDateDesc(labourer.getId());
        }

        return buildWageSummaryResponse(labourerUserId, labourer.getFullName(), records);
    }

    private BigDecimal calculateWage(Job job, AttendanceStatus status, Integer hoursWorked) {
        if (status == AttendanceStatus.ABSENT) {
            return BigDecimal.ZERO;
        }

        if (job.getWageBasis() == WageBasis.HOURLY) {
            int hours = (hoursWorked != null && hoursWorked > 0) ? hoursWorked :
                    (job.getWorkingHours() != null ? job.getWorkingHours() : 8);
            return job.getWageAmount().multiply(BigDecimal.valueOf(hours));
        } else {
            // DAILY wage basis
            if (status == AttendanceStatus.HALF_DAY) {
                return job.getWageAmount().multiply(BigDecimal.valueOf(0.5));
            } else { // PRESENT
                return job.getWageAmount();
            }
        }
    }

    private WageSummaryResponse buildWageSummaryResponse(Long targetId, String name, List<Attendance> records) {
        long presentCount = records.stream().filter(r -> r.getStatus() == AttendanceStatus.PRESENT).count();
        long halfDayCount = records.stream().filter(r -> r.getStatus() == AttendanceStatus.HALF_DAY).count();
        long absentCount = records.stream().filter(r -> r.getStatus() == AttendanceStatus.ABSENT).count();
        long totalHours = records.stream()
                .mapToLong(r -> r.getHoursWorked() != null ? r.getHoursWorked() : 0)
                .sum();

        BigDecimal totalWage = records.stream()
                .map(Attendance::getWageCalculated)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<AttendanceResponse> responseList = records.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return WageSummaryResponse.builder()
                .targetId(targetId)
                .name(name)
                .totalDaysPresent(presentCount)
                .totalDaysHalfDay(halfDayCount)
                .totalDaysAbsent(absentCount)
                .totalHoursWorked(totalHours)
                .totalWageEarned(totalWage)
                .attendanceRecords(responseList)
                .build();
    }

    private AttendanceResponse mapToResponse(Attendance attendance) {
        Job job = attendance.getJob();
        LabourerProfile labourer = attendance.getLabourerProfile();
        User labourerUser = labourer.getUser();

        return AttendanceResponse.builder()
                .id(attendance.getId())
                .jobId(job.getId())
                .jobTitle(job.getTitle())
                .labourerProfileId(labourer.getId())
                .labourerName(labourer.getFullName())
                .labourerPhoneNumber(labourerUser.getPhoneNumber())
                .workDate(attendance.getWorkDate())
                .hoursWorked(attendance.getHoursWorked())
                .status(attendance.getStatus())
                .wageBasis(job.getWageBasis())
                .wageAmountRate(job.getWageAmount())
                .wageCalculated(attendance.getWageCalculated())
                .remarks(attendance.getRemarks())
                .createdAt(attendance.getCreatedAt())
                .build();
    }
}
