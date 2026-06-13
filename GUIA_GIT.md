# 📤 PASOS PARA SUBIR EL PROYECTO A GIT

## Prerequisitos
- Tener **Git instalado** en tu computadora
- Tener una cuenta en **GitHub** (o GitLab, Bitbucket, etc.)
- Estar en la carpeta raíz del proyecto

---

## OPCIÓN 1: CREAR UN NUEVO REPOSITORIO EN GITHUB (Recomendado)

### Paso 1: Crear el repositorio en GitHub

1. Abre https://github.com/new
2. Llena los datos:
   - **Repository name**: `Proyecto-Comercio` (o el nombre que quieras)
   - **Description**: "Sistema de comercio electrónico de ropa con IA"
   - **Visibility**: Elige **Private** (privado) o **Public** (público)
   - **NO marques** "Initialize this repository with a README"
3. Haz clic en **Create repository**
4. **COPIA LA URL** que aparece (algo como: `https://github.com/tuusuario/Proyecto-Comercio.git`)

---

### Paso 2: Abrir Terminal en tu proyecto

1. En **VS Code**:
   - Presiona **Ctrl + Ñ** (o abre Terminal → New Terminal)
   
2. En **Windows Explorer**:
   - Haz clic derecho en la carpeta del proyecto
   - Selecciona **"Abrir en Terminal"** o **"Abrir terminal en Windows"**

3. En **PowerShell/CMD**:
   - Navega a la carpeta: 
   ```
   cd "c:\Users\angie\OneDrive\Documents\tareas\Programacion\Proyecto Comercio\Proyecto Comercio"
   ```

---

### Paso 3: Configurar Git (SOLO LA PRIMERA VEZ)

En la terminal, ejecuta:

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu.email@ejemplo.com"
```

Ejemplo:
```bash
git config --global user.name "Angie"
git config --global user.email "angie@ejemplo.com"
```

---

### Paso 4: Inicializar Git en tu proyecto

En la terminal (en la carpeta del proyecto), ejecuta:

```bash
git init
```

Esto crea una carpeta `.git` (oculta).

---

### Paso 5: Agregar todos los archivos

```bash
git add .
```

Esto prepara todos los archivos para guardar.

---

### Paso 6: Crear el primer commit (guardar)

```bash
git commit -m "Proyecto inicial: Sistema de comercio electrónico con IA"
```

El mensaje puede ser cualquiera. Ejemplo de buenos mensajes:
- "Implementación de preferencias y medidas corporales"
- "Sistema de recomendaciones completado"
- "Base de datos y backend configurados"

---

### Paso 7: Conectar con GitHub

Copia la URL que guardaste en el Paso 1 y ejecuta:

```bash
git remote add origin https://github.com/tuusuario/Proyecto-Comercio.git
```

**Reemplaza** `https://github.com/tuusuario/Proyecto-Comercio.git` con TU URL real.

---

### Paso 8: Cambiar rama a "main" (GitHub usa "main" por defecto)

```bash
git branch -M main
```

---

### Paso 9: Subir a GitHub (PUSH)

```bash
git push -u origin main
```

Esto sube todo tu proyecto a GitHub.

---

## OPCIÓN 2: YA TIENES UN REPOSITORIO EN GITHUB

Si ya tienes un repositorio creado, solo haz esto:

### Paso 1: Abre terminal en tu proyecto

```bash
cd "c:\Users\angie\OneDrive\Documents\tareas\Programacion\Proyecto Comercio\Proyecto Comercio"
```

### Paso 2: Agregar cambios

```bash
git add .
```

### Paso 3: Guardar cambios (commit)

```bash
git commit -m "Descripción de los cambios"
```

### Paso 4: Subir a GitHub

```bash
git push
```

---

## PASOS PARA SUBIR FUTUROS CAMBIOS

Cada vez que hagas cambios y quieras subirlos:

```bash
# 1. Agregar cambios
git add .

# 2. Guardar cambios
git commit -m "Descripción de qué cambió"

# 3. Subir a GitHub
git push
```

---

## 🆘 SI TE PIDE CONTRASEÑA

GitHub ya no acepta contraseña directa. Tienes 2 opciones:

### Opción A: Usar Token (Más seguro) ⭐
1. Ve a GitHub → Settings → Developer settings → Personal access tokens
2. Haz clic en **Generate new token**
3. Dale permisos de **repo**
4. Copia el token
5. Cuando Git te pida contraseña, **pega el token**

### Opción B: Usar SSH (Más fácil después de configurar)
1. Genera una clave SSH (busca en Google: "generar SSH Windows")
2. Agrégala a GitHub
3. Usa URLs SSH en lugar de HTTPS

---

## ✅ VERIFICAR QUE FUNCIONÓ

1. Abre https://github.com/tuusuario/Proyecto-Comercio
2. Deberías ver todos tus archivos ahí
3. ¡Éxito! 🎉

---

## 📝 EJEMPLO COMPLETO DE COMANDOS

```bash
# 1. Navegar a tu proyecto
cd "c:\Users\angie\OneDrive\Documents\tareas\Programacion\Proyecto Comercio\Proyecto Comercio"

# 2. Inicializar git (SOLO PRIMERA VEZ)
git init

# 3. Configurar git (SOLO PRIMERA VEZ)
git config --global user.name "Angie"
git config --global user.email "tu.email@ejemplo.com"

# 4. Agregar archivos
git add .

# 5. Hacer commit
git commit -m "Proyecto inicial: Sistema de comercio electrónico"

# 6. Agregar repositorio remoto (SOLO PRIMERA VEZ)
git remote add origin https://github.com/tuusuario/Proyecto-Comercio.git

# 7. Cambiar a rama main
git branch -M main

# 8. Subir a GitHub
git push -u origin main
```

---

## 🎯 PRÓXIMAS VECES (mucho más rápido)

```bash
# Solo 3 comandos:
git add .
git commit -m "Descripción del cambio"
git push
```

¿Necesitas ayuda en algún paso? 🚀
