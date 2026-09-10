package com.agrilabour.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RatingSummaryResponse {
    private Long userId;
    private String userName;
    private Double averageRating;
    private long totalReviews;
    private List<RatingResponse> reviews;
}
