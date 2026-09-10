package com.agrilabour.backend.controller;

import com.agrilabour.backend.dto.RatingRequest;
import com.agrilabour.backend.dto.RatingResponse;
import com.agrilabour.backend.dto.RatingSummaryResponse;
import com.agrilabour.backend.service.RatingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    // Submit a rating for a job engagement
    @PostMapping("/{reviewerUserId}")
    public ResponseEntity<RatingResponse> submitRating(
            @PathVariable Long reviewerUserId,
            @Valid @RequestBody RatingRequest request
    ) {
        return ResponseEntity.ok(ratingService.submitRating(reviewerUserId, request));
    }

    // View rating summary and reviews received by a user (Farmer or Labourer)
    @GetMapping("/user/{userId}")
    public ResponseEntity<RatingSummaryResponse> getRatingsForUser(@PathVariable Long userId) {
        return ResponseEntity.ok(ratingService.getRatingsForUser(userId));
    }

    // View all ratings submitted for a specific job
    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<RatingResponse>> getRatingsForJob(@PathVariable Long jobId) {
        return ResponseEntity.ok(ratingService.getRatingsForJob(jobId));
    }
}
