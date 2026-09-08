package com.agrilabour.backend.repository;

import com.agrilabour.backend.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {
    Optional<Skill> findByNameEn(String nameEn);
    Optional<Skill> findByNameTe(String nameTe);
}
