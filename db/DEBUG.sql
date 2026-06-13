-- SCRIPT DE DEPURACION - EJECUTA ESTO PARA VER QUE ESTA PASANDO

USE moda_ai;

-- 1. Ver si la tabla user_preferences existe
SELECT IF(
    EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME='user_preferences' AND TABLE_SCHEMA='moda_ai'),
    'SI - La tabla EXISTE',
    'NO - La tabla NO EXISTE'
) as tabla_existe;

-- 2. Si existe, mostrar todas las columnas
SELECT 'COLUMNAS DE LA TABLA:' as info;
SHOW COLUMNS FROM user_preferences;

-- 3. Ver cuántos usuarios hay
SELECT COUNT(*) as total_usuarios FROM users;

-- 4. Ver cuántas preferencias hay guardadas
SELECT COUNT(*) as total_preferencias FROM user_preferences;

-- 5. Ver los emails de usuarios
SELECT id, email, first_name FROM users LIMIT 5;

-- 6. Ver las preferencias guardadas
SELECT 
    u.email,
    up.height_cm,
    up.weight_kg,
    up.bust_cm,
    up.waist_cm,
    up.hips_cm,
    up.leg_length_cm,
    up.shoulder_width_cm,
    up.shirt_size,
    up.pants_size,
    up.shoe_size,
    up.updated_at
FROM users u
LEFT JOIN user_preferences up ON u.id = up.user_id
LIMIT 10;

-- 7. Ver si hay algún error en las FK
SELECT 
    CONSTRAINT_NAME,
    TABLE_NAME,
    REFERENCED_TABLE_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_NAME='user_preferences' AND REFERENCED_TABLE_NAME IS NOT NULL;

-- Si la tabla NO existe, la crearemos aquí automáticamente
CREATE TABLE IF NOT EXISTS user_preferences (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    favorite_colors VARCHAR(512),
    favorite_styles VARCHAR(512),
    preferred_categories VARCHAR(512),
    body_type VARCHAR(50),
    preferred_gender VARCHAR(50),
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

SELECT 'DEPURACION COMPLETA' as resultado;
