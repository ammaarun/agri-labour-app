package com.agrilabour.backend.dto;

import com.agrilabour.backend.entity.WageBasis;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LabourerProfileResponse {
    private Long id;
    private Long userId;
    private String phoneNumber;
    private String email;
    private String fullName;
    private String location;
    private Integer age;
    private String gender;
    private Integer yearsOfExperience;
    private BigDecimal expectedWage;
    private WageBasis wageBasis;
    private boolean availability;
    private String profilePhotoUrl;
    private boolean isVerified;
    private Double averageRating;
    private List<SkillResponse> skills;
}
