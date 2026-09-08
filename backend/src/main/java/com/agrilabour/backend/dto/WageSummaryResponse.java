package com.agrilabour.backend.dto;

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
public class WageSummaryResponse {
    private Long targetId; // Farmer User ID or Labourer User ID or Job ID
    private String name;
    private long totalDaysPresent;
    private long totalDaysHalfDay;
    private long totalDaysAbsent;
    private long totalHoursWorked;
    private BigDecimal totalWageEarned;
    private List<AttendanceResponse> attendanceRecords;
}
