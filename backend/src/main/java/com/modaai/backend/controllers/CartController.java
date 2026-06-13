package com.modaai.backend.controllers;

import java.security.Principal;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.modaai.backend.dto.CartItemRequest;
import com.modaai.backend.dto.CartItemResponse;
import com.modaai.backend.dto.CartResponse;
import com.modaai.backend.dto.CheckoutRequest;
import com.modaai.backend.dto.OrderResponse;
import com.modaai.backend.entities.User;
import com.modaai.backend.repositories.UserRepository;
import com.modaai.backend.security.UserNotFoundException;
import com.modaai.backend.services.CartService;
import com.modaai.backend.services.OrderService;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;
    private final UserRepository userRepository;
    private final OrderService orderService;

    public CartController(CartService cartService, UserRepository userRepository, OrderService orderService) {
        this.cartService = cartService;
        this.userRepository = userRepository;
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<CartResponse> getCart(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));
        return ResponseEntity.ok(cartService.getCartForUser(user));
    }

    @PostMapping
    public ResponseEntity<CartItemResponse> addItem(Principal principal, @RequestBody CartItemRequest req) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));

        CartItemResponse resp = cartService.addItemToCart(user, req);
        if (resp == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(resp);
    }

    @PutMapping("/item/{itemId}")
    public ResponseEntity<CartItemResponse> updateItem(Principal principal, @PathVariable Long itemId,
            @RequestBody Integer qty) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));

        CartItemResponse resp = cartService.updateItemQuantity(user, itemId, qty);
        return ResponseEntity.ok(resp);
    }

    @DeleteMapping("/item/{itemId}")
    public ResponseEntity<Void> removeItem(Principal principal, @PathVariable Long itemId) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));

        cartService.removeItem(user, itemId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/checkout")
    public ResponseEntity<OrderResponse> checkout(Principal principal, @RequestBody CheckoutRequest req) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));

        OrderResponse resp = orderService.createOrder(user, req);
        // Clear server-side cart after successful order creation
        try {
            cartService.clearCart(user);
        } catch (Exception e) {
            // don't block order creation if cart clearing fails; log if needed
        }
        return ResponseEntity.ok(resp);
    }
}
