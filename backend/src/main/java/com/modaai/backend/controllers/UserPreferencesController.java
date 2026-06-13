package com.modaai.backend.controllers;

import java.security.Principal;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.modaai.backend.dto.UserPreferencesRequest;
import com.modaai.backend.dto.UserPreferencesResponse;
import com.modaai.backend.entities.User;
import com.modaai.backend.entities.UserPreferences;
import com.modaai.backend.repositories.UserPreferencesRepository;
import com.modaai.backend.repositories.UserRepository;
import com.modaai.backend.security.UserNotFoundException;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/user")
public class UserPreferencesController {

    private final UserRepository userRepository;
    private final UserPreferencesRepository preferencesRepository;

    public UserPreferencesController(UserRepository userRepository, UserPreferencesRepository preferencesRepository) {
        this.userRepository = userRepository;
        this.preferencesRepository = preferencesRepository;
    }

    @PostMapping("/preferences")
    public ResponseEntity<UserPreferencesResponse> createPreferences(Principal principal,
            @Valid @RequestBody UserPreferencesRequest request) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));

        UserPreferences prefs = preferencesRepository.findByUser(user).orElse(new UserPreferences());
        prefs.setUser(user);
        prefs.setFavoriteColors(listToCsv(request.getFavoriteColors()));
        prefs.setFavoriteStyles(listToCsv(request.getFavoriteStyles()));
        prefs.setBodyType(request.getBodyType());
        prefs.setPreferredGender(request.getPreferredGender());
        prefs.setHeightCm(request.getHeightCm());
        prefs.setWeightKg(request.getWeightKg());
        prefs.setPreferredCategories(listToCsv(request.getPreferredCategories()));
        prefs.setBustCm(request.getBustCm());
        prefs.setWaistCm(request.getWaistCm());
        prefs.setHipsCm(request.getHipsCm());
        prefs.setLegLengthCm(request.getLegLengthCm());
        prefs.setShoulderWidthCm(request.getShoulderWidthCm());
        prefs.setShirtSize(request.getShirtSize());
        prefs.setPantsSize(request.getPantsSize());
        prefs.setShoeSize(request.getShoeSize());

        UserPreferences saved = preferencesRepository.save(prefs);

        return ResponseEntity.ok(toResponse(saved));
    }

    @GetMapping("/preferences")
    public ResponseEntity<UserPreferencesResponse> getPreferences(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));

        UserPreferences prefs = preferencesRepository.findByUser(user).orElse(null);
        if (prefs == null) {
            return ResponseEntity.ok(new UserPreferencesResponse());
        }
        return ResponseEntity.ok(toResponse(prefs));
    }

    @PutMapping("/preferences")
    public ResponseEntity<UserPreferencesResponse> updatePreferences(Principal principal,
            @Valid @RequestBody UserPreferencesRequest request) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));

        UserPreferences prefs = preferencesRepository.findByUser(user).orElse(new UserPreferences());
        prefs.setUser(user);
        if (request.getFavoriteColors() != null) {
            prefs.setFavoriteColors(listToCsv(request.getFavoriteColors()));
        }
        if (request.getFavoriteStyles() != null) {
            prefs.setFavoriteStyles(listToCsv(request.getFavoriteStyles()));
        }
        if (request.getBodyType() != null) {
            prefs.setBodyType(request.getBodyType());
        }
        if (request.getPreferredGender() != null) {
            prefs.setPreferredGender(request.getPreferredGender());
        }
        if (request.getHeightCm() != null) {
            prefs.setHeightCm(request.getHeightCm());
        }
        if (request.getWeightKg() != null) {
            prefs.setWeightKg(request.getWeightKg());
        }
        if (request.getBustCm() != null) {
            prefs.setBustCm(request.getBustCm());
        }
        if (request.getWaistCm() != null) {
            prefs.setWaistCm(request.getWaistCm());
        }
        if (request.getHipsCm() != null) {
            prefs.setHipsCm(request.getHipsCm());
        }
        if (request.getLegLengthCm() != null) {
            prefs.setLegLengthCm(request.getLegLengthCm());
        }
        if (request.getShoulderWidthCm() != null) {
            prefs.setShoulderWidthCm(request.getShoulderWidthCm());
        }
        if (request.getShirtSize() != null) {
            prefs.setShirtSize(request.getShirtSize());
        }
        if (request.getPantsSize() != null) {
            prefs.setPantsSize(request.getPantsSize());
        }
        if (request.getShoeSize() != null) {
            prefs.setShoeSize(request.getShoeSize());
        }
        if (request.getPreferredCategories() != null) {
            prefs.setPreferredCategories(listToCsv(request.getPreferredCategories()));
        }

        UserPreferences saved = preferencesRepository.save(prefs);

        return ResponseEntity.ok(toResponse(saved));
    }

    private UserPreferencesResponse toResponse(UserPreferences prefs) {
        UserPreferencesResponse r = new UserPreferencesResponse();
        r.setId(prefs.getId());
        r.setFavoriteColors(csvToList(prefs.getFavoriteColors()));
        r.setFavoriteStyles(csvToList(prefs.getFavoriteStyles()));
        r.setBodyType(prefs.getBodyType());
        r.setPreferredGender(prefs.getPreferredGender());
        r.setHeightCm(prefs.getHeightCm());
        r.setWeightKg(prefs.getWeightKg());
        r.setBustCm(prefs.getBustCm());
        r.setWaistCm(prefs.getWaistCm());
        r.setHipsCm(prefs.getHipsCm());
        r.setLegLengthCm(prefs.getLegLengthCm());
        r.setShoulderWidthCm(prefs.getShoulderWidthCm());
        r.setShirtSize(prefs.getShirtSize());
        r.setPantsSize(prefs.getPantsSize());
        r.setShoeSize(prefs.getShoeSize());
        r.setPreferredCategories(csvToList(prefs.getPreferredCategories()));
        return r;
    }

    private String listToCsv(List<String> list) {
        if (list == null || list.isEmpty()) {
            return null;
        }
        return list.stream().collect(Collectors.joining(","));
    }

    private List<String> csvToList(String csv) {
        if (csv == null || csv.isBlank()) {
            return Collections.emptyList();
        }
        return Arrays.stream(csv.split(","))
                .map(String::trim)
                .collect(Collectors.toList());
    }
}
