# ✅ Checklist de Verificación - Integración Valkira + Proyecto Comercio

Use este checklist para verificar que todo está funcionando correctamente.

## 📦 Pre-requisitos

- [ ] Node.js 16+ instalado (`node --version`)
- [ ] Java 11+ instalado (`java -version`)
- [ ] Maven 3.6+ instalado (`mvn --version`)
- [ ] Carpeta `frontend/public/img/` existe y contiene 6 imágenes (.jpg)

## 🔧 Instalación

- [ ] Backend compilado sin errores: `cd backend && mvn clean install`
- [ ] Frontend dependencias instaladas: `cd frontend && npm install`
- [ ] Sin errores de npm during install

## 🚀 Ejecución

### Backend
- [ ] Backend inicia sin errores: `mvn spring-boot:run`
- [ ] Mensaje "Application started" o similar en consola
- [ ] Servidor escucha en `http://localhost:8080`

### Frontend
- [ ] Frontend inicia sin errores: `npm run dev` (desde `frontend/`)
- [ ] Mensaje "Local: http://localhost:5173" en consola
- [ ] No hay errores en la consola del navegador (F12 → Console)

## 🌐 Rutas y Navegación

- [ ] Home carga sin errores: `http://localhost:5173/`
- [ ] Navbar se muestra correctamente
- [ ] Links de navegación funcionan

### Rutas Públicas
- [ ] `/` (Home) — carga
- [ ] `/login` — formulario visible
- [ ] `/register` — formulario visible
- [ ] `/forgot-password` — formulario visible
- [ ] `/catalogo` — listado de productos visible

### Rutas Protegidas (requieren login)
- [ ] `/profile` — redirige a `/login` si no autenticado
- [ ] `/preferences` — redirige a `/login` si no autenticado

## 🔐 Autenticación

- [ ] Registro funciona: email, password, aceptar términos
- [ ] Después de registrar → redirige a `/profile`
- [ ] Token guardado en `localStorage['token']`
- [ ] Login funciona con email/password registrado
- [ ] Google login muestra popup (si Firebase configurado)
- [ ] Logout elimina token y redirige a Home

## 📦 Catálogo y Productos

- [ ] Catálogo carga 10 productos
- [ ] Imágenes aparecen correctamente (6 imágenes de Valkira)
- [ ] Búsqueda funciona: escribe "vestido" y filtra
- [ ] Filtro por Categoría funciona (checkbox categorías)
- [ ] Filtro por Tallas funciona (checkbox tallas)
- [ ] Filtro por Precio funciona (slider de precio)
- [ ] Filtro por Estado funciona (nuevo, oferta, limitado)
- [ ] Orden funciona: destacados, precio ↓, precio ↑, A-Z, nuevos
- [ ] Paginación funciona: "Anterior", número página, "Siguiente"
- [ ] Click en producto → redirige a `/producto/:id`
- [ ] Detalle de producto muestra: nombre, imagen, descripción, precio, material, tallas

## 🔌 API Backend

- [ ] Backend devuelve productos en `GET /api/products`
  ```bash
  curl http://localhost:8080/api/products
  ```
  Deberías obtener JSON con lista de productos.

- [ ] Backend devuelve un producto en `GET /api/products/1`
  ```bash
  curl http://localhost:8080/api/products/1
  ```

- [ ] Auth endpoints funcionan (registro, login)
  ```bash
  curl -X POST http://localhost:8080/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"Test123!","firstName":"Test","lastName":"User"}'
  ```

## 🎨 Estilos y UI

- [ ] Colores Valkira aplicados (crema, charcoal, blush, gold)
- [ ] Navbar se ve correctamente
- [ ] Formularios de auth tienen estilos Valkira
- [ ] Catálogo se ve con grid responsive
- [ ] Productos tienen imágenes y bordes redondeados
- [ ] Botones tienen estilos consistentes

## 📋 Archivos esperados

### Frontend
- [ ] `frontend/src/pages/Login.jsx` — existe y tiene UI Valkira
- [ ] `frontend/src/pages/Register.jsx` — existe y tiene UI Valkira
- [ ] `frontend/src/pages/Catalogo.jsx` — existe con filtros/búsqueda/paginación
- [ ] `frontend/src/pages/Producto.jsx` — existe con detalle
- [ ] `frontend/src/data/valkira-products.js` — existe con 10 productos
- [ ] `frontend/src/styles/valkira-auth.css` — existe con estilos
- [ ] `frontend/src/styles/valkira-global.css` — existe con variables
- [ ] `frontend/public/img/` — existe con 6 imágenes

### Backend
- [ ] `backend/src/main/java/.../ProductController.java` — existe
- [ ] `backend/target/backend-0.0.1-SNAPSHOT.jar` — existe

## 🧪 Flujo completo

1. [ ] Registra usuario nuevo
2. [ ] Verifica que `/profile` muestra datos del usuario
3. [ ] Navega a `/catalogo`
4. [ ] Prueba cada filtro
5. [ ] Click en un producto → detalle se abre
6. [ ] Vuelve al catálogo
7. [ ] Logout
8. [ ] Intenta acceder a `/profile` sin login → redirección a `/login`
9. [ ] Login con usuario registrado
10. [ ] Verifica que `/profile` está accesible nuevamente

## 🐛 Troubleshooting

Si algo falla:

1. **Abre DevTools (F12) → Console** y busca errores rojos
2. **Revisa logs del backend**: busca "ERROR" o "Exception"
3. **Verifica que las imágenes existen**: `ls frontend/public/img/`
4. **Comprueba que los puertos 5173 y 8080 no están en uso**
5. **Limpia cache del navegador** (Ctrl+Shift+Del)

---

**Si todos los items están marcados → ✅ Integración exitosa**

