package com.agrilabour.backend.config;

import com.agrilabour.backend.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final ProfileService profileService;

    @Override
    public void run(String... args) throws Exception {
        profileService.seedSkillsIfEmpty();
    }
}
