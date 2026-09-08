package com.agrilabour.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "farmer_profiles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FarmerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;

    @Column(name = "full_name", length = 100)
    private String fullName;

    @Column(name = "farm_name", length = 150)
    private String farmName;

    @Column(name = "farm_location", length = 255)
    private String farmLocation;

    @Column(name = "contact_number", length = 15)
    private String contactNumber;
}
