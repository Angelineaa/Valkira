package com.modaai.backend.services;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.modaai.backend.entities.PasswordResetToken;
import com.modaai.backend.entities.User;
import com.modaai.backend.repositories.PasswordResetTokenRepository;
import com.modaai.backend.repositories.UserRepository;
import com.modaai.backend.security.InvalidCredentialsException;
import com.modaai.backend.services.EmailService;

@Service
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    // Token expiry hours
    private static final long EXPIRATION_HOURS = 1;

    public PasswordResetService(UserRepository userRepository, PasswordResetTokenRepository tokenRepository,
            PasswordEncoder passwordEncoder, EmailService emailService) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    public String createPasswordResetToken(String email) {
        Optional<User> maybeUser = userRepository.findByEmail(email);
        if (maybeUser.isEmpty()) {
            // don't reveal user existence
            return null;
        }
        User user = maybeUser.get();
        String token = UUID.randomUUID().toString();
        PasswordResetToken t = new PasswordResetToken();
        t.setUser(user);
        t.setToken(token);
        t.setExpiry(LocalDateTime.now().plusHours(EXPIRATION_HOURS));
        t.setUsed(false);
        t.setCreatedAt(LocalDateTime.now());
        tokenRepository.save(t);

        emailService.sendPasswordResetEmail(user.getEmail(), token);
        return token;
    }

    public void resetPassword(String token, String newPassword) {
        PasswordResetToken t = tokenRepository.findByToken(token)
                .orElseThrow(() -> new InvalidCredentialsException("Token de recuperación inválido"));

        if (Boolean.TRUE.equals(t.getUsed())) {
            throw new InvalidCredentialsException("Token ya usado");
        }

        if (t.getExpiry() == null || t.getExpiry().isBefore(LocalDateTime.now())) {
            throw new InvalidCredentialsException("Token de recuperación expirado");
        }

        User user = t.getUser();
        if (user == null) {
            throw new InvalidCredentialsException("Usuario no encontrado para el token");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // mark used (or delete)
        t.setUsed(true);
        tokenRepository.save(t);
    }
}
