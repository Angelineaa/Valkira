package com.modaai.backend.config;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

@Configuration
@ConditionalOnProperty(prefix = "firebase", name = "enabled", havingValue = "true")
public class FirebaseConfig {

    @Value("${firebase.service-account.path}")
    private String serviceAccountPath;

    @Bean
    public FirebaseApp firebaseApp() throws IOException {
        if (FirebaseApp.getApps().isEmpty()) {
            GoogleCredentials credentials;
            if (serviceAccountPath.startsWith("classpath:")) {
                String path = serviceAccountPath.substring("classpath:".length());
                InputStream resourceStream = getClass().getClassLoader().getResourceAsStream(path);
                if (resourceStream == null) {
                    throw new IOException("Firebase service account key not found in classpath: " + path);
                }
                credentials = GoogleCredentials.fromStream(resourceStream);
            } else {
                credentials = GoogleCredentials.fromStream(new FileInputStream(serviceAccountPath));
            }

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(credentials)
                    .build();
            return FirebaseApp.initializeApp(options);
        }
        return FirebaseApp.getInstance();
    }
}