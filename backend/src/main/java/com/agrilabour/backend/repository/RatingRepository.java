package com.agrilabour.backend.repository;

import com.agrilabour.backend.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {

    List<Rating> findByRevieweeIdOrderByCreatedAtDesc(Long revieweeId);

    List<Rating> findByJobIdOrderByCreatedAtDesc(Long jobId);

    boolean existsByJobIdAndReviewerIdAndRevieweeId(Long jobId, Long reviewerId, Long revieweeId);

    @Query("SELECT AVG(r.ratingValue) FROM Rating r WHERE r.reviewee.id = :revieweeId")
    Double getAverageRatingForUser(@Param("revieweeId") Long revieweeId);

    long countByRevieweeId(Long revieweeId);
}
