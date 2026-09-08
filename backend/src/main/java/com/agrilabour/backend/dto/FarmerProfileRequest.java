package com.agrilabour.backend.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class FarmerProfileRequest {

    @NotBlank(message = "Full name is required")
    @Size(max = 100, message = "Name must be less than 100 characters")
    private String fullName;

    @Size(max = 150, message = "Farm name must be less than 150 characters")
    private String farmName;

    @NotBlank(message = "Farm location is required")
    @Size(max = 255, message = "Farm location must be less than 255 characters")
    private String farmLocation;

    @Size(max = 15, message = "Contact number must be less than 15 characters")
    private String contactNumber;
}
