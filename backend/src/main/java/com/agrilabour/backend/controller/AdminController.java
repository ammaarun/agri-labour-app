package com.agrilabour.backend.controller;

import com.agrilabour.backend.dto.AdminAnalyticsResponse;
import com.agrilabour.backend.dto.JobResponse;
import com.agrilabour.backend.dto.UserManagementResponse;
import com.agrilabour.backend.entity.JobStatus;
import com.agrilabour.backend.entity.Role;
import com.agrilabour.backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // Get system analytics dashboard metrics
    @GetMapping("/analytics")
    public ResponseEntity<AdminAnalyticsResponse> getSystemAnalytics() {
        return ResponseEntity.ok(adminService.getSystemAnalytics());
    }

    // Get user management list (optionally filtered by role)
    @GetMapping("/users")
    public ResponseEntity<List<UserManagementResponse>> getAllUsers(
            @RequestParam(required = false) Role role
    ) {
        return ResponseEntity.ok(adminService.getAllUsers(role));
    }

    // Verify or unverify a labourer profile
    @PatchMapping("/labourer/{labourerUserId}/verify")
    public ResponseEntity<UserManagementResponse> verifyLabourerProfile(
            @PathVariable Long labourerUserId,
            @RequestParam boolean isVerified
    ) {
        return ResponseEntity.ok(adminService.verifyLabourerProfile(labourerUserId, isVerified));
    }

    // Enable or disable a user account
    @PatchMapping("/users/{userId}/status")
    public ResponseEntity<UserManagementResponse> toggleUserStatus(
            @PathVariable Long userId,
            @RequestParam boolean enabled
    ) {
        return ResponseEntity.ok(adminService.toggleUserStatus(userId, enabled));
    }

    // Moderate a job posting status (e.g. CANCELLED, COMPLETED)
    @PatchMapping("/jobs/{jobId}/status")
    public ResponseEntity<JobResponse> moderateJobStatus(
            @PathVariable Long jobId,
            @RequestParam JobStatus status,
            @RequestHeader(value = "Accept-Language", defaultValue = "en") String language
    ) {
        return ResponseEntity.ok(adminService.moderateJobStatus(jobId, status, language));
    }
}
