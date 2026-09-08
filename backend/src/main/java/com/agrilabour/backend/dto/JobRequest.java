package com.agrilabour.backend.dto;

import com.agrilabour.backend.entity.WageBasis;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

@Data
public class JobRequest {

    @NotBlank(message = "Job title is required")
    @Size(max = 100, message = "Title must be less than 100 characters")
    private String title;

    @Size(max = 50, message = "Work type must be less than 50 characters")
    private String workType;

    private String description;

    @NotNull(message = "Number of labourers required is mandatory")
    @Min(value = 1, message = "At least 1 labourer is required")
    private Integer numLabourersRequired;

    private Set<Long> requiredSkillIds;

    @NotBlank(message = "Farm location is required")
    @Size(max = 255, message = "Location must be less than 255 characters")
    private String farmLocation;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    @Min(value = 1, message = "Working hours must be positive")
    private Integer workingHours;

    @NotNull(message = "Wage amount is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Wage must be greater than 0")
    private BigDecimal wageAmount;

    @NotNull(message = "Wage basis is required")
    private WageBasis wageBasis;

    private boolean foodProvided;

    private boolean accommodationProvided;
}
