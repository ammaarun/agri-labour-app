package com.agrilabour.backend.repository;

import com.agrilabour.backend.entity.LabourerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LabourerProfileRepository extends JpaRepository<LabourerProfile, Long> {
    Optional<LabourerProfile> findByUserId(Long userId);
}
