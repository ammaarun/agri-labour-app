package com.agrilabour.backend.service;

import com.agrilabour.backend.dto.RatingRequest;
import com.agrilabour.backend.dto.RatingResponse;
import com.agrilabour.backend.dto.RatingSummaryResponse;
import com.agrilabour.backend.entity.*;
import com.agrilabour.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final LabourerProfileRepository labourerProfileRepository;
    private final FarmerProfileRepository farmerProfileRepository;

    @Transactional
    public RatingResponse submitRating(Long reviewerUserId, RatingRequest request) {
        if (reviewerUserId.equals(request.getRevieweeUserId())) {
            throw new IllegalArgumentException("You cannot rate yourself");
        }

        User reviewer = userRepository.findById(reviewerUserId)
                .orElseThrow(() -> new IllegalArgumentException("Reviewer user not found with ID: " + reviewerUserId));

        User reviewee = userRepository.findById(request.getRevieweeUserId())
                .orElseThrow(() -> new IllegalArgumentException("Reviewee user not found with ID: " + request.getRevieweeUserId()));

        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new IllegalArgumentException("Job posting not found with ID: " + request.getJobId()));

        // Validate engagement relationship between farmer and labourer
        validateEngagement(job, reviewer, reviewee);

        if (ratingRepository.existsByJobIdAndReviewerIdAndRevieweeId(job.getId(), reviewer.getId(), reviewee.getId())) {
            throw new IllegalArgumentException("You have already submitted a rating for this user on this job");
        }

        Rating rating = Rating.builder()
                .job(job)
                .reviewer(reviewer)
                .reviewee(reviewee)
                .ratingValue(request.getRatingValue())
                .reviewText(request.getReviewText())
                .build();

        Rating saved = ratingRepository.save(rating);

        // Update average rating on target user's profile if applicable
        updateAverageRating(reviewee);

        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public RatingSummaryResponse getRatingsForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        List<Rating> ratings = ratingRepository.findByRevieweeIdOrderByCreatedAtDesc(userId);
        Double avgRating = ratingRepository.getAverageRatingForUser(userId);
        long count = ratingRepository.countByRevieweeId(userId);

        String userName = getUserFullName(user);

        List<RatingResponse> responseList = ratings.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return RatingSummaryResponse.builder()
                .userId(userId)
                .userName(userName)
                .averageRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0)
                .totalReviews(count)
                .reviews(responseList)
                .build();
    }

    @Transactional(readOnly = true)
    public List<RatingResponse> getRatingsForJob(Long jobId) {
        if (!jobRepository.existsById(jobId)) {
            throw new IllegalArgumentException("Job posting not found with ID: " + jobId);
        }

        return ratingRepository.findByJobIdOrderByCreatedAtDesc(jobId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private void validateEngagement(Job job, User reviewer, User reviewee) {
        if (reviewer.getRole() == Role.FARMER && reviewee.getRole() == Role.LABOURER) {
            if (!job.getFarmerProfile().getUser().getId().equals(reviewer.getId())) {
                throw new IllegalArgumentException("You are not the farmer for this job posting");
            }
            LabourerProfile labourer = labourerProfileRepository.findByUserId(reviewee.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Labourer profile not found for user ID: " + reviewee.getId()));

            JobApplication application = jobApplicationRepository.findByJobIdAndLabourerProfileId(job.getId(), labourer.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Labourer has not applied for this job"));

            if (application.getStatus() != JobApplicationStatus.ACCEPTED) {
                throw new IllegalArgumentException("You can only rate labourers whose job application was ACCEPTED");
            }
        } else if (reviewer.getRole() == Role.LABOURER && reviewee.getRole() == Role.FARMER) {
            if (!job.getFarmerProfile().getUser().getId().equals(reviewee.getId())) {
                throw new IllegalArgumentException("Target user is not the farmer for this job");
            }
            LabourerProfile labourer = labourerProfileRepository.findByUserId(reviewer.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Labourer profile not found for user ID: " + reviewer.getId()));

            JobApplication application = jobApplicationRepository.findByJobIdAndLabourerProfileId(job.getId(), labourer.getId())
                    .orElseThrow(() -> new IllegalArgumentException("You have not applied for this job"));

            if (application.getStatus() != JobApplicationStatus.ACCEPTED) {
                throw new IllegalArgumentException("You can only rate farmers for jobs where your application was ACCEPTED");
            }
        } else {
            throw new IllegalArgumentException("Ratings can only be exchanged between Farmers and Labourers");
        }
    }

    private void updateAverageRating(User reviewee) {
        Double avg = ratingRepository.getAverageRatingForUser(reviewee.getId());
        if (avg != null) {
            double roundedAvg = Math.round(avg * 10.0) / 10.0;
            if (reviewee.getRole() == Role.LABOURER) {
                labourerProfileRepository.findByUserId(reviewee.getId()).ifPresent(profile -> {
                    profile.setAverageRating(roundedAvg);
                    labourerProfileRepository.save(profile);
                });
            }
        }
    }

    private String getUserFullName(User user) {
        if (user.getRole() == Role.LABOURER) {
            return labourerProfileRepository.findByUserId(user.getId())
                    .map(LabourerProfile::getFullName)
                    .orElse("Labourer #" + user.getId());
        } else if (user.getRole() == Role.FARMER) {
            return farmerProfileRepository.findByUserId(user.getId())
                    .map(FarmerProfile::getFullName)
                    .orElse("Farmer #" + user.getId());
        }
        return "User #" + user.getId();
    }

    private RatingResponse mapToResponse(Rating rating) {
        User reviewer = rating.getReviewer();
        User reviewee = rating.getReviewee();

        return RatingResponse.builder()
                .id(rating.getId())
                .jobId(rating.getJob().getId())
                .jobTitle(rating.getJob().getTitle())
                .reviewerUserId(reviewer.getId())
                .reviewerName(getUserFullName(reviewer))
                .reviewerRole(reviewer.getRole().name())
                .revieweeUserId(reviewee.getId())
                .revieweeName(getUserFullName(reviewee))
                .ratingValue(rating.getRatingValue())
                .reviewText(rating.getReviewText())
                .createdAt(rating.getCreatedAt())
                .build();
    }
}
