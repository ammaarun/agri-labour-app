package com.agrilabour.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RatingResponse {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private Long reviewerUserId;
    private String reviewerName;
    private String reviewerRole;
    private Long revieweeUserId;
    private String revieweeName;
    private Integer ratingValue;
    private String reviewText;
    private LocalDateTime createdAt;
}
