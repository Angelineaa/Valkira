package com.modaai.backend.controllers;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.modaai.backend.dto.ProductResponse;
import com.modaai.backend.entities.User;
import com.modaai.backend.repositories.UserRepository;
import com.modaai.backend.security.UserNotFoundException;
import com.modaai.backend.services.RecommendationService;

@RestController
@RequestMapping("/api")
public class RecommendationController {

    private final RecommendationService recommendationService;
    private final UserRepository userRepository;

    public RecommendationController(RecommendationService recommendationService, UserRepository userRepository) {
        this.recommendationService = recommendationService;
        this.userRepository = userRepository;
    }

    @GetMapping("/recommendations")
    public ResponseEntity<List<ProductResponse>> getRecommendations(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));

        return ResponseEntity.ok(recommendationService.getRecommendationsForUser(user));
    }

    @PostMapping("/products/{productId}/view")
    public ResponseEntity<Void> recordProductView(Principal principal, @PathVariable Long productId) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));

        recommendationService.recordView(user, productId);
        return ResponseEntity.noContent().build();
    }
}
