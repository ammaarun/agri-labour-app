package com.agrilabour.backend.service;

import com.agrilabour.backend.dto.JobApplicationRequest;
import com.agrilabour.backend.dto.JobApplicationResponse;
import com.agrilabour.backend.dto.JobApplicationStatusUpdateRequest;
import com.agrilabour.backend.entity.*;
import com.agrilabour.backend.repository.JobApplicationRepository;
import com.agrilabour.backend.repository.JobRepository;
import com.agrilabour.backend.repository.LabourerProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final JobRepository jobRepository;
    private final LabourerProfileRepository labourerProfileRepository;

    @Transactional
    public JobApplicationResponse applyForJob(Long labourerUserId, JobApplicationRequest request) {
        LabourerProfile labourerProfile = labourerProfileRepository.findByUserId(labourerUserId)
                .orElseThrow(() -> new IllegalArgumentException("Labourer profile not found for user ID: " + labourerUserId));

        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new IllegalArgumentException("Job posting not found with ID: " + request.getJobId()));

        if (job.getStatus() != JobStatus.OPEN) {
            throw new IllegalArgumentException("Cannot apply to a job that is not OPEN");
        }

        if (jobApplicationRepository.existsByJobIdAndLabourerProfileId(job.getId(), labourerProfile.getId())) {
            throw new IllegalArgumentException("You have already applied for this job");
        }

        JobApplication application = JobApplication.builder()
                .job(job)
                .labourerProfile(labourerProfile)
                .status(JobApplicationStatus.PENDING)
                .remarks(request.getRemarks())
                .build();

        JobApplication saved = jobApplicationRepository.save(application);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<JobApplicationResponse> getApplicationsForJob(Long farmerUserId, Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job posting not found with ID: " + jobId));

        if (!job.getFarmerProfile().getUser().getId().equals(farmerUserId)) {
            throw new IllegalArgumentException("You are not authorized to view applications for this job");
        }

        return jobApplicationRepository.findByJobIdOrderByApplicationDateDesc(jobId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<JobApplicationResponse> getApplicationsByLabourer(Long labourerUserId) {
        LabourerProfile labourerProfile = labourerProfileRepository.findByUserId(labourerUserId)
                .orElseThrow(() -> new IllegalArgumentException("Labourer profile not found for user ID: " + labourerUserId));

        return jobApplicationRepository.findByLabourerProfileIdOrderByApplicationDateDesc(labourerProfile.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public JobApplicationResponse updateApplicationStatus(
            Long farmerUserId,
            Long applicationId,
            JobApplicationStatusUpdateRequest request
    ) {
        JobApplication application = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("Job application not found with ID: " + applicationId));

        Job job = application.getJob();
        if (!job.getFarmerProfile().getUser().getId().equals(farmerUserId)) {
            throw new IllegalArgumentException("You are not authorized to update this application");
        }

        application.setStatus(request.getStatus());
        if (request.getRemarks() != null) {
            application.setRemarks(request.getRemarks());
        }

        JobApplication updated = jobApplicationRepository.save(application);

        // Business Rule: Auto-update job status to IN_PROGRESS if required labourers quota is filled
        if (request.getStatus() == JobApplicationStatus.ACCEPTED) {
            long acceptedCount = jobApplicationRepository.countByJobIdAndStatus(job.getId(), JobApplicationStatus.ACCEPTED);
            if (acceptedCount >= job.getNumLabourersRequired() && job.getStatus() == JobStatus.OPEN) {
                job.setStatus(JobStatus.IN_PROGRESS);
                jobRepository.save(job);
            }
        }

        return mapToResponse(updated);
    }

    @Transactional
    public JobApplicationResponse withdrawApplication(Long labourerUserId, Long applicationId) {
        JobApplication application = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("Job application not found with ID: " + applicationId));

        LabourerProfile labourerProfile = labourerProfileRepository.findByUserId(labourerUserId)
                .orElseThrow(() -> new IllegalArgumentException("Labourer profile not found for user ID: " + labourerUserId));

        if (!application.getLabourerProfile().getId().equals(labourerProfile.getId())) {
            throw new IllegalArgumentException("You are not authorized to withdraw this application");
        }

        application.setStatus(JobApplicationStatus.CANCELLED);
        JobApplication updated = jobApplicationRepository.save(application);
        return mapToResponse(updated);
    }

    private JobApplicationResponse mapToResponse(JobApplication application) {
        Job job = application.getJob();
        FarmerProfile farmer = job.getFarmerProfile();
        LabourerProfile labourer = application.getLabourerProfile();
        User labourerUser = labourer.getUser();

        return JobApplicationResponse.builder()
                .id(application.getId())
                .jobId(job.getId())
                .jobTitle(job.getTitle())
                .farmLocation(job.getFarmLocation())
                .wageAmount(job.getWageAmount())
                .wageBasis(job.getWageBasis())
                .farmerName(farmer.getFullName())
                .farmerContact(farmer.getContactNumber())
                .labourerProfileId(labourer.getId())
                .labourerName(labourer.getFullName())
                .labourerLocation(labourer.getLocation())
                .labourerPhoneNumber(labourerUser.getPhoneNumber())
                .labourerExperience(labourer.getYearsOfExperience())
                .labourerRating(labourer.getAverageRating())
                .status(application.getStatus())
                .applicationDate(application.getApplicationDate())
                .remarks(application.getRemarks())
                .build();
    }
}
