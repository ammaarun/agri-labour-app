package com.agrilabour.backend.dto;

import com.agrilabour.backend.entity.JobStatus;
import com.agrilabour.backend.entity.WageBasis;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobResponse {
    private Long id;
    private Long farmerId;
    private String farmerName;
    private String farmName;
    private String contactNumber;
    
    private String title;
    private String workType;
    private String description;
    private Integer numLabourersRequired;
    private List<SkillResponse> requiredSkills;
    
    private String farmLocation;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer workingHours;
    private BigDecimal wageAmount;
    private WageBasis wageBasis;
    private boolean foodProvided;
    private boolean accommodationProvided;
    
    private JobStatus status;
    private LocalDateTime createdAt;
}
