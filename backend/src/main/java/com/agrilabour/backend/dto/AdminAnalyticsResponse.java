package com.agrilabour.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminAnalyticsResponse {
    private long totalUsers;
    private long totalFarmers;
    private long totalLabourers;
    
    private long totalJobs;
    private long openJobs;
    private long inProgressJobs;
    private long completedJobs;
    private long cancelledJobs;
    
    private long totalApplications;
    private long acceptedApplications;
    
    private BigDecimal totalWagesCalculated;
}
