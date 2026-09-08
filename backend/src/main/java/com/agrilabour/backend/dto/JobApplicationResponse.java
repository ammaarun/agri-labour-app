package com.agrilabour.backend.dto;

import com.agrilabour.backend.entity.JobApplicationStatus;
import com.agrilabour.backend.entity.WageBasis;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobApplicationResponse {
    private Long id;
    
    // Job details
    private Long jobId;
    private String jobTitle;
    private String farmLocation;
    private BigDecimal wageAmount;
    private WageBasis wageBasis;
    
    // Farmer details
    private String farmerName;
    private String farmerContact;
    
    // Labourer details
    private Long labourerProfileId;
    private String labourerName;
    private String labourerLocation;
    private String labourerPhoneNumber;
    private Integer labourerExperience;
    private Double labourerRating;
    
    // Application details
    private JobApplicationStatus status;
    private LocalDateTime applicationDate;
    private String remarks;
}
