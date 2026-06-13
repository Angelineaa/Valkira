-- Script de verificación: Verifica que la BD tiene todo configurado correctamente

USE moda_ai;

-- 1. Verificar que la tabla user_preferences existe
SHOW CREATE TABLE user_preferences\G

-- 2. Mostrar todas las columnas de user_preferences
SHOW COLUMNS FROM user_preferences;

-- 3. Contar usuarios
SELECT COUNT(*) as total_usuarios FROM users;

-- 4. Contar preferencias registradas
SELECT COUNT(*) as preferencias_registradas FROM user_preferences;

-- 5. Verificar estructura completa
SELECT 
    'MEDIDAS CORPORALES' as tipo,
    COUNT(*) as cantidad
FROM information_schema.COLUMNS 
WHERE TABLE_NAME = 'user_preferences' 
AND COLUMN_NAME IN ('bust_cm', 'waist_cm', 'hips_cm', 'leg_length_cm', 'shoulder_width_cm');

-- 6. Verificar tallas
SELECT 
    'TALLAS' as tipo,
    COUNT(*) as cantidad
FROM information_schema.COLUMNS 
WHERE TABLE_NAME = 'user_preferences' 
AND COLUMN_NAME IN ('shirt_size', 'pants_size', 'shoe_size');

-- 7. Ver una muestra de datos si existen
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
    up.shoe_size
FROM users u
LEFT JOIN user_preferences up ON u.id = up.user_id
LIMIT 5;
