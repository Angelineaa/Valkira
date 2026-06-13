package com.modaai.backend.controllers;

import java.security.Principal;
import java.time.LocalDate;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.modaai.backend.dto.UpdateProfileRequest;
import com.modaai.backend.dto.UserResponse;
import com.modaai.backend.entities.User;
import com.modaai.backend.repositories.UserRepository;
import com.modaai.backend.security.UserNotFoundException;

import jakarta.validation.Valid;

@RestController
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/api/user/me")
    public ResponseEntity<UserResponse> me(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));

        return ResponseEntity.ok(new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getDob(),
                user.getGender(),
                user.getProfilePhoto(),
                user.getRole() != null ? user.getRole().name() : null
        ));
    }

    @PutMapping("/api/user/me")
    public ResponseEntity<UserResponse> updateProfile(
            Principal principal,
            @Valid @RequestBody UpdateProfileRequest request) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));

        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        if (request.getDob() != null) {
            if (request.getDob().isAfter(LocalDate.now())) {
                throw new IllegalArgumentException("La fecha de nacimiento no puede ser futura");
            }
            user.setDob(request.getDob());
        }
        if (request.getGender() != null) {
            user.setGender(request.getGender());
        }
        if (request.getProfilePhoto() != null) {
            user.setProfilePhoto(request.getProfilePhoto());
        }

        User updated = userRepository.save(user);

        return ResponseEntity.ok(new UserResponse(
                updated.getId(),
                updated.getEmail(),
                updated.getFirstName(),
                updated.getLastName(),
                updated.getDob(),
                updated.getGender(),
                updated.getProfilePhoto(),
                updated.getRole() != null ? updated.getRole().name() : null
        ));
    }
}
