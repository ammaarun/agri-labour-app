package com.agrilabour.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class JobApplicationRequest {

    @NotNull(message = "Job ID is mandatory")
    private Long jobId;

    @Size(max = 255, message = "Remarks must be less than 255 characters")
    private String remarks;
}
