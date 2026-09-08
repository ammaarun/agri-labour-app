package com.agrilabour.backend.service;

import com.agrilabour.backend.dto.FarmerProfileRequest;
import com.agrilabour.backend.dto.FarmerProfileResponse;
import com.agrilabour.backend.dto.LabourerProfileRequest;
import com.agrilabour.backend.dto.LabourerProfileResponse;
import com.agrilabour.backend.dto.SkillResponse;
import com.agrilabour.backend.entity.FarmerProfile;
import com.agrilabour.backend.entity.LabourerProfile;
import com.agrilabour.backend.entity.Skill;
import com.agrilabour.backend.entity.User;
import com.agrilabour.backend.repository.FarmerProfileRepository;
import com.agrilabour.backend.repository.LabourerProfileRepository;
import com.agrilabour.backend.repository.SkillRepository;
import com.agrilabour.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final LabourerProfileRepository labourerProfileRepository;
    private final FarmerProfileRepository farmerProfileRepository;
    private final SkillRepository skillRepository;
    private final UserRepository userRepository;

    // Fetch Labourer Profile (Localized)
    @Transactional(readOnly = true)
    public LabourerProfileResponse getLabourerProfileByUserId(Long userId, String language) {
        LabourerProfile profile = labourerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Labourer profile not found for user ID: " + userId));

        return mapToLabourerResponse(profile, language);
    }

    // Update Labourer Profile
    @Transactional
    public LabourerProfileResponse updateLabourerProfile(Long userId, LabourerProfileRequest request, String language) {
        LabourerProfile profile = labourerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Labourer profile not found for user ID: " + userId));

        profile.setFullName(request.getFullName());
        profile.setLocation(request.getLocation());
        profile.setAge(request.getAge());
        profile.setGender(request.getGender());
        profile.setYearsOfExperience(request.getYearsOfExperience());
        profile.setExpectedWage(request.getExpectedWage());
        profile.setWageBasis(request.getWageBasis());
        profile.setAvailability(request.isAvailability());
        if (request.getProfilePhotoUrl() != null) {
            profile.setProfilePhotoUrl(request.getProfilePhotoUrl());
        }

        // Map Skills
        if (request.getSkillIds() != null) {
            Set<Skill> skills = new HashSet<>(skillRepository.findAllById(request.getSkillIds()));
            profile.setSkills(skills);
        }

        LabourerProfile updated = labourerProfileRepository.save(profile);
        return mapToLabourerResponse(updated, language);
    }

    // Fetch Farmer Profile
    @Transactional(readOnly = true)
    public FarmerProfileResponse getFarmerProfileByUserId(Long userId) {
        FarmerProfile profile = farmerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Farmer profile not found for user ID: " + userId));

        return mapToFarmerResponse(profile);
    }

    // Update Farmer Profile
    @Transactional
    public FarmerProfileResponse updateFarmerProfile(Long userId, FarmerProfileRequest request) {
        FarmerProfile profile = farmerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Farmer profile not found for user ID: " + userId));

        profile.setFullName(request.getFullName());
        profile.setFarmName(request.getFarmName());
        profile.setFarmLocation(request.getFarmLocation());
        profile.setContactNumber(request.getContactNumber());

        FarmerProfile updated = farmerProfileRepository.save(profile);
        return mapToFarmerResponse(updated);
    }

    // List all skills (Localized)
    @Transactional(readOnly = true)
    public List<SkillResponse> getAllSkills(String language) {
        return skillRepository.findAll().stream()
                .map(skill -> mapToSkillResponse(skill, language))
                .collect(Collectors.toList());
    }

    // Seed Skills helper (used in Initializer)
    @Transactional
    public void seedSkillsIfEmpty() {
        if (skillRepository.count() == 0) {
            skillRepository.save(Skill.builder().nameEn("Rice Harvesting").nameTe("వరి కోత").descriptionEn("Harvesting paddy crops").descriptionTe("వరి పంటల కోత మరియు నూర్పిడి").build());
            skillRepository.save(Skill.builder().nameEn("Plowing").nameTe("దున్నడం").descriptionEn("Tractor or bullock plowing").descriptionTe("ట్రాక్టర్ లేదా ఎద్దులతో నేలను దున్నడం").build());
            skillRepository.save(Skill.builder().nameEn("Sowing").nameTe("విత్తడం").descriptionEn("Planting seeds or paddy saplings").descriptionTe("విత్తనాలు నాటడం లేదా వరి నారు నాటడం").build());
            skillRepository.save(Skill.builder().nameEn("Weeding").nameTe("కలుపు తీయడం").descriptionEn("Removing weeds from agricultural fields").descriptionTe("పంట పొలాల నుండి కలుపు మొక్కలను తొలగించడం").build());
            skillRepository.save(Skill.builder().nameEn("Pruning").nameTe("కత్తిరింపు").descriptionEn("Pruning fruit plants and trees").descriptionTe("పండ్ల మొక్కలు మరియు చెట్లను కత్తిరించడం").build());
        }
    }

    // Mapper helper methods
    private LabourerProfileResponse mapToLabourerResponse(LabourerProfile profile, String language) {
        User user = profile.getUser();
        List<SkillResponse> skills = profile.getSkills().stream()
                .map(skill -> mapToSkillResponse(skill, language))
                .collect(Collectors.toList());

        return LabourerProfileResponse.builder()
                .id(profile.getId())
                .userId(user.getId())
                .phoneNumber(user.getPhoneNumber())
                .email(user.getEmail())
                .fullName(profile.getFullName())
                .location(profile.getLocation())
                .age(profile.getAge())
                .gender(profile.getGender())
                .yearsOfExperience(profile.getYearsOfExperience())
                .expectedWage(profile.getExpectedWage())
                .wageBasis(profile.getWageBasis())
                .availability(profile.isAvailability())
                .profilePhotoUrl(profile.getProfilePhotoUrl())
                .isVerified(profile.isVerified())
                .averageRating(profile.getAverageRating())
                .skills(skills)
                .build();
    }

    private FarmerProfileResponse mapToFarmerResponse(FarmerProfile profile) {
        User user = profile.getUser();
        return FarmerProfileResponse.builder()
                .id(profile.getId())
                .userId(user.getId())
                .phoneNumber(user.getPhoneNumber())
                .email(user.getEmail())
                .fullName(profile.getFullName())
                .farmName(profile.getFarmName())
                .farmLocation(profile.getFarmLocation())
                .contactNumber(profile.getContactNumber())
                .build();
    }

    private SkillResponse mapToSkillResponse(Skill skill, String language) {
        boolean isTelugu = "te".equalsIgnoreCase(language);
        return SkillResponse.builder()
                .id(skill.getId())
                .name(isTelugu ? skill.getNameTe() : skill.getNameEn())
                .description(isTelugu ? skill.getDescriptionTe() : skill.getDescriptionEn())
                .build();
    }
}
