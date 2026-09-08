package com.agrilabour.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FarmerProfileResponse {
    private Long id;
    private Long userId;
    private String phoneNumber;
    private String email;
    private String fullName;
    private String farmName;
    private String farmLocation;
    private String contactNumber;
}
