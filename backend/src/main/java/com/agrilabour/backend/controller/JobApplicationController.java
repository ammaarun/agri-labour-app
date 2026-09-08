package com.agrilabour.backend.controller;

import com.agrilabour.backend.dto.JobApplicationRequest;
import com.agrilabour.backend.dto.JobApplicationResponse;
import com.agrilabour.backend.dto.JobApplicationStatusUpdateRequest;
import com.agrilabour.backend.service.JobApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;

    // Labourer applies for a job
    @PostMapping("/labourer/{labourerUserId}")
    public ResponseEntity<JobApplicationResponse> applyForJob(
            @PathVariable Long labourerUserId,
            @Valid @RequestBody JobApplicationRequest request
    ) {
        return ResponseEntity.ok(jobApplicationService.applyForJob(labourerUserId, request));
    }

    // Labourer views their applications
    @GetMapping("/labourer/{labourerUserId}")
    public ResponseEntity<List<JobApplicationResponse>> getApplicationsByLabourer(@PathVariable Long labourerUserId) {
        return ResponseEntity.ok(jobApplicationService.getApplicationsByLabourer(labourerUserId));
    }

    // Labourer withdraws an application
    @PatchMapping("/labourer/{labourerUserId}/{applicationId}/withdraw")
    public ResponseEntity<JobApplicationResponse> withdrawApplication(
            @PathVariable Long labourerUserId,
            @PathVariable Long applicationId
    ) {
        return ResponseEntity.ok(jobApplicationService.withdrawApplication(labourerUserId, applicationId));
    }

    // Farmer views applications for a specific job
    @GetMapping("/farmer/{farmerUserId}/job/{jobId}")
    public ResponseEntity<List<JobApplicationResponse>> getApplicationsForJob(
            @PathVariable Long farmerUserId,
            @PathVariable Long jobId
    ) {
        return ResponseEntity.ok(jobApplicationService.getApplicationsForJob(farmerUserId, jobId));
    }

    // Farmer accepts or rejects an application
    @PatchMapping("/farmer/{farmerUserId}/{applicationId}/status")
    public ResponseEntity<JobApplicationResponse> updateApplicationStatus(
            @PathVariable Long farmerUserId,
            @PathVariable Long applicationId,
            @Valid @RequestBody JobApplicationStatusUpdateRequest request
    ) {
        return ResponseEntity.ok(jobApplicationService.updateApplicationStatus(farmerUserId, applicationId, request));
    }
}
