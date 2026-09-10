package com.agrilabour.backend.dto;

import com.agrilabour.backend.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserManagementResponse {
    private Long userId;
    private String phoneNumber;
    private Role role;
    private String fullName;
    private String location;
    private Boolean isVerified;
    private boolean enabled;
    private LocalDateTime createdAt;
}
