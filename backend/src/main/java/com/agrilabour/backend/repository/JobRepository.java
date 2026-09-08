package com.agrilabour.backend.repository;

import com.agrilabour.backend.entity.Job;
import com.agrilabour.backend.entity.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByFarmerProfileIdOrderByCreatedAtDesc(Long farmerProfileId);

    List<Job> findByStatusOrderByCreatedAtDesc(JobStatus status);

    @Query("SELECT DISTINCT j FROM Job j LEFT JOIN j.requiredSkills s WHERE " +
           "(:location IS NULL OR LOWER(j.farmLocation) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:workType IS NULL OR LOWER(j.workType) LIKE LOWER(CONCAT('%', :workType, '%'))) AND " +
           "(:status IS NULL OR j.status = :status) AND " +
           "(:minWage IS NULL OR j.wageAmount >= :minWage) AND " +
           "(:maxWage IS NULL OR j.wageAmount <= :maxWage) " +
           "ORDER BY j.createdAt DESC")
    List<Job> filterJobs(
            @Param("location") String location,
            @Param("workType") String workType,
            @Param("status") JobStatus status,
            @Param("minWage") BigDecimal minWage,
            @Param("maxWage") BigDecimal maxWage
    );
}
