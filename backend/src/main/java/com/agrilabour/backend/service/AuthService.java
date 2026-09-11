package com.agrilabour.backend.service;

import com.agrilabour.backend.config.JwtService;
import com.agrilabour.backend.dto.AuthResponse;
import com.agrilabour.backend.dto.LoginRequest;
import com.agrilabour.backend.dto.RegisterRequest;
import com.agrilabour.backend.entity.FarmerProfile;
import com.agrilabour.backend.entity.LabourerProfile;
import com.agrilabour.backend.entity.Role;
import com.agrilabour.backend.entity.User;
import com.agrilabour.backend.repository.FarmerProfileRepository;
import com.agrilabour.backend.repository.LabourerProfileRepository;
import com.agrilabour.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    
    private final LabourerProfileRepository labourerProfileRepository;
    private final FarmerProfileRepository farmerProfileRepository;

    @Transactional
    public void seedAdminIfEmpty() {
        if (!userRepository.existsByPhoneNumber("9999999999")) {
            User admin = User.builder()
                    .phoneNumber("9999999999")
                    .email("admin@agrilabour.com")
                    .password(passwordEncoder.encode("AdminPassword123"))
                    .role(Role.ADMIN)
                    .isActive(true)
                    .build();
            userRepository.save(admin);
            System.out.println(">>> Seeded default System Admin: Phone [9999999999] / Password [AdminPassword123]");
        }
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // 1. Validation
        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new IllegalArgumentException("Phone number is already registered");
        }

        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new IllegalArgumentException("Email is already registered");
            }
        }

        // 2. Hash Password and Create User
        User user = User.builder()
                .phoneNumber(request.getPhoneNumber())
                .email(request.getEmail() != null && !request.getEmail().isBlank() ? request.getEmail() : null)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .isActive(true)
                .build();

        userRepository.save(user);

        // 3. Auto-initialize empty profiles based on role
        if (user.getRole() == Role.LABOURER) {
            LabourerProfile profile = LabourerProfile.builder()
                    .user(user)
                    .fullName("")
                    .location("")
                    .build();
            labourerProfileRepository.save(profile);
        } else if (user.getRole() == Role.FARMER) {
            FarmerProfile profile = FarmerProfile.builder()
                    .user(user)
                    .fullName("")
                    .farmLocation("")
                    .build();
            farmerProfileRepository.save(profile);
        }

        // 4. Generate Token
        String jwtToken = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(jwtToken)
                .role(user.getRole().name())
                .phoneNumber(user.getPhoneNumber())
                .userId(user.getId())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        // 1. Authenticate user credentials
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getPhoneNumber(),
                        request.getPassword()
                )
        );

        // 2. Retrieve user
        User user = userRepository.findByPhoneNumber(request.getPhoneNumber())
                .orElseThrow(() -> new IllegalArgumentException("Invalid phone number or password"));

        // 3. Generate Token
        String jwtToken = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(jwtToken)
                .role(user.getRole().name())
                .phoneNumber(user.getPhoneNumber())
                .userId(user.getId())
                .build();
    }
}
