package com.agrilabour.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RatingRequest {

    @NotNull(message = "Job ID is required")
    private Long jobId;

    @NotNull(message = "Reviewee User ID is required")
    private Long revieweeUserId;

    @NotNull(message = "Rating value is required")
    @Min(value = 1, message = "Rating must be at least 1 star")
    @Max(value = 5, message = "Rating cannot exceed 5 stars")
    private Integer ratingValue;

    @Size(max = 500, message = "Review text must be less than 500 characters")
    private String reviewText;
}
