-- ================================================
-- CREAR/ACTUALIZAR TABLA user_preferences
-- Medidas corporales y preferencias completas
-- ================================================

USE moda_ai;

-- Crear tabla si no existe
CREATE TABLE IF NOT EXISTS user_preferences (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    favorite_colors VARCHAR(512),
    favorite_styles VARCHAR(512),
    body_type VARCHAR(50),
    preferred_gender VARCHAR(50),
    preferred_categories VARCHAR(512),
    height_cm INT,
    weight_kg DOUBLE,
    bust_cm INT,
    waist_cm INT,
    hips_cm INT,
    leg_length_cm INT,
    shoulder_width_cm INT,
    shirt_size VARCHAR(20),
    pants_size VARCHAR(20),
    shoe_size VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_preferences_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Si la tabla ya existe, asegurar que tiene todas las columnas
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS bust_cm INT;
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS waist_cm INT;
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS hips_cm INT;
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS leg_length_cm INT;
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS shoulder_width_cm INT;
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS height_cm INT;
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS weight_kg DOUBLE;
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS shirt_size VARCHAR(20);
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS pants_size VARCHAR(20);
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS shoe_size VARCHAR(20);
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS body_type VARCHAR(50);
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS preferred_gender VARCHAR(50);
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS favorite_colors VARCHAR(512);
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS favorite_styles VARCHAR(512);
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS preferred_categories VARCHAR(512);

-- Verificar que la tabla tiene las columnas correctas
SHOW COLUMNS FROM user_preferences;

-- Mostrar resultado
SELECT 'Tabla user_preferences creada/actualizada exitosamente' AS resultado;
