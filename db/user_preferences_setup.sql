-- Script para crear/actualizar la tabla user_preferences con todas las medidas corporales
-- Ejecutar esto en la BD moda_ai

USE moda_ai;

-- Verificar si la tabla existe, si no crearla
CREATE TABLE IF NOT EXISTS user_preferences (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    
    -- Preferencias de estilo
    favorite_colors VARCHAR(512),
    favorite_styles VARCHAR(512),
    body_type VARCHAR(50),
    preferred_gender VARCHAR(50),
    preferred_categories VARCHAR(512),
    
    -- Medidas corporales - PECHO, CINTURA, CADERA
    height_cm INT,
    weight_kg DOUBLE,
    bust_cm INT,
    waist_cm INT,
    hips_cm INT,
    leg_length_cm INT,
    shoulder_width_cm INT,
    
    -- Tallas - SUPERIOR, INFERIOR, CALZADO
    shirt_size VARCHAR(20),
    pants_size VARCHAR(20),
    shoe_size VARCHAR(20),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_user_preferences_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Si la tabla ya existe, agregar las columnas si no existen
ALTER TABLE user_preferences 
    ADD COLUMN IF NOT EXISTS bust_cm INT,
    ADD COLUMN IF NOT EXISTS waist_cm INT,
    ADD COLUMN IF NOT EXISTS hips_cm INT,
    ADD COLUMN IF NOT EXISTS leg_length_cm INT,
    ADD COLUMN IF NOT EXISTS shoulder_width_cm INT,
    ADD COLUMN IF NOT EXISTS height_cm INT,
    ADD COLUMN IF NOT EXISTS weight_kg DOUBLE,
    ADD COLUMN IF NOT EXISTS shirt_size VARCHAR(20),
    ADD COLUMN IF NOT EXISTS pants_size VARCHAR(20),
    ADD COLUMN IF NOT EXISTS shoe_size VARCHAR(20);

-- Verificar que la tabla tiene todas las columnas correctas
DESCRIBE user_preferences;
