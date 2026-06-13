# Integración Valkira → Proyecto Comercio (Proyecto Unificado)

## 📋 Resumen de la integración

Se ha unificado exitosamente **Proyecto Comercio** (backend + lógica de autenticación y perfiles) con **Valkira** (interfaz visual y catálogo de productos) en un único proyecto funcional.

### Qué se mantuvo de Proyecto Comercio
- ✅ Backend Spring Boot con autenticación (JWT, Firebase).
- ✅ Conexión a base de datos.
- ✅ Servicios y APIs (`/api/auth/*`, `/api/user/*`, `/api/products`).
- ✅ Sistema de perfiles de usuario.
- ✅ Lógica de negocio completa.

### Qué se incorporó de Valkira
- ✅ Diseño visual Valkira (colores, tipografía, componentes).
- ✅ Interfaz de catálogo con filtros, búsqueda, paginación y ordenamiento.
- ✅ Datos de productos (10 items de moda).
- ✅ Imágenes de productos.
- ✅ Estilos CSS (variables de color, componentes reutilizables).

---

## 🚀 Cómo ejecutar el proyecto unificado

### Requisitos
- **Node.js 16+** (para frontend)
- **Java 11+** (para backend)
- **Maven 3.6+** (para compilar backend)

### 1. Backend (Spring Boot)

```bash
cd backend

# Compilar
mvn clean install

# Ejecutar
mvn spring-boot:run
```

El backend se levanta en: `http://localhost:8080`

### 2. Frontend (React + Vite)

```bash
cd frontend

# Instalar dependencias
npm install

# Desarrollo (hot reload)
npm run dev

# Build para producción
npm run build
```

El frontend se abre en: `http://localhost:5173`

---

## 📁 Estructura del proyecto

```
Proyecto Comercio/
├── backend/                          # API Spring Boot
│   ├── src/main/java/.../
│   ├── pom.xml
│   └── target/backend-0.0.1-SNAPSHOT.jar
│
├── frontend/                         # React + Vite
│   ├── public/
│   │   ├── img/                     # Imágenes de Valkira (copiadas)
│   │   └── ...
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx            # [Valkira UI + Comercio API]
│   │   │   ├── Register.jsx         # [Valkira UI + Comercio API]
│   │   │   ├── ForgotPassword.jsx   # [Valkira UI + Comercio API]
│   │   │   ├── Profile.jsx          # [Valkira UI + Comercio API]
│   │   │   ├── Catalogo.jsx         # [Valkira UI + React hooks + API]
│   │   │   └── Producto.jsx         # [Valkira UI + API]
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # [Actualizado con link a Catálogo]
│   │   │   ├── Hero.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ...
│   │   ├── data/
│   │   │   └── valkira-products.js  # Datos de productos (fallback)
│   │   ├── styles/
│   │   │   ├── valkira-auth.css     # Estilos de auth y perfil (Valkira)
│   │   │   ├── valkira-global.css   # Variables y estilos globales (Valkira)
│   │   │   ├── global.css
│   │   │   └── ...
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
│
└── INTEGRATION.md                   # Detalle de archivos modificados
```

---

## 🔌 Endpoints principales

### Autenticación (Backend)
```
POST   /api/auth/register          # Registro
POST   /api/auth/login             # Login
POST   /api/auth/firebase-login    # Login con Google
```

### Usuario (Backend)
```
GET    /api/user/me                # Obtener perfil actual
PUT    /api/user/profile           # Actualizar perfil
GET    /api/user/preferences       # Preferencias
```

### Productos (Backend)
```
GET    /api/products               # Listar todos
GET    /api/products/:id           # Obtener por ID
POST   /api/products               # Crear (admin)
PUT    /api/products/:id           # Actualizar (admin)
DELETE /api/products/:id           # Eliminar (admin)
```

---

## 📄 Archivos clave modificados / creados

| Archivo | Origen | Cambios |
|---------|--------|---------|
| `frontend/src/pages/Login.jsx` | Proyecto Comercio | Reemplazado con UI de Valkira, lógica mantenida |
| `frontend/src/pages/Register.jsx` | Proyecto Comercio | Reemplazado con UI de Valkira, lógica mantenida |
| `frontend/src/pages/ForgotPassword.jsx` | Proyecto Comercio | Reemplazado con UI de Valkira, lógica mantenida |
| `frontend/src/pages/Profile.jsx` | Proyecto Comercio | Estilos Valkira aplicados, lógica mantenida |
| `frontend/src/pages/Catalogo.jsx` | Valkira (portado a React) | Filtros, búsqueda, paginación, orden; fetch `/api/products` con fallback |
| `frontend/src/pages/Producto.jsx` | Valkira (portado a React) | Detalle de producto; fetch `/api/products/:id` con fallback |
| `frontend/src/data/valkira-products.js` | Valkira | Datos de 10 productos (fallback) |
| `frontend/src/styles/valkira-auth.css` | Valkira (adaptado) | Estilos para auth y perfil |
| `frontend/src/styles/valkira-global.css` | Valkira (adaptado) | Variables y estilos globales |
| `frontend/src/components/Navbar.jsx` | Proyecto Comercio | Se añadió enlace a `/catalogo` |
| `frontend/src/App.jsx` | Proyecto Comercio | Se registraron rutas `/catalogo` y `/producto/:id` |
| `frontend/public/img/*` | Valkira | Imágenes copiadas (6 archivos .jpg) |
| `frontend/scripts/copy-valkira-images.*` | Nuevo | Scripts para copiar imágenes |

---

## ✅ Funcionalidades integradas

### Autenticación y Perfil
- ✅ Login con email/contraseña (Comercio backend)
- ✅ Login con Google (Comercio + Firebase)
- ✅ Registro de usuario
- ✅ Recuperación de contraseña
- ✅ Perfil de usuario editable
- ✅ Interfaz visual Valkira

### Catálogo de Productos
- ✅ Listado de productos
- ✅ Filtro por categoría (vestidos, blusas, faldas, accesorios)
- ✅ Filtro por talla (XS, S, M, L, XL, XXL)
- ✅ Filtro por rango de precio
- ✅ Filtro por estado (nuevo, oferta, limitado)
- ✅ Búsqueda por nombre
- ✅ Ordenamiento (destacados, precio ↑/↓, más nuevos, A-Z)
- ✅ Paginación (9 items/página)
- ✅ Detalle de producto con imagen y especificaciones
- ✅ Integración con backend `/api/products` (con fallback local)

### Navegación
- ✅ Navbar con links a Home, Catálogo, Login/Perfil
- ✅ Rutas protegidas (redirección a login si no autenticado)
- ✅ Links entre páginas (home → catálogo → detalle → back)

---

## 🧪 Flujo de prueba manual

1. **Acceder a Home**
   ```
   http://localhost:5173/
   ```
   Deberías ver hero con botones "Comenzar Ahora" e "Iniciar Sesión".

2. **Registrarse**
   - Click en "Registrarse"
   - Completa nombre, apellido, email, contraseña
   - Acepta política de privacidad
   - Click "Crear Cuenta"
   - Deberías ser redirigido a `/profile`

3. **Explorar Catálogo (sin login)**
   - Click en "Catálogo" en navbar
   - Deberías ver 10 productos
   - Prueba filtros: categoría, talla, precio, estado
   - Prueba búsqueda (escribe en "Buscar prendas...")
   - Prueba orden (dropdown "Ordenar por")
   - Prueba paginación (botones "Anterior/Siguiente")

4. **Ver detalle de producto**
   - Click en un producto
   - Deberías ver imagen, descripción, precio, material, tallas
   - Click "Volver al catálogo"

5. **Perfil (autenticado)**
   - Después de login, click en "Perfil"
   - Deberías ver datos del usuario
   - Click "Editar Perfil" para cambiar datos
   - Click "Guardar Cambios"

6. **Logout**
   - Click "Cerrar Sesión" en navbar
   - Deberías volver a Home y navbar deberá mostrar Login/Registro

---

## 🐛 Posibles errores y soluciones

| Error | Causa | Solución |
|-------|-------|----------|
| `Cannot find module 'valkira-global.css'` | Importación de CSS faltante | Verifica que `frontend/src/styles/valkira-*.css` existan |
| Imágenes no cargan | Imágenes no copiadas a `public/img/` | Ejecuta script `copy-valkira-images.js` o copia manualmente |
| `/api/products` retorna 404 | Backend no corre o endpoint no existe | Inicia backend con `mvn spring-boot:run` |
| Login falla | Error de JWT o Firebase | Revisa `backend/.env` y credenciales de Firebase |
| Página en blanco | Error en consola JS | Abre DevTools (F12) → Console y busca errores |

---

## 📝 Notas de desarrollo

- **Frontend y Backend corren en puertos diferentes**: Frontend en 5173, Backend en 8080. CORS está configurado en el backend para permitir el frontend.
- **Fallback de productos**: Si el backend no está disponible, el catálogo usará datos locales de `frontend/src/data/valkira-products.js`.
- **Estilos**: Los estilos Valkira (`valkira-*.css`) usan variables CSS y son reutilizables. Puedes ajustar colores en `:root{}` de `valkira-global.css`.
- **Autenticación**: Token JWT se guarda en `localStorage['token']`. Se envía en header `Authorization: Bearer <token>` a cada petición protegida.

---

## 🎯 Próximas mejoras (opcionales)

- [ ] Integración de carrito de compras
- [ ] Sistema de favoritos
- [ ] Búsqueda avanzada y recomendaciones basadas en perfil
- [ ] Pagos (Stripe, PayPal)
- [ ] Admin panel para gestionar productos
- [ ] Notificaciones en tiempo real
- [ ] Historial de compras

---

## 📞 Soporte

Si encuentras errores o dudas, revisa:
1. Logs del backend: `mvn spring-boot:run` output
2. DevTools del navegador: F12 → Console y Network
3. Archivo `frontend/INTEGRATION.md` para detalles técnicos
4. Este README

---

**Proyecto unificado completado: ✅ Valkira UI + Proyecto Comercio Backend**
