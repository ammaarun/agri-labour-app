package com.agrilabour.backend.dto;

import com.agrilabour.backend.entity.AttendanceStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class AttendanceRequest {

    @NotNull(message = "Job ID is required")
    private Long jobId;

    @NotNull(message = "Labourer profile ID is required")
    private Long labourerProfileId;

    @NotNull(message = "Work date is required")
    private LocalDate workDate;

    @NotNull(message = "Attendance status is required")
    private AttendanceStatus status;

    @Min(value = 1, message = "Hours worked must be positive")
    private Integer hoursWorked;

    private String remarks;
}
