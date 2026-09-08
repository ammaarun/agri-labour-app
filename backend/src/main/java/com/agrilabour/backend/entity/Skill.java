package com.agrilabour.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "skills")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name_en", unique = true, nullable = false, length = 100)
    private String nameEn;

    @Column(name = "name_te", unique = true, nullable = false, length = 100)
    private String nameTe;

    @Column(name = "description_en", length = 255)
    private String descriptionEn;

    @Column(name = "description_te", length = 255)
    private String descriptionTe;
}
