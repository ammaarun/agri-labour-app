package com.agrilabour.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "jobs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_id", nullable = false)
    private FarmerProfile farmerProfile;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(name = "work_type", length = 50)
    private String workType;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "num_labourers_required", nullable = false)
    private Integer numLabourersRequired;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "job_required_skills",
        joinColumns = @JoinColumn(name = "job_id"),
        inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    @Builder.Default
    private Set<Skill> requiredSkills = new HashSet<>();

    @Column(name = "farm_location", nullable = false, length = 255)
    private String farmLocation;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "working_hours")
    private Integer workingHours;

    @Column(name = "wage_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal wageAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "wage_basis", length = 10, nullable = false)
    @Builder.Default
    private WageBasis wageBasis = WageBasis.DAILY;

    @Column(name = "food_provided", nullable = false)
    @Builder.Default
    private boolean foodProvided = false;

    @Column(name = "accommodation_provided", nullable = false)
    @Builder.Default
    private boolean accommodationProvided = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private JobStatus status = JobStatus.OPEN;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
