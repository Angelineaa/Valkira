package com.modaai.backend.controllers;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.modaai.backend.dto.ProductResponse;
import com.modaai.backend.entities.User;
import com.modaai.backend.repositories.UserRepository;
import com.modaai.backend.security.UserNotFoundException;
import com.modaai.backend.services.FavoriteService;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;
    private final UserRepository userRepository;

    public FavoriteController(FavoriteService favoriteService, UserRepository userRepository) {
        this.favoriteService = favoriteService;
        this.userRepository = userRepository;
    }

    @PostMapping("/{productId}")
    public ResponseEntity<ProductResponse> addFavorite(Principal principal, @PathVariable Long productId) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));

        ProductResponse resp = favoriteService.addFavorite(user, productId);
        if (resp == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(resp);
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> removeFavorite(Principal principal, @PathVariable Long productId) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));

        favoriteService.removeFavorite(user, productId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> listFavorites(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));

        return ResponseEntity.ok(favoriteService.listFavorites(user));
    }
}
