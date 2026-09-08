package com.agrilabour.backend.service;

import com.agrilabour.backend.dto.JobRequest;
import com.agrilabour.backend.dto.JobResponse;
import com.agrilabour.backend.dto.SkillResponse;
import com.agrilabour.backend.entity.FarmerProfile;
import com.agrilabour.backend.entity.Job;
import com.agrilabour.backend.entity.JobStatus;
import com.agrilabour.backend.entity.Skill;
import com.agrilabour.backend.repository.FarmerProfileRepository;
import com.agrilabour.backend.repository.JobRepository;
import com.agrilabour.backend.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final FarmerProfileRepository farmerProfileRepository;
    private final SkillRepository skillRepository;

    @Transactional
    public JobResponse createJob(Long farmerUserId, JobRequest request, String language) {
        FarmerProfile farmerProfile = farmerProfileRepository.findByUserId(farmerUserId)
                .orElseThrow(() -> new IllegalArgumentException("Farmer profile not found for user ID: " + farmerUserId));

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new IllegalArgumentException("End date cannot be before start date");
        }

        Set<Skill> skills = new HashSet<>();
        if (request.getRequiredSkillIds() != null && !request.getRequiredSkillIds().isEmpty()) {
            skills.addAll(skillRepository.findAllById(request.getRequiredSkillIds()));
        }

        Job job = Job.builder()
                .farmerProfile(farmerProfile)
                .title(request.getTitle())
                .workType(request.getWorkType())
                .description(request.getDescription())
                .numLabourersRequired(request.getNumLabourersRequired())
                .requiredSkills(skills)
                .farmLocation(request.getFarmLocation())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .workingHours(request.getWorkingHours())
                .wageAmount(request.getWageAmount())
                .wageBasis(request.getWageBasis())
                .foodProvided(request.isFoodProvided())
                .accommodationProvided(request.isAccommodationProvided())
                .status(JobStatus.OPEN)
                .build();

        Job savedJob = jobRepository.save(job);
        return mapToJobResponse(savedJob, language);
    }

    @Transactional
    public JobResponse updateJob(Long farmerUserId, Long jobId, JobRequest request, String language) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job posting not found with ID: " + jobId));

        if (!job.getFarmerProfile().getUser().getId().equals(farmerUserId)) {
            throw new IllegalArgumentException("You are not authorized to update this job posting");
        }

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new IllegalArgumentException("End date cannot be before start date");
        }

        job.setTitle(request.getTitle());
        job.setWorkType(request.getWorkType());
        job.setDescription(request.getDescription());
        job.setNumLabourersRequired(request.getNumLabourersRequired());
        job.setFarmLocation(request.getFarmLocation());
        job.setStartDate(request.getStartDate());
        job.setEndDate(request.getEndDate());
        job.setWorkingHours(request.getWorkingHours());
        job.setWageAmount(request.getWageAmount());
        job.setWageBasis(request.getWageBasis());
        job.setFoodProvided(request.isFoodProvided());
        job.setAccommodationProvided(request.isAccommodationProvided());

        if (request.getRequiredSkillIds() != null) {
            Set<Skill> skills = new HashSet<>(skillRepository.findAllById(request.getRequiredSkillIds()));
            job.setRequiredSkills(skills);
        }

        Job updatedJob = jobRepository.save(job);
        return mapToJobResponse(updatedJob, language);
    }

    @Transactional(readOnly = true)
    public JobResponse getJobById(Long jobId, String language) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job posting not found with ID: " + jobId));
        return mapToJobResponse(job, language);
    }

    @Transactional(readOnly = true)
    public List<JobResponse> getJobsByFarmerUserId(Long farmerUserId, String language) {
        FarmerProfile farmerProfile = farmerProfileRepository.findByUserId(farmerUserId)
                .orElseThrow(() -> new IllegalArgumentException("Farmer profile not found for user ID: " + farmerUserId));

        return jobRepository.findByFarmerProfileIdOrderByCreatedAtDesc(farmerProfile.getId()).stream()
                .map(job -> mapToJobResponse(job, language))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<JobResponse> filterJobs(
            String location,
            String workType,
            JobStatus status,
            Long skillId,
            BigDecimal minWage,
            BigDecimal maxWage,
            String language
    ) {
        // Default to OPEN status if not specified for general searching
        JobStatus targetStatus = (status != null) ? status : JobStatus.OPEN;

        return jobRepository.filterJobs(location, workType, targetStatus, skillId, minWage, maxWage).stream()
                .map(job -> mapToJobResponse(job, language))
                .collect(Collectors.toList());
    }

    @Transactional
    public JobResponse updateJobStatus(Long farmerUserId, Long jobId, JobStatus newStatus, String language) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job posting not found with ID: " + jobId));

        if (!job.getFarmerProfile().getUser().getId().equals(farmerUserId)) {
            throw new IllegalArgumentException("You are not authorized to update this job status");
        }

        job.setStatus(newStatus);
        Job updatedJob = jobRepository.save(job);
        return mapToJobResponse(updatedJob, language);
    }

    private JobResponse mapToJobResponse(Job job, String language) {
        FarmerProfile farmer = job.getFarmerProfile();
        List<SkillResponse> skills = job.getRequiredSkills().stream()
                .map(skill -> mapToSkillResponse(skill, language))
                .collect(Collectors.toList());

        return JobResponse.builder()
                .id(job.getId())
                .farmerId(farmer.getId())
                .farmerName(farmer.getFullName())
                .farmName(farmer.getFarmName())
                .contactNumber(farmer.getContactNumber())
                .title(job.getTitle())
                .workType(job.getWorkType())
                .description(job.getDescription())
                .numLabourersRequired(job.getNumLabourersRequired())
                .requiredSkills(skills)
                .farmLocation(job.getFarmLocation())
                .startDate(job.getStartDate())
                .endDate(job.getEndDate())
                .workingHours(job.getWorkingHours())
                .wageAmount(job.getWageAmount())
                .wageBasis(job.getWageBasis())
                .foodProvided(job.isFoodProvided())
                .accommodationProvided(job.isAccommodationProvided())
                .status(job.getStatus())
                .createdAt(job.getCreatedAt())
                .build();
    }

    private SkillResponse mapToSkillResponse(Skill skill, String language) {
        boolean isTelugu = "te".equalsIgnoreCase(language);
        return SkillResponse.builder()
                .id(skill.getId())
                .name(isTelugu ? skill.getNameTe() : skill.getNameEn())
                .description(isTelugu ? skill.getDescriptionTe() : skill.getDescriptionEn())
                .build();
    }
}
