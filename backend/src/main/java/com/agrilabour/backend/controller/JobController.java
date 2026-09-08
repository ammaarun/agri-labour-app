package com.agrilabour.backend.controller;

import com.agrilabour.backend.dto.JobRequest;
import com.agrilabour.backend.dto.JobResponse;
import com.agrilabour.backend.entity.JobStatus;
import com.agrilabour.backend.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    // Create Job Posting
    @PostMapping("/farmer/{farmerUserId}")
    public ResponseEntity<JobResponse> createJob(
            @PathVariable Long farmerUserId,
            @Valid @RequestBody JobRequest request,
            @RequestHeader(value = "Accept-Language", defaultValue = "en") String language
    ) {
        return ResponseEntity.ok(jobService.createJob(farmerUserId, request, language));
    }

    // Update Job Posting
    @PutMapping("/farmer/{farmerUserId}/{jobId}")
    public ResponseEntity<JobResponse> updateJob(
            @PathVariable Long farmerUserId,
            @PathVariable Long jobId,
            @Valid @RequestBody JobRequest request,
            @RequestHeader(value = "Accept-Language", defaultValue = "en") String language
    ) {
        return ResponseEntity.ok(jobService.updateJob(farmerUserId, jobId, request, language));
    }

    // Update Job Status (Cancel, Complete, etc.)
    @PatchMapping("/farmer/{farmerUserId}/{jobId}/status")
    public ResponseEntity<JobResponse> updateJobStatus(
            @PathVariable Long farmerUserId,
            @PathVariable Long jobId,
            @RequestParam JobStatus status,
            @RequestHeader(value = "Accept-Language", defaultValue = "en") String language
    ) {
        return ResponseEntity.ok(jobService.updateJobStatus(farmerUserId, jobId, status, language));
    }

    // Get single Job by ID
    @GetMapping("/{jobId}")
    public ResponseEntity<JobResponse> getJobById(
            @PathVariable Long jobId,
            @RequestHeader(value = "Accept-Language", defaultValue = "en") String language
    ) {
        return ResponseEntity.ok(jobService.getJobById(jobId, language));
    }

    // Get Jobs posted by a specific Farmer
    @GetMapping("/farmer/{farmerUserId}")
    public ResponseEntity<List<JobResponse>> getJobsByFarmer(
            @PathVariable Long farmerUserId,
            @RequestHeader(value = "Accept-Language", defaultValue = "en") String language
    ) {
        return ResponseEntity.ok(jobService.getJobsByFarmerUserId(farmerUserId, language));
    }

    // Search and Filter Jobs for Labourers
    @GetMapping("/search")
    public ResponseEntity<List<JobResponse>> filterJobs(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String workType,
            @RequestParam(required = false) JobStatus status,
            @RequestParam(required = false) BigDecimal minWage,
            @RequestParam(required = false) BigDecimal maxWage,
            @RequestHeader(value = "Accept-Language", defaultValue = "en") String language
    ) {
        return ResponseEntity.ok(jobService.filterJobs(location, workType, status, minWage, maxWage, language));
    }
}
