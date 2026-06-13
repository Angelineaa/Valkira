package com.modaai.backend.security;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.modaai.backend.entities.User;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration.ms}")
    private long expirationMs;

    public String generateToken(User user) {
        return JWT.create()
                .withSubject(user.getEmail())
                .withClaim("role", user.getRole() != null ? user.getRole().name() : "USER")
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + expirationMs))
                .sign(Algorithm.HMAC256(secret));
    }

    public String extractRole(String token) {
        try {
            return getVerifier().verify(token).getClaim("role").asString();
        } catch (JWTVerificationException exception) {
            return null;
        }
    }

    public String extractUsername(String token) {
        try {
            return getVerifier().verify(token).getSubject();
        } catch (JWTVerificationException exception) {
            return null;
        }
    }

    public boolean isTokenValid(String token) {
        return extractUsername(token) != null;
    }

    private JWTVerifier getVerifier() {
        return JWT.require(Algorithm.HMAC256(secret)).build();
    }
}
