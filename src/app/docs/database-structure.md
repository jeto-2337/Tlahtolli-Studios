# 🗄️ Estructura de Base de Datos - Tlahtolli Studio

## 📊 Sistema de Almacenamiento

La aplicación **Tlahtolli Studio** utiliza un sistema de **Key-Value Store (KV)** en lugar de tablas relacionales tradicionales.

---

## 🏗️ Tabla Principal

### `kv_store_80f0f1f5`

Esta es la **única tabla** en la base de datos de Supabase.

```sql
CREATE TABLE kv_store_80f0f1f5 (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);
```

#### Columnas:
- **`key`** (TEXT, PRIMARY KEY) - Identificador único de cada registro
- **`value`** (JSONB) - Datos almacenados en formato JSON

#### Vista en Supabase:
https://supabase.com/dashboard/project/hiowfuekyeeixfxdpkyz/database/tables

---

## 🔑 Keys Utilizadas

En lugar de tener múltiples tablas, almacenamos diferentes tipos de datos usando diferentes **keys**:

### 1. **`tlahtolli_products`**
Almacena el array completo de productos de la tienda.

**Tipo de dato**: `Array<Product>`

**Estructura**:
```json
[
  {
    "id": "1",
    "sku": "mug-001",
    "name": "Taza del Portal Místico",
    "description": "Taza de cerámica con diseño del portal místico...",
    "price": 299,
    "originalPrice": 349,
    "image": "https://...",
    "category": "taza",
    "stock": 15,
    "rarity": "Épico",
    "collection": "Mundo 1: El Despertar",
    "isAvailable": true,
    "hasSales": false,
    "createdAt": "2026-02-20T10:00:00Z",
    "updatedAt": "2026-02-20T12:00:00Z"
  },
  ...
]
```

**Campos del Producto**:
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | string | ID único del producto |
| `sku` | string | SKU (código de producto único) |
| `name` | string | Nombre del producto |
| `description` | string | Descripción detallada |
| `price` | number | Precio actual en pesos |
| `originalPrice` | number? | Precio original (si hay descuento) |
| `image` | string | URL de la imagen |
| `category` | string | Categoría: taza, playera, peluche, figura |
| `stock` | number | Cantidad disponible |
| `rarity` | string | Rareza: Común, Raro, Épico, Legendario |
| `collection` | string? | Colección del videojuego (Mundo 1-4) |
| `isAvailable` | boolean | Si está disponible para compra |
| `hasSales` | boolean | Si tiene ventas registradas |
| `createdAt` | string | Fecha de creación (ISO) |
| `updatedAt` | string | Última actualización (ISO) |

---

### 2. **`tlahtolli_users`**
Almacena el array de usuarios registrados.

**Tipo de dato**: `Array<User>`

**Estructura**:
```json
[
  {
    "id": "user-1645123456789",
    "firstName": "Juan",
    "paternalLastName": "García",
    "maternalLastName": "López",
    "email": "juan.garcia@example.com",
    "password": "hashed_password_here",
    "isActive": true,
    "isAdmin": false,
    "rememberMe": true,
    "createdAt": "2026-02-20T10:00:00Z",
    "passwordUpdatedAt": "2026-02-20T10:00:00Z",
    "deactivatedAt": null,
    "reactivatedAt": null
  },
  ...
]
```

**Campos del Usuario**:
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | string | ID único del usuario (user-timestamp) |
| `firstName` | string | Nombre |
| `paternalLastName` | string | Apellido paterno |
| `maternalLastName` | string | Apellido materno |
| `email` | string | Email (único) |
| `password` | string | Contraseña (texto plano en prototipo) |
| `isActive` | boolean | Si la cuenta está activa |
| `isAdmin` | boolean | Si es administrador |
| `rememberMe` | boolean | Preferencia de recordar sesión |
| `createdAt` | string | Fecha de registro |
| `passwordUpdatedAt` | string? | Última actualización de contraseña |
| `deactivatedAt` | string? | Fecha de desactivación |
| `reactivatedAt` | string? | Fecha de reactivación |

⚠️ **Nota de Seguridad**: En producción, las contraseñas deberían estar hasheadas con bcrypt u otro algoritmo seguro.

---

### 3. **`tlahtolli_password_tokens`**
Almacena tokens de recuperación de contraseña.

**Tipo de dato**: `Array<ResetToken>`

**Estructura**:
```json
[
  {
    "email": "juan.garcia@example.com",
    "token": "reset-1645123456789-abc123xyz",
    "expiresAt": "2026-02-20T10:05:00Z",
    "createdAt": "2026-02-20T10:00:00Z",
    "used": false,
    "usedAt": null
  },
  ...
]
```

**Campos del Token**:
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `email` | string | Email del usuario |
| `token` | string | Token único de reset |
| `expiresAt` | string | Fecha de expiración (5 minutos) |
| `createdAt` | string | Fecha de creación |
| `used` | boolean | Si el token ya fue usado |
| `usedAt` | string? | Fecha de uso |

---

## 🔄 Operaciones Disponibles

El archivo `/supabase/functions/server/kv_store.tsx` proporciona estas funciones:

### Operaciones Simples:
```typescript
// Guardar un valor
await kv.set('tlahtolli_products', products);

// Obtener un valor
const products = await kv.get('tlahtolli_products');

// Eliminar un valor
await kv.del('tlahtolli_products');
```

### Operaciones Múltiples:
```typescript
// Guardar múltiples valores
await kv.mset(
  ['key1', 'key2'], 
  [value1, value2]
);

// Obtener múltiples valores
const values = await kv.mget(['key1', 'key2']);

// Eliminar múltiples valores
await kv.mdel(['key1', 'key2']);
```

### Búsqueda por Prefijo:
```typescript
// Obtener todos los valores que empiecen con 'tlahtolli_'
const allData = await kv.getByPrefix('tlahtolli_');
```

---

## 📈 Ventajas del Sistema KV

### ✅ Ventajas:
1. **Simplicidad** - Una sola tabla para todo
2. **Flexibilidad** - Esquema dinámico con JSONB
3. **Rapidez** - Operaciones simples y directas
4. **Prototipado** - Ideal para desarrollo rápido
5. **Sin migraciones** - No necesita cambios de esquema

### ⚠️ Desventajas:
1. **No relacional** - Sin joins ni foreign keys
2. **Escalabilidad limitada** - Para grandes volúmenes de datos
3. **Sin índices** - Búsquedas menos eficientes
4. **Transacciones limitadas** - Todo el array se actualiza
5. **Validación manual** - No hay constraints de base de datos

---

## 🔄 Flujo de Datos

### Leer Productos:
```
1. Cliente → GET /products
2. API → kv.get('tlahtolli_products')
3. Supabase → SELECT value FROM kv_store_80f0f1f5 WHERE key = 'tlahtolli_products'
4. API → return products
5. Cliente ← recibe array de productos
```

### Crear Producto:
```
1. Cliente → POST /products
2. API → kv.get('tlahtolli_products')
3. API → Agregar nuevo producto al array
4. API → kv.set('tlahtolli_products', updatedProducts)
5. Supabase → UPSERT en kv_store_80f0f1f5
6. Cliente ← producto creado
```

### Actualizar Producto:
```
1. Cliente → PUT /products/:id
2. API → kv.get('tlahtolli_products')
3. API → Modificar producto en el array
4. API → kv.set('tlahtolli_products', updatedProducts)
5. Supabase → UPSERT en kv_store_80f0f1f5
6. Cliente ← producto actualizado
```

---

## 💾 Tamaño de Datos Estimado

### Por Key:

| Key | Registros | Tamaño por Registro | Tamaño Total Aprox |
|-----|-----------|---------------------|-------------------|
| `tlahtolli_products` | ~12 | ~500 bytes | ~6 KB |
| `tlahtolli_users` | ~10-100 | ~300 bytes | ~3-30 KB |
| `tlahtolli_password_tokens` | ~1-10 | ~200 bytes | ~0.2-2 KB |

**Total**: < 50 KB (muy pequeño, perfecto para KV store)

---

## 🎯 Recomendaciones

### Para Prototipado (Actual):
✅ **El sistema KV es perfecto** - Rápido, simple, funcional

### Para Producción (Futuro):
Si la app crece, considera migrar a tablas relacionales:

```sql
-- Ejemplo de migración a tablas relacionales
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER NOT NULL,
  -- ... más campos
);

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  -- ... más campos
);

CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  total DECIMAL(10,2) NOT NULL,
  -- ... más campos
);

CREATE TABLE order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT REFERENCES orders(id),
  product_id TEXT REFERENCES products(id),
  quantity INTEGER NOT NULL,
  -- ... más campos
);
```

---

## 📝 Resumen

**Tabla en Supabase**:
- `kv_store_80f0f1f5` - Única tabla con formato key-value

**Keys Usadas**:
- `tlahtolli_products` - Array de productos
- `tlahtolli_users` - Array de usuarios
- `tlahtolli_password_tokens` - Array de tokens de reset

**Ventajas**: Simplicidad, rapidez, flexibilidad  
**Limitaciones**: No relacional, escalabilidad limitada

**Estado**: ✅ Diseño adecuado para el prototipo actual  
**Última actualización**: 2026-02-20
