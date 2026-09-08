package com.agrilabour.backend.dto;

import com.agrilabour.backend.entity.JobApplicationStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class JobApplicationStatusUpdateRequest {

    @NotNull(message = "Status is required (ACCEPTED or REJECTED)")
    private JobApplicationStatus status;

    @Size(max = 255, message = "Remarks must be less than 255 characters")
    private String remarks;
}
