package com.agrilabour.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "labourer_profiles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LabourerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;

    @Column(name = "full_name", length = 100)
    private String fullName;

    @Column(length = 150)
    private String location;

    private Integer age;

    @Column(length = 15)
    private String gender;

    @Column(name = "years_of_experience")
    @Builder.Default
    private Integer yearsOfExperience = 0;

    @Column(name = "expected_wage", precision = 10, scale = 2)
    private BigDecimal expectedWage;

    @Enumerated(EnumType.STRING)
    @Column(name = "wage_basis", length = 10)
    @Builder.Default
    private WageBasis wageBasis = WageBasis.DAILY;

    @Builder.Default
    private boolean availability = true;

    @Column(name = "profile_photo_url")
    private String profilePhotoUrl;

    @Column(name = "is_verified")
    @Builder.Default
    private boolean isVerified = false;

    @Column(name = "average_rating")
    @Builder.Default
    private Double averageRating = 0.0;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "labourer_skills",
        joinColumns = @JoinColumn(name = "labourer_id"),
        inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    @Builder.Default
    private Set<Skill> skills = new HashSet<>();
}
