-- SCRIPT SIMPLE PARA CREAR LA TABLA user_preferences
-- Copia y pega TODO esto en MySQL Workbench o tu cliente MySQL
-- Base de datos: moda_ai

DROP TABLE IF EXISTS user_preferences;

CREATE TABLE user_preferences (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    
    -- Preferencias
    favorite_colors VARCHAR(512),
    favorite_styles VARCHAR(512),
    preferred_categories VARCHAR(512),
    body_type VARCHAR(50),
    preferred_gender VARCHAR(50),
    
    -- Medidas corporales
    height_cm INT,
    weight_kg DOUBLE,
    bust_cm INT,
    waist_cm INT,
    hips_cm INT,
    leg_length_cm INT,
    shoulder_width_cm INT,
    
    -- Tallas
    shirt_size VARCHAR(20),
    pants_size VARCHAR(20),
    shoe_size VARCHAR(20),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_user_preferences_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Verificar que se creó
SHOW COLUMNS FROM user_preferences;

-- Contar las columnas de medidas
SELECT COUNT(*) as total_medidas FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME='user_preferences' AND COLUMN_NAME IN (
    'bust_cm','waist_cm','hips_cm','leg_length_cm','shoulder_width_cm',
    'shirt_size','pants_size','shoe_size','height_cm','weight_kg'
);

SELECT 'TABLA CREADA EXITOSAMENTE' as resultado;
