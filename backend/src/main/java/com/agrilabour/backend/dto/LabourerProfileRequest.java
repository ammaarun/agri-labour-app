package com.agrilabour.backend.dto;

import com.agrilabour.backend.entity.WageBasis;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Set;

@Data
public class LabourerProfileRequest {

    @NotBlank(message = "Full name is required")
    @Size(max = 100, message = "Name must be less than 100 characters")
    private String fullName;

    @NotBlank(message = "Location is required")
    @Size(max = 150, message = "Location must be less than 150 characters")
    private String location;

    @Min(value = 18, message = "Age must be at least 18")
    @Max(value = 70, message = "Age must be less than 70")
    private Integer age;

    @Size(max = 15, message = "Gender must be less than 15 characters")
    private String gender;

    @Min(value = 0, message = "Experience cannot be negative")
    private Integer yearsOfExperience;

    @NotNull(message = "Expected wage is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Expected wage must be greater than 0")
    private BigDecimal expectedWage;

    @NotNull(message = "Wage basis is required")
    private WageBasis wageBasis;

    private boolean availability;

    private String profilePhotoUrl;

    private Set<Long> skillIds;
}
