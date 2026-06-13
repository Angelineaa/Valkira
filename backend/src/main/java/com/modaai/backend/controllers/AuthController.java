package com.modaai.backend.controllers;

import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.modaai.backend.dto.FirebaseAuthRequest;
import com.modaai.backend.dto.ForgotPasswordRequest;
import com.modaai.backend.dto.LoginRequest;
import com.modaai.backend.dto.RegisterRequest;
import com.modaai.backend.dto.ResetPasswordRequest;
import com.modaai.backend.entities.User;
import com.modaai.backend.services.AuthService;
import com.modaai.backend.services.PasswordResetService;

import jakarta.validation.Valid;

@CrossOrigin(origins = "https://valkira-liard.vercel.app")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final PasswordResetService passwordResetService;

    public AuthController(AuthService authService, PasswordResetService passwordResetService) {
        this.authService = authService;
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/register")
    public Map<String, String> register(
            @Valid @RequestBody RegisterRequest request) {

        User user = authService.register(request);
        String token = authService.generateToken(user);
        return Map.of("token", token);

    }

    @PostMapping("/login")
    public Map<String, String> login(
            @Valid @RequestBody LoginRequest request) {

        String token = authService.login(request);
        return Map.of("token", token);
    }

    @PostMapping("/firebase")
    public Map<String, String> loginWithFirebase(
            @Valid @RequestBody FirebaseAuthRequest request) {

        String token = authService.loginWithFirebase(request.getIdToken());
        return Map.of("token", token);
    }

    @PostMapping("/forgot-password")
    public Map<String, String> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        String token = passwordResetService.createPasswordResetToken(request.getEmail());
        return Map.of(
                "message",
                "Si el correo existe, se generó un token de recuperación",
                "token",
                token == null ? "" : token
        );
    }

    @PostMapping("/reset-password")
    public Map<String, String> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        passwordResetService.resetPassword(request.getToken(), request.getNewPassword());
        return Map.of(
                "message",
                "Contraseña actualizada correctamente"
        );
    }
}
