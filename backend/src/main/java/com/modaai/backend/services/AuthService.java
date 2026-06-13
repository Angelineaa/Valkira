package com.modaai.backend.services;

import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.modaai.backend.dto.LoginRequest;
import com.modaai.backend.dto.RegisterRequest;
import java.time.LocalDateTime;
import com.modaai.backend.entities.User;
import com.modaai.backend.repositories.UserRepository;
import com.modaai.backend.security.EmailAlreadyExistsException;
import com.modaai.backend.security.InvalidCredentialsException;
import com.modaai.backend.security.JwtService;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final FirebaseApp firebaseApp;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            ObjectProvider<FirebaseApp> firebaseAppProvider) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.firebaseApp = firebaseAppProvider.getIfAvailable();
    }

    public User register(RegisterRequest request) {

        if (userRepository.existsByEmail(
                request.getEmail())) {

            throw new EmailAlreadyExistsException(
                    "El correo ya está registrado"
            );

        }

        if (request.getAcceptedPrivacyPolicy() == null || !request.getAcceptedPrivacyPolicy()) {
            throw new IllegalArgumentException("Debe aceptar la política de privacidad");
        }

        User user = new User();

        user.setEmail(request.getEmail());
        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setRole(com.modaai.backend.entities.Role.USER);
        user.setAcceptedPrivacyPolicy(true);
        user.setAcceptedPrivacyPolicyAt(LocalDateTime.now());

        return userRepository.save(user);
    }

    public String login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Correo o contraseña incorrectos"));

        if (user.getPassword() == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Correo o contraseña incorrectos");
        }

        return jwtService.generateToken(user);
    }

    public String loginWithFirebase(String idToken) {
        if (firebaseApp == null) {
            throw new InvalidCredentialsException("Firebase no está configurado");
        }

        FirebaseToken decodedToken;
        try {
            decodedToken = FirebaseAuth.getInstance(firebaseApp).verifyIdToken(idToken);
        } catch (FirebaseAuthException ex) {
            throw new InvalidCredentialsException("Token de Firebase inválido");
        }

        String email = decodedToken.getEmail();
        if (email == null || email.isBlank()) {
            throw new InvalidCredentialsException("Token de Firebase no contiene correo");
        }

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> createUserFromFirebaseToken(decodedToken));

        return jwtService.generateToken(user);
    }

    private User createUserFromFirebaseToken(FirebaseToken decodedToken) {
        User user = new User();
        user.setEmail(decodedToken.getEmail());
        user.setFirebaseUid(decodedToken.getUid());
        user.setEnabled(true);
        user.setRole(com.modaai.backend.entities.Role.USER);
        String displayName = decodedToken.getName();
        if (displayName != null && !displayName.isBlank()) {
            String[] parts = displayName.trim().split(" ", 2);
            user.setFirstName(parts[0]);
            if (parts.length > 1) {
                user.setLastName(parts[1]);
            }
        }
        user.setProfilePhoto(decodedToken.getPicture());

        return userRepository.save(user);
    }

    public String generateToken(User user) {
        return jwtService.generateToken(user);
    }
}
