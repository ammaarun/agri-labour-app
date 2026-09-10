package com.agrilabour.backend.service;

import com.agrilabour.backend.dto.AdminAnalyticsResponse;
import com.agrilabour.backend.dto.JobResponse;
import com.agrilabour.backend.dto.UserManagementResponse;
import com.agrilabour.backend.entity.*;
import com.agrilabour.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final AttendanceRepository attendanceRepository;
    private final LabourerProfileRepository labourerProfileRepository;
    private final FarmerProfileRepository farmerProfileRepository;
    private final JobService jobService;

    @Transactional(readOnly = true)
    public AdminAnalyticsResponse getSystemAnalytics() {
        long totalUsers = userRepository.count();
        long totalFarmers = userRepository.findAll().stream().filter(u -> u.getRole() == Role.FARMER).count();
        long totalLabourers = userRepository.findAll().stream().filter(u -> u.getRole() == Role.LABOURER).count();

        List<Job> jobs = jobRepository.findAll();
        long totalJobs = jobs.size();
        long openJobs = jobs.stream().filter(j -> j.getStatus() == JobStatus.OPEN).count();
        long inProgressJobs = jobs.stream().filter(j -> j.getStatus() == JobStatus.IN_PROGRESS).count();
        long completedJobs = jobs.stream().filter(j -> j.getStatus() == JobStatus.COMPLETED).count();
        long cancelledJobs = jobs.stream().filter(j -> j.getStatus() == JobStatus.CANCELLED).count();

        long totalApps = jobApplicationRepository.count();
        long acceptedApps = jobApplicationRepository.findAll().stream()
                .filter(a -> a.getStatus() == JobApplicationStatus.ACCEPTED).count();

        BigDecimal totalWages = attendanceRepository.findAll().stream()
                .map(Attendance::getWageCalculated)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return AdminAnalyticsResponse.builder()
                .totalUsers(totalUsers)
                .totalFarmers(totalFarmers)
                .totalLabourers(totalLabourers)
                .totalJobs(totalJobs)
                .openJobs(openJobs)
                .inProgressJobs(inProgressJobs)
                .completedJobs(completedJobs)
                .cancelledJobs(cancelledJobs)
                .totalApplications(totalApps)
                .acceptedApplications(acceptedApps)
                .totalWagesCalculated(totalWages)
                .build();
    }

    @Transactional(readOnly = true)
    public List<UserManagementResponse> getAllUsers(Role roleFilter) {
        List<User> users = userRepository.findAll();
        if (roleFilter != null) {
            users = users.stream().filter(u -> u.getRole() == roleFilter).collect(Collectors.toList());
        }

        return users.stream().map(this::mapToUserManagementResponse).collect(Collectors.toList());
    }

    @Transactional
    public UserManagementResponse verifyLabourerProfile(Long labourerUserId, boolean isVerified) {
        LabourerProfile profile = labourerProfileRepository.findByUserId(labourerUserId)
                .orElseThrow(() -> new IllegalArgumentException("Labourer profile not found for user ID: " + labourerUserId));

        profile.setVerified(isVerified);
        labourerProfileRepository.save(profile);

        return mapToUserManagementResponse(profile.getUser());
    }

    @Transactional
    public UserManagementResponse toggleUserStatus(Long userId, boolean enabled) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        user.setActive(enabled);
        User updated = userRepository.save(user);

        return mapToUserManagementResponse(updated);
    }

    @Transactional
    public JobResponse moderateJobStatus(Long jobId, JobStatus newStatus, String language) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job posting not found with ID: " + jobId));

        job.setStatus(newStatus);
        Job updatedJob = jobRepository.save(job);

        return jobService.getJobById(updatedJob.getId(), language);
    }

    private UserManagementResponse mapToUserManagementResponse(User user) {
        String fullName = "User #" + user.getId();
        String location = "N/A";
        Boolean isVerified = null;

        if (user.getRole() == Role.LABOURER) {
            Optional<LabourerProfile> profileOpt = labourerProfileRepository.findByUserId(user.getId());
            if (profileOpt.isPresent()) {
                LabourerProfile p = profileOpt.get();
                fullName = p.getFullName();
                location = p.getLocation();
                isVerified = p.isVerified();
            }
        } else if (user.getRole() == Role.FARMER) {
            Optional<FarmerProfile> profileOpt = farmerProfileRepository.findByUserId(user.getId());
            if (profileOpt.isPresent()) {
                FarmerProfile p = profileOpt.get();
                fullName = p.getFullName();
                location = p.getFarmLocation();
            }
        }

        return UserManagementResponse.builder()
                .userId(user.getId())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole())
                .fullName(fullName)
                .location(location)
                .isVerified(isVerified)
                .enabled(user.isActive())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
