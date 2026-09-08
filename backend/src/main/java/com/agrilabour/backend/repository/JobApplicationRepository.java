package com.agrilabour.backend.repository;

import com.agrilabour.backend.entity.JobApplication;
import com.agrilabour.backend.entity.JobApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    List<JobApplication> findByJobIdOrderByApplicationDateDesc(Long jobId);

    List<JobApplication> findByLabourerProfileIdOrderByApplicationDateDesc(Long labourerProfileId);

    Optional<JobApplication> findByJobIdAndLabourerProfileId(Long jobId, Long labourerProfileId);

    boolean existsByJobIdAndLabourerProfileId(Long jobId, Long labourerProfileId);

    long countByJobIdAndStatus(Long jobId, JobApplicationStatus status);
}
