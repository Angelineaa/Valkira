# ModaAI - Documentación del Proyecto

**Fecha**: Junio 2026  
**Versión**: 1.0  
**Estado**: En Producción con Modernización Visual Completada

---

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Fases Completadas](#fases-completadas)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Arquitectura del Sistema](#arquitectura-del-sistema)
5. [Características Implementadas](#características-implementadas)
6. [Configuración de Firebase](#configuración-de-firebase)
7. [Sistema de Diseño CSS](#sistema-de-diseño-css)
8. [Cambios Realizados en UI/UX](#cambios-realizados-en-uiux)
9. [Cómo Ejecutar el Proyecto](#cómo-ejecutar-el-proyecto)
10. [Estructura del Proyecto](#estructura-del-proyecto)
11. [Próximos Pasos](#próximos-pasos)

---

## 📱 Descripción General

**ModaAI** es una plataforma de recomendación de moda inteligente impulsada por IA que personaliza sugerencias de prendas según:
- Gustos y preferencias del usuario
- Características físicas
- Estilo personal
- Comportamiento de compra

La plataforma utiliza **Firebase para autenticación OAuth con Google** y un backend **Spring Boot** con base de datos MySQL en Railway.

---

## ✅ Fases Completadas

### Fase 1: Integración de Firebase Google OAuth ✅
- ✅ Firebase SDK configurado en frontend
- ✅ Backend Spring Boot con Firebase Admin SDK
- ✅ Endpoint `/api/auth/firebase` para verificación de tokens
- ✅ Sistema de generación de JWT personalizado
- ✅ Base de datos sincronizada con autenticación

### Fase 2: Google Login en Register ✅
- ✅ Botón "Continuar con Google" en página de login
- ✅ Botón "Continuar con Google" en página de registro
- ✅ Flujo completo de OAuth popup
- ✅ Creación automática de usuario al registrarse con Google

### Fase 3: Modernización Visual Completa ✅
- ✅ Sistema de diseño CSS moderno (50+ tokens)
- ✅ Paleta de colores profesional
- ✅ Componentes reutilizables (botones, formularios, etc.)
- ✅ Responsive design en todas las páginas
- ✅ Animaciones y transiciones suaves
- ✅ Navbar mejorada
- ✅ Formularios con mejor UX

### Fase 4: Corrección de Problemas Visuales ✅
- ✅ Colores aplicados correctamente en toda la app
- ✅ Componentes bien alineados
- ✅ Logos de Google renderizados correctamente
- ✅ Checkbox y elementos de formulario separados adecuadamente
- ✅ Botones con estilos consistentes

---

## 🛠️ Stack Tecnológico

### Frontend
```
React 19.2.6
├── Vite 8.0.12 (bundler)
├── React Router DOM v6
├── Firebase SDK (autenticación OAuth)
└── CSS Moderno (Variables CSS + BEM)
```

### Backend
```
Spring Boot 3.5.14
├── Spring Security (JWT + roles)
├── Firebase Admin SDK (verificación de tokens)
├── JPA/Hibernate (ORM)
├── MySQL Driver
└── Maven (build)
```

### Infraestructura
```
Base de Datos: MySQL en Railway
├── Host: acela.proxy.rlwy.net:36282
├── Database: railway
├── User: root
└── Tablas: users, preferences, physical_characteristics, password_reset_tokens, consents
```

---

## 🏗️ Arquitectura del Sistema

### Flujo de Autenticación Google OAuth

```
1. Usuario hace clic en "Continuar con Google"
   ↓
2. Firebase SDK abre popup de Google
   ↓
3. Usuario se autentica con Google
   ↓
4. Firebase devuelve idToken
   ↓
5. Frontend envía idToken a /api/auth/firebase
   ↓
6. Backend verifica token con Firebase Admin SDK
   ↓
7. Backend busca/crea usuario en BD
   ↓
8. Backend genera JWT personalizado
   ↓
9. Frontend almacena JWT en localStorage
   ↓
10. Usuario redirigido a /profile
```

### Estructura de Carpetas

```
proyecto-comercio/
├── frontend/                      # React + Vite
│   ├── src/
│   │   ├── pages/                # Componentes de páginas
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Preferences.jsx
│   │   │   └── ForgotPassword.jsx
│   │   ├── components/           # Componentes reutilizables
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   └── FeatureCard.jsx
│   │   ├── services/             # Servicios API
│   │   │   ├── api.js            # Endpoints REST
│   │   │   └── firebaseAuth.js   # Firebase OAuth
│   │   ├── styles/               # Sistema de diseño CSS
│   │   │   ├── variables.css     # 50+ tokens de diseño
│   │   │   ├── global.css        # Reset y estilos base
│   │   │   ├── layout.css        # Grillas y layouts
│   │   │   ├── forms.css         # Formularios
│   │   │   ├── buttons.css       # Botones (6 variantes)
│   │   │   ├── navbar.css        # Navegación
│   │   │   └── pages/
│   │   │       ├── login.css
│   │   │       ├── home.css
│   │   │       ├── profile.css
│   │   │       └── preferences.css
│   │   └── index.css             # Entry point CSS
│   └── vite.config.js
│
├── backend/                       # Spring Boot
│   ├── src/main/
│   │   ├── java/com/modaai/backend/
│   │   │   ├── BackendApplication.java
│   │   │   ├── config/
│   │   │   │   └── SecurityConfig.java
│   │   │   ├── controllers/
│   │   │   │   └── AuthController.java
│   │   │   ├── services/
│   │   │   │   └── AuthService.java
│   │   │   ├── entities/
│   │   │   │   ├── User.java
│   │   │   │   ├── Preference.java
│   │   │   │   ├── PhysicalCharacteristic.java
│   │   │   │   ├── PasswordResetToken.java
│   │   │   │   └── Consent.java
│   │   │   ├── repositories/      # JPA Repositories
│   │   │   ├── dto/
│   │   │   │   └── RegisterRequest.java
│   │   │   └── security/
│   │   └── resources/
│   │       └── application.properties
│   └── pom.xml
│
└── db/
    └── schema.sql                 # Esquema de BD
```

---

## ✨ Características Implementadas

### 1. Autenticación
- ✅ Login tradicional (email/password)
- ✅ Registro con email/password
- ✅ Google OAuth (Login y Register)
- ✅ JWT con roles (USER, SELLER, ADMIN)
- ✅ Recuperación de contraseña
- ✅ Cierre de sesión

### 2. Perfil de Usuario
- ✅ Edición de datos personales
- ✅ Avatar con iniciales
- ✅ Estadísticas de usuario
- ✅ Información de cuenta

### 3. Preferencias de Usuario
- ✅ Colores favoritos (15 opciones)
- ✅ Estilos de ropa (15 opciones)
- ✅ Tipo de cuerpo (8 opciones)
- ✅ Almacenamiento en BD
- ✅ Actualización en tiempo real

### 4. Página de Inicio
- ✅ Hero section con CTA
- ✅ Sección de beneficios
- ✅ Sección de características
- ✅ Llamadas a la acción

### 5. Diseño y UX
- ✅ Navbar responsive
- ✅ Footer con enlaces
- ✅ Formularios validados
- ✅ Mensajes de error/éxito
- ✅ Animaciones suaves
- ✅ Paleta de colores coherente

---

## 🔐 Configuración de Firebase

### Frontend (.env)
```
VITE_FIREBASE_API_KEY=<your-api-key>
VITE_FIREBASE_AUTH_DOMAIN=<your-auth-domain>
VITE_FIREBASE_PROJECT_ID=<your-project-id>
VITE_FIREBASE_STORAGE_BUCKET=<your-storage-bucket>
VITE_FIREBASE_MESSAGING_SENDER_ID=<your-messaging-sender-id>
VITE_FIREBASE_APP_ID=<your-app-id>
```

### Backend (application.properties)
```properties
firebase.enabled=true
# Firebase Admin SDK se configura automáticamente desde
# google-services.json o credenciales de entorno
```

### Flujo en Backend
1. `AuthController` recibe `idToken` de Google
2. `AuthService` verifica el token con Firebase Admin SDK
3. Si es válido, busca o crea usuario en BD
4. Genera JWT con roles y claims personalizados
5. Devuelve JWT al frontend

---

## 🎨 Sistema de Diseño CSS

### Variables CSS (variables.css)

#### Colores Principales
```css
--color-primary: #006eee;           /* Azul vibrante */
--color-primary-hover: #0053c6;     /* Azul oscuro */
--color-primary-light: #e8f0ff;     /* Azul claro */
--color-primary-lighter: #f5f8ff;   /* Azul muy claro */
```

#### Backgrounds
```css
--color-bg-primary: #f8f9fc;        /* Fondo principal */
--color-bg-secondary: #f0f3f9;      /* Fondo secundario */
--color-bg-tertiary: #e9ecf3;       /* Fondo terciario */
--color-surface: #ffffff;            /* Superficies */
```

#### Texto
```css
--color-text-primary: #111827;      /* Texto principal */
--color-text-secondary: #6b7280;    /* Texto secundario */
--color-text-tertiary: #9ca3af;     /* Texto terciario */
--color-text-inverse: #ffffff;      /* Texto inverso */
```

#### Estados
```css
--color-error: #dc2626;
--color-success: #16a34a;
--color-warning: #f59e0b;
--color-info: #3b82f6;
```

#### Espaciado (Escala 8px)
```css
--spacing-xs: 0.25rem;   /* 4px */
--spacing-sm: 0.5rem;    /* 8px */
--spacing-md: 1rem;      /* 16px */
--spacing-lg: 1.5rem;    /* 24px */
--spacing-xl: 2rem;      /* 32px */
--spacing-2xl: 2.5rem;   /* 40px */
--spacing-3xl: 3rem;     /* 48px */
```

#### Tipografía
```css
--font-family-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
--font-size-xs: 0.75rem;    /* 12px */
--font-size-sm: 0.875rem;   /* 14px */
--font-size-base: 1rem;     /* 16px */
--font-size-lg: 1.125rem;   /* 18px */
--font-size-xl: 1.25rem;    /* 20px */
--font-size-2xl: 1.5rem;    /* 24px */
--font-size-3xl: 1.875rem;  /* 30px */
--font-size-4xl: 2.25rem;   /* 36px */

--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

#### Sombras
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

#### Border Radius
```css
--radius-sm: 0.375rem;   /* 6px */
--radius-md: 0.5rem;     /* 8px */
--radius-lg: 0.75rem;    /* 12px */
--radius-xl: 1rem;       /* 16px */
--radius-2xl: 1.5rem;    /* 24px */
--radius-full: 9999px;   /* 100% */
```

### Componentes CSS

#### Botones (6 variantes)
- `.button-primary` - Azul principal
- `.button-secondary` - Gris secundario
- `.button-outline` - Borde con fondo transparente
- `.button-ghost` - Completamente transparente
- `.button-success` - Verde
- `.button-danger` - Rojo

**Tamaños**: `button-xs`, `button-sm`, `button-md`, `button-lg`, `button-xl`

**Estados**: `button-full` (ancho 100%), `button-icon` (solo icono)

#### Formularios
- Input focus con box-shadow en color primario
- Checkboxes con accent-color personalizado
- Selects con dropdown custom
- Validación visual (error, success)
- Placeholder con color secundario

#### Layout
- `.container` - Max-width controlado
- `.grid-2`, `.grid-3`, `.grid-4` - Grillas responsivas
- `.flex-center` - Flexbox centrado
- Utilities: `.m-*`, `.p-*`, `.gap-*` - Espaciado

---

## 🎯 Cambios Realizados en UI/UX

### 1. Estructura de CSS Modular
**Antes**: Archivos CSS desorganizados  
**Después**: Sistema de diseño con 50+ variables reutilizables

Archivos:
- `variables.css` - Tokens de diseño
- `global.css` - Reset y estilos base
- `layout.css` - Grillas y layouts
- `forms.css` - Formularios
- `buttons.css` - Botones
- `navbar.css` - Navegación
- `pages/*.css` - Estilos específicos de página

### 2. Paleta de Colores
**Antes**: Colores inconsistentes  
**Después**: 
- Primario: #006eee (azul vibrante)
- Backgrounds: Grises azulados profesionales
- Textos: Jerarquía clara

### 3. Componentes
**Login/Register:**
- Botones con clase `.button-primary` y `.button-lg`
- Google button con logo multicolor
- Separación clara entre elementos
- Checkbox con espaciado adecuado

**Navbar:**
- Logo con gradiente y fondo azul
- Links con efectos hover
- Botón de registro destacado
- Responsive en mobile

**Formularios:**
- Inputs con focus states
- Validaciones visuales
- Help text para instrucciones
- Checkboxes bien espaciados

### 4. Responsive Design
- Mobile first
- Breakpoints: sm, md, lg
- Grillas flexibles
- Espaciado escalable

---

## 🚀 Cómo Ejecutar el Proyecto

### Requisitos Previos
```bash
- Node.js 18+ 
- Java 17+
- MySQL 8.0+
- Maven 3.8+
```

### 1. Frontend (Vite + React)
```bash
cd frontend

# Instalar dependencias
npm install

# Crear archivo .env en raíz del frontend
# (con credenciales de Firebase)

# Modo desarrollo (http://localhost:5174)
npm run dev

# Build para producción
npm run build
```

### 2. Backend (Spring Boot)
```bash
cd backend

# Ejecutar servidor de desarrollo
./mvnw spring-boot:run

# Compilar JAR
./mvnw clean package

# El servidor estará en http://localhost:8080
```

### 3. Base de Datos
```bash
# Conectarse a MySQL
mysql -h acela.proxy.rlwy.net -u root -p railway

# Ejecutar schema
source db/schema.sql
```

### URLs de Desarrollo
- Frontend: `http://localhost:5174`
- Backend: `http://localhost:8080`
- API: `http://localhost:8080/api`

---

## 📁 Estructura del Proyecto

### Frontend - Páginas
- `/` - Home (landing page)
- `/login` - Login con email o Google
- `/register` - Registro con email o Google
- `/profile` - Perfil del usuario
- `/preferences` - Preferencias de usuario
- `/forgot-password` - Recuperar contraseña

### Backend - Endpoints API

#### Autenticación
```
POST /api/auth/login              - Login tradicional
POST /api/auth/register           - Registro
POST /api/auth/firebase           - Login con Google
POST /api/auth/forgot-password    - Solicitar recuperación
POST /api/auth/reset-password     - Resetear contraseña
```

#### Usuario
```
GET /api/user/me                  - Obtener usuario actual
PUT /api/user/profile             - Actualizar perfil
GET /api/user/preferences         - Obtener preferencias
PUT /api/user/preferences         - Actualizar preferencias
```

### Base de Datos - Tablas
```sql
users                         -- Usuarios del sistema
├── id (PK)
├── email (UNIQUE)
├── password (hash)
├── firstName
├── lastName
├── role (USER, SELLER, ADMIN)
├── firebaseUid
├── createdAt
└── updatedAt

preferences                   -- Preferencias de usuario
├── id (PK)
├── userId (FK)
├── favoriteColors (JSON)
├── styles (JSON)
├── bodyType
└── updatedAt

physical_characteristics      -- Características físicas
├── id (PK)
├── userId (FK)
├── height
├── weight
├── skinTone
└── updatedAt

password_reset_tokens         -- Tokens de recuperación
├── id (PK)
├── userId (FK)
├── token
├── expiresAt
└── createdAt

consents                       -- Consentimientos
├── id (PK)
├── userId (FK)
├── privacyAccepted
├── marketingAccepted
└── acceptedAt
```

---

## 🔄 Flujos Principales

### 1. Registro con Google
```
Usuario → Clic "Continuar con Google"
       → Firebase popup de Google
       → Usuario autoriza
       → Firebase devuelve idToken
       → Frontend POST /api/auth/firebase con idToken
       → Backend verifica con Firebase Admin SDK
       → Backend crea usuario en BD
       → Backend genera JWT
       → Frontend almacena JWT
       → Redirección a /profile
```

### 2. Login
```
Usuario → Ingresa email/password
       → Clic "Iniciar Sesión"
       → Frontend POST /api/auth/login
       → Backend valida credenciales
       → Backend genera JWT
       → Frontend almacena JWT
       → Redirección a /profile
```

### 3. Editar Preferencias
```
Usuario → Va a /preferences
       → Modifica colores/estilos/tipo de cuerpo
       → Clic "Guardar"
       → Frontend PUT /api/user/preferences
       → Backend actualiza BD
       → Usuario ve confirmación
```

---

## 🐛 Problemas Resueltos

### Problema 1: Colores no se mostraban
**Causa**: Componentes usaban clases CSS antiguas  
**Solución**: Actualizar componentes a nuevas clases del design system

### Problema 2: Navbar desorganizada
**Causa**: Flexbox mal configurado  
**Solución**: Restructurar con `.navbar-content` y `.navbar-links`

### Problema 3: Checkbox sin separación
**Causa**: Espaciado con `spacing-sm` (8px)  
**Solución**: Cambiar a `spacing-md` (16px) y agregar `flex-shrink: 0`

### Problema 4: Logo de Google roto
**Causa**: SVG con viewBox incorrecto  
**Solución**: Usar SVG correcto con fill colors de Google

---

## 📊 Estadísticas del Proyecto

### Frontend
- Módulos CSS: 18 archivos
- Variables CSS: 50+
- Componentes React: 10+
- Páginas: 6
- Build size: ~374 KB (JavaScript + CSS minificado)

### Backend
- Entidades JPA: 5
- Controladores: 1 (AuthController)
- Servicios: 1 (AuthService)
- Repositorios: 5
- Endpoints REST: 8+

### Base de Datos
- Tablas: 5
- Relaciones: 5 (foreign keys)
- Índices: 10+

---

## 🔮 Próximos Pasos

### Corto Plazo (1-2 sprints)
- [ ] Implementar recomendaciones de IA
- [ ] Agregar búsqueda de prendas
- [ ] Integración con catálogo de moda
- [ ] Sistema de wishlist
- [ ] Notificaciones en tiempo real

### Mediano Plazo (2-3 sprints)
- [ ] Aplicación móvil (React Native o Flutter)
- [ ] Dashboard de vendedor
- [ ] Sistema de calificaciones y reviews
- [ ] Chat en vivo con soporte
- [ ] Analytics y tracking

### Largo Plazo (3+ sprints)
- [ ] Marketplace de moda
- [ ] Integración de pagos (Stripe)
- [ ] Sistema de recomendación avanzado
- [ ] Virtual try-on con AR
- [ ] Comunidad de usuarios

---

## 📞 Contacto y Soporte

Para dudas o reportar bugs:
1. Contactar al equipo de desarrollo
2. Revisar la documentación en `/docs`
3. Consultar las guías de setup en cada carpeta (frontend, backend)

---

## 📝 Notas Importantes

1. **Firebase**: Asegúrate de que el dominio del frontend esté autorizado en Firebase Console
2. **Variables de Entorno**: No comitear archivos `.env` - usar `.env.example`
3. **CORS**: Backend tiene CORS habilitado para localhost:5174
4. **JWT**: Token válido por 24 horas, guarda en localStorage
5. **Base de Datos**: Connection pooling configurado en Spring Boot

---

## 🎓 Para Nuevos Desarrolladores

1. Clonar el repositorio
2. Seguir setup en `frontend/README.md` y `backend/README.md`
3. Revisar esta documentación
4. Familiarizarse con el sistema de diseño CSS en `frontend/src/styles/variables.css`
5. Consultar ejemplos en componentes existentes

---

**Última actualización**: Junio 2026  
**Versión de documento**: 1.0  
**Responsable**: Equipo de Desarrollo ModaAI
