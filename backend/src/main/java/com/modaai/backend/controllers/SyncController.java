package com.modaai.backend.controllers;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.modaai.backend.dto.CartItemRequest;
import com.modaai.backend.dto.CartResponse;
import com.modaai.backend.dto.ProductResponse;
import com.modaai.backend.entities.User;
import com.modaai.backend.repositories.UserRepository;
import com.modaai.backend.security.UserNotFoundException;
import com.modaai.backend.services.CartService;
import com.modaai.backend.services.FavoriteService;

@RestController
@RequestMapping("/api/sync")
public class SyncController {

    private final UserRepository userRepository;
    private final CartService cartService;
    private final FavoriteService favoriteService;

    public SyncController(UserRepository userRepository, CartService cartService, FavoriteService favoriteService) {
        this.userRepository = userRepository;
        this.cartService = cartService;
        this.favoriteService = favoriteService;
    }

    @PostMapping("/cart")
    public ResponseEntity<CartResponse> syncCart(Principal principal, @RequestBody List<CartItemRequest> items) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));

        cartService.mergeItems(user, items);
        CartResponse resp = cartService.getCartForUser(user);
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/favorites")
    public ResponseEntity<List<ProductResponse>> syncFavorites(Principal principal, @RequestBody List<Long> productIds) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));

        List<ProductResponse> added = productIds.stream()
                .map(pid -> favoriteService.addFavorite(user, pid))
                .filter(p -> p != null)
                .collect(Collectors.toList());

        return ResponseEntity.ok(added);
    }
}
