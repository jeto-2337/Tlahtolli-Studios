# 🎮 Tlahtolli Studio - API de Base de Datos

## 📊 Estado de la API

La tienda **Tlahtolli Studio** está configurada para usar una API de base de datos con Supabase. La aplicación funciona en dos modos:

### 🟢 Modo Conectado (API Activa)
- ✅ Productos se cargan desde la base de datos
- ✅ Cambios en el panel de admin se persisten
- ✅ Autenticación de usuarios funcional
- ✅ Sistema de órdenes persistente

### 🟡 Modo Local (Fallback)
- ⚠️ Productos se cargan desde archivos locales
- ⚠️ Cambios no se guardan entre sesiones
- ⚠️ Funcionalidad limitada

---

## 🚀 Activar la API de Base de Datos

### 1. Verificar Estado de Conexión

La aplicación incluye un **Indicador de Estado de BD** en la esquina inferior derecha que muestra:
- 🟢 **BD Conectada** - API funcionando correctamente
- 🔴 **Sin conexión a BD** - Usando modo local

### 2. Verificar en la Consola del Navegador

Abre la consola del navegador (F12) y ejecuta:

```javascript
tlahtolli.checkConnection()
```

Esto te dirá si la API está disponible y cuántos productos tiene la base de datos.

### 3. Inicializar la Base de Datos

Si la API está disponible pero no tiene productos, ejecuta:

```javascript
tlahtolli.initDatabase()
```

Esto cargará todos los productos locales (12 productos) en la base de datos.

### 4. Sincronizar Productos

Si quieres actualizar los productos de la base de datos con los cambios locales:

```javascript
tlahtolli.syncProducts()
```

### 5. Resetear Base de Datos (⚠️ Cuidado)

Para eliminar todos los productos y volver a cargar los valores por defecto:

```javascript
tlahtolli.resetDatabase()
```

---

## 🛠️ Utilidades Disponibles

Todas estas funciones están disponibles en `window.tlahtolli`:

| Comando | Descripción | Uso |
|---------|-------------|-----|
| `checkConnection()` | Verifica si la API está disponible | Diagnóstico |
| `initDatabase()` | Carga productos iniciales en BD vacía | Primera vez |
| `syncProducts()` | Sincroniza cambios locales a BD | Actualización |
| `resetDatabase()` | ⚠️ Borra todo y reinicia | Solo emergencias |

---

## 📦 Estructura de la API

### Endpoints de Productos

```
GET    /products              - Listar todos los productos
GET    /products/:id          - Obtener producto por ID
POST   /products              - Crear nuevo producto
PUT    /products/:id          - Actualizar producto
DELETE /products/:id          - Eliminar producto
POST   /products/validate-sku - Validar SKU único
POST   /products/reset        - Resetear a productos por defecto
DELETE /products              - Eliminar todos los productos
```

### Endpoints de Autenticación

```
POST /auth/register          - Registrar nuevo usuario
POST /auth/login             - Iniciar sesión
GET  /auth/user/:email       - Obtener usuario por email
POST /auth/deactivate        - Desactivar cuenta
POST /auth/reactivate        - Reactivar cuenta
POST /auth/forgot-password   - Solicitar reset de contraseña
POST /auth/validate-token    - Validar token de reset
POST /auth/reset-password    - Restablecer contraseña
GET  /users                  - Listar todos los usuarios (admin)
```

---

## 🔧 Configuración Técnica

### Ubicación de Archivos

```
/supabase/functions/server/
├── index.tsx          # Servidor API con Hono
└── kv_store.tsx       # Sistema de almacenamiento KV

/utils/
├── api.ts             # Cliente API para frontend
└── initDatabase.ts    # Utilidades de inicialización

/utils/supabase/
└── info.tsx           # Credenciales de Supabase
```

### Variables de Entorno (Supabase)

El servidor API necesita estas variables configuradas en Supabase:

```
SUPABASE_URL              # URL del proyecto
SUPABASE_SERVICE_ROLE_KEY # Clave de servicio
```

---

## 📝 Modelo de Datos

### Producto

```typescript
{
  id: string;              // ID único
  sku: string;             // SKU (código de producto)
  name: string;            // Nombre del producto
  description: string;     // Descripción
  price: number;           // Precio en pesos
  originalPrice?: number;  // Precio original (si hay descuento)
  image: string;           // URL de imagen
  category: string;        // Categoría (taza, playera, peluche, figura)
  stock: number;           // Cantidad en stock
  rarity: string;          // Rareza (Común, Raro, Épico, Legendario)
  collection?: string;     // Colección del juego
  isAvailable: boolean;    // Si está disponible para compra
  hasSales?: boolean;      // Si tiene ventas registradas
}
```

### Usuario

```typescript
{
  id: string;              // ID único
  firstName: string;       // Nombre
  paternalLastName: string;// Apellido paterno
  maternalLastName: string;// Apellido materno
  email: string;           // Email (único)
  password: string;        // Contraseña (hasheada en producción)
  isActive: boolean;       // Si la cuenta está activa
  isAdmin: boolean;        // Si es administrador
  rememberMe: boolean;     // Recordar sesión
  createdAt: string;       // Fecha de creación
}
```

---

## 🎯 Flujo de Trabajo Recomendado

### Primera Vez
1. Verificar conexión: `tlahtolli.checkConnection()`
2. Inicializar BD: `tlahtolli.initDatabase()`
3. Verificar que se crearon los productos
4. Probar el panel de administración

### Desarrollo Diario
1. La app carga productos automáticamente
2. Cambios en admin se guardan automáticamente
3. Fallback a modo local si API no está disponible

### Actualización de Productos
1. Editar productos en `/data/products.ts`
2. Ejecutar `tlahtolli.syncProducts()`
3. Verificar cambios en la app

---

## 🐛 Solución de Problemas

### "Sin conexión a BD"

**Causa**: La función de Supabase no está desplegada o no responde

**Solución**:
1. Verifica en Supabase Dashboard que la función esté desplegada
2. Revisa los logs de la función en Supabase
3. Verifica que las variables de entorno estén configuradas

### "Error al cargar productos"

**Causa**: Error en la API o datos corruptos

**Solución**:
1. Ejecuta `tlahtolli.checkConnection()` para diagnóstico
2. Si conecta pero falla, ejecuta `tlahtolli.resetDatabase()`
3. Revisa la consola del navegador para más detalles

### Productos duplicados

**Causa**: Múltiples inicializaciones o SKUs duplicados

**Solución**:
1. Ejecuta `tlahtolli.resetDatabase()` para limpiar
2. Verifica que los SKUs en `/data/products.ts` sean únicos

---

## 📱 Indicadores Visuales

### Indicador de BD (Esquina inferior derecha)
- 🟢 **Verde** - Conectado y funcionando
- 🔴 **Rojo** - Sin conexión
- 🔵 **Azul** - Verificando conexión

Haz clic en el indicador para ver:
- Estado detallado de conexión
- Número de productos en BD
- Instrucciones de activación
- Acceso rápido a utilidades

### Indicador de Carrito (También visible)
- 💚 Carrito sincronizado con cuenta
- 🔒 Carrito en localStorage

---

## 🎨 Integración con el Sistema

La API está completamente integrada con:

✅ **Panel de Administración**
- Crear, editar, eliminar productos
- Gestión de inventario
- Logs de auditoría

✅ **Sistema de Autenticación**
- Registro y login de usuarios
- Recuperación de contraseña
- Desactivación/reactivación de cuentas

✅ **Sistema de Carrito**
- Validación de stock en tiempo real
- Sincronización entre dispositivos
- Persistencia de carrito

✅ **Sistema de Órdenes**
- Generación de órdenes
- Tracking de pedidos
- Historial de compras

---

## 📚 Recursos Adicionales

- **Documentación de Supabase**: https://supabase.com/docs
- **Hono Framework**: https://hono.dev/
- **Código de la API**: `/supabase/functions/server/index.tsx`

---

## ✨ Características Únicas de Tlahtolli Studio

La API está diseñada para soportar la temática del videojuego:

🎯 **Sistema de Rareza**: Común, Raro, Épico, Legendario
🗺️ **Colecciones**: Mundo 1-4 del videojuego
🎒 **Bolsa de Tesoros**: Carrito con narrativa de aventura
⚔️ **Camino del Aventurero**: Sistema de tracking temático

---

**Última actualización**: 2026-02-20
**Versión de la API**: 1.0.0
**Project ID**: hiowfuekyeeixfxdpkyz
