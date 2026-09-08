package com.agrilabour.backend.dto;

import com.agrilabour.backend.entity.AttendanceStatus;
import com.agrilabour.backend.entity.WageBasis;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceResponse {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private Long labourerProfileId;
    private String labourerName;
    private String labourerPhoneNumber;
    private LocalDate workDate;
    private Integer hoursWorked;
    private AttendanceStatus status;
    private WageBasis wageBasis;
    private BigDecimal wageAmountRate;
    private BigDecimal wageCalculated;
    private String remarks;
    private LocalDateTime createdAt;
}
