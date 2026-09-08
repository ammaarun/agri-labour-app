package com.agrilabour.backend.controller;

import com.agrilabour.backend.dto.FarmerProfileRequest;
import com.agrilabour.backend.dto.FarmerProfileResponse;
import com.agrilabour.backend.dto.LabourerProfileRequest;
import com.agrilabour.backend.dto.LabourerProfileResponse;
import com.agrilabour.backend.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    // Get Labourer Profile
    @GetMapping("/labourer/{userId}")
    public ResponseEntity<LabourerProfileResponse> getLabourerProfile(
            @PathVariable Long userId,
            @RequestHeader(value = "Accept-Language", defaultValue = "en") String language
    ) {
        return ResponseEntity.ok(profileService.getLabourerProfileByUserId(userId, language));
    }

    // Update Labourer Profile
    @PutMapping("/labourer/{userId}")
    public ResponseEntity<LabourerProfileResponse> updateLabourerProfile(
            @PathVariable Long userId,
            @Valid @RequestBody LabourerProfileRequest request,
            @RequestHeader(value = "Accept-Language", defaultValue = "en") String language
    ) {
        return ResponseEntity.ok(profileService.updateLabourerProfile(userId, request, language));
    }

    // Get Farmer Profile
    @GetMapping("/farmer/{userId}")
    public ResponseEntity<FarmerProfileResponse> getFarmerProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(profileService.getFarmerProfileByUserId(userId));
    }

    // Update Farmer Profile
    @PutMapping("/farmer/{userId}")
    public ResponseEntity<FarmerProfileResponse> updateFarmerProfile(
            @PathVariable Long userId,
            @Valid @RequestBody FarmerProfileRequest request
    ) {
        return ResponseEntity.ok(profileService.updateFarmerProfile(userId, request));
    }
}
