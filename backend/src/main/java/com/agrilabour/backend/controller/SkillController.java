package com.agrilabour.backend.controller;

import com.agrilabour.backend.dto.SkillResponse;
import com.agrilabour.backend.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
@RequiredArgsConstructor
public class SkillController {

    private final ProfileService profileService;

    @GetMapping
    public ResponseEntity<List<SkillResponse>> getAllSkills(
            @RequestHeader(value = "Accept-Language", defaultValue = "en") String language
    ) {
        return ResponseEntity.ok(profileService.getAllSkills(language));
    }
}
