## 🗄️ INSTRUCCIONES PARA CREAR LA TABLA user_preferences

Tienes **dos opciones** para crear la tabla con todas las medidas corporales:

---

## **OPCIÓN 1: Usar MySQL Workbench (Más fácil) 🖥️**

1. Abre **MySQL Workbench**
2. Conéctate a tu servidor:
   - Host: `acela.proxy.rlwy.net`
   - Port: `36282`
   - Username: `root`
   - Password: `KPDSWYEOBatlWcWiiVROkOmNPLjFhWCq`

3. Una vez conectado, abre el archivo:
   ```
   db/create_user_preferences_table.sql
   ```

4. Presiona **Ctrl + Shift + Enter** (o haz clic en el botón ▶️ ejecutar)

5. Verás el resultado: "Tabla user_preferences creada/actualizada exitosamente"

---

## **OPCIÓN 2: Usar MySQL CLI (Terminal) 💻**

```bash
# Desde la terminal/cmd, ejecuta:
mysql -h acela.proxy.rlwy.net -P 36282 -u root -p < db/create_user_preferences_table.sql

# Te pedirá la contraseña, escribe:
# KPDSWYEOBatlWcWiiVROkOmNPLjFhWCq
```

---

## **OPCIÓN 3: Copiar y Pegar en MySQL Workbench**

1. Abre el archivo `db/create_user_preferences_table.sql`
2. Copia **todo el contenido**
3. En MySQL Workbench, crea una nueva pestaña de consulta (Ctrl + T)
4. Pega el código
5. Ejecuta (Ctrl + Shift + Enter)

---

## **VERIFICAR QUE LA TABLA SE CREÓ CORRECTAMENTE**

Después de ejecutar el script, verifica que todas las columnas existen:

```sql
DESCRIBE user_preferences;
```

Deberías ver estas columnas:
- ✅ bust_cm
- ✅ waist_cm
- ✅ hips_cm
- ✅ leg_length_cm
- ✅ shoulder_width_cm
- ✅ shirt_size
- ✅ pants_size
- ✅ shoe_size
- ✅ height_cm
- ✅ weight_kg
- Y todas las demás...

---

## **DESPUÉS DE CREAR LA TABLA**

1. **Reinicia tu servidor backend** (Java)
2. **Recarga el frontend** en el navegador
3. Vuelve a la página de Preferencias
4. Llena los datos (Busto, Cintura, Cadera, etc.)
5. Haz clic en **Guardar**
6. ¡Los datos se guardarán correctamente ahora! ✅

---

## **¿SIGUE SIN GUARDAR?**

Si aún no se guardan los datos:

1. Abre la **consola del navegador** (F12)
2. Mira si hay errores en rojo
3. Verifica en **Network** si la petición POST se envía correctamente
4. Revisa que el backend esté corriendo sin errores

¿Necesitas ayuda con esto? ¡Dime qué ves! 🚀
