package com.modaai.backend.services;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.mail.MailException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final Logger logger = LoggerFactory.getLogger(EmailService.class);

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordResetEmail(String email, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Recuperación de contraseña");

        // Use frontend dev server port 5173 for reset link in local development
        String resetLink = "http://localhost:5173/reset-password?token=" + token;

        message.setText("Para restablecer tu contraseña visita:\n\n" + resetLink + "\n\nSi no recibes correos, usa el token:\n" + token);

        try {
            mailSender.send(message);
            logger.info("Correo de recuperación enviado a {}", email);
        } catch (MailException ex) {
            // Fallback for development: log the token so password recovery can proceed without real email
            logger.warn("No se pudo enviar email a {}: {}", email, ex.getMessage());
            logger.info("FALLBACK - Password reset token para {}: {}", email, token);
        }
    }
}
