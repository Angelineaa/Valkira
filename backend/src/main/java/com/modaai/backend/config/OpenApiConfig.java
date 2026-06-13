package com.modaai.backend.config;

import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "ModaAI Backend API",
                version = "v1",
                description = "API de autenticación, usuarios, preferencias y recuperación de contraseña"
        )
)
public class OpenApiConfig {
}
