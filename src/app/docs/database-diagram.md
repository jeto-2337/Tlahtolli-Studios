# 📊 Diagrama de Base de Datos - Tlahtolli Studio

## 🗄️ Estructura Visual

```
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE DATABASE                        │
│                 Project: hiowfuekyeeixfxdpkyz              │
└─────────────────────────────────────────────────────────────┘
                              │
                              │
                              ▼
         ┌────────────────────────────────────────┐
         │      Tabla: kv_store_80f0f1f5         │
         ├────────────────────────────────────────┤
         │  key (TEXT, PRIMARY KEY)               │
         │  value (JSONB)                         │
         └────────────────────────────────────────┘
                              │
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────────┐
│ KEY: PRODUCTS│    │  KEY: USERS  │    │ KEY: PW_TOKENS   │
└──────────────┘    └──────────────┘    └──────────────────┘
        │                   │                     │
        │                   │                     │
        ▼                   ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────────┐
│  VALUE:      │    │  VALUE:      │    │  VALUE:          │
│  Array JSON  │    │  Array JSON  │    │  Array JSON      │
└──────────────┘    └──────────────┘    └──────────────────┘
```

---

## 🔑 Keys y Valores

### 1. `tlahtolli_products`

```
┌─────────────────────────────────────────────────────────┐
│ KEY: "tlahtolli_products"                               │
├─────────────────────────────────────────────────────────┤
│ VALUE: [                                                │
│   {                                                     │
│     "id": "1",                    ┌─────────────────┐   │
│     "sku": "mug-001",            │  Producto 1     │   │
│     "name": "Taza...",           │  Épico          │   │
│     "price": 299,                │  Stock: 15      │   │
│     "stock": 15,                 └─────────────────┘   │
│     "rarity": "Épico",                                  │
│     "category": "taza",                                 │
│     ...                                                 │
│   },                                                    │
│   {                                                     │
│     "id": "2",                    ┌─────────────────┐   │
│     "sku": "shirt-001",          │  Producto 2     │   │
│     "name": "Playera...",        │  Legendario     │   │
│     "price": 499,                │  Stock: 8       │   │
│     "stock": 8,                  └─────────────────┘   │
│     "rarity": "Legendario",                             │
│     ...                                                 │
│   },                                                    │
│   ...  (hasta 12 productos)                            │
│ ]                                                       │
└─────────────────────────────────────────────────────────┘
```

### 2. `tlahtolli_users`

```
┌─────────────────────────────────────────────────────────┐
│ KEY: "tlahtolli_users"                                  │
├─────────────────────────────────────────────────────────┤
│ VALUE: [                                                │
│   {                                                     │
│     "id": "user-1645...",        ┌─────────────────┐   │
│     "firstName": "Juan",        │  Usuario 1      │   │
│     "email": "juan@...",        │  Admin: No      │   │
│     "password": "...",          │  Activo: Sí     │   │
│     "isAdmin": false,           └─────────────────┘   │
│     "isActive": true,                                   │
│     ...                                                 │
│   },                                                    │
│   {                                                     │
│     "id": "user-1646...",        ┌─────────────────┐   │
│     "firstName": "María",       │  Usuario 2      │   │
│     "email": "maria@...",       │  Admin: Sí      │   │
│     "isAdmin": true,            │  Activo: Sí     │   │
│     ...                          └─────────────────┘   │
│   },                                                    │
│   ...                                                   │
│ ]                                                       │
└─────────────────────────────────────────────────────────┘
```

### 3. `tlahtolli_password_tokens`

```
┌─────────────────────────────────────────────────────────┐
│ KEY: "tlahtolli_password_tokens"                        │
├─────────────────────────────────────────────────────────┤
│ VALUE: [                                                │
│   {                                                     │
│     "email": "juan@...",         ┌─────────────────┐   │
│     "token": "reset-...",       │  Token 1        │   │
│     "expiresAt": "2026...",     │  Válido: 5min   │   │
│     "used": false,              │  Usado: No      │   │
│     ...                          └─────────────────┘   │
│   },                                                    │
│   ...                                                   │
│ ]                                                       │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Flujo de Operaciones CRUD

### 📖 READ (Obtener Productos)

```
┌──────────┐         ┌──────────┐         ┌──────────┐
│          │  GET    │          │  SELECT │          │
│ Cliente  │────────▶│   API    │────────▶│ Supabase │
│          │         │          │         │          │
│          │◀────────│          │◀────────│          │
│          │ Products│          │  value  │          │
└──────────┘         └──────────┘         └──────────┘

SQL Ejecutado:
SELECT value 
FROM kv_store_80f0f1f5 
WHERE key = 'tlahtolli_products'
```

### ✏️ CREATE (Crear Producto)

```
┌──────────┐         ┌──────────┐         ┌──────────┐
│          │  POST   │          │  1. GET │          │
│ Cliente  │────────▶│   API    │────────▶│ Supabase │
│          │  {new}  │          │         │          │
│          │         │    ▼     │         │          │
│          │         │ Add to   │         │          │
│          │         │  array   │         │          │
│          │         │    ▼     │  2. SET │          │
│          │         │   API    │────────▶│ Supabase │
│          │◀────────│          │◀────────│          │
│          │ Created │          │ Updated │          │
└──────────┘         └──────────┘         └──────────┘

SQL Ejecutado:
1. SELECT value WHERE key = 'tlahtolli_products'
2. UPSERT (key, value) VALUES ('tlahtolli_products', [..., newProduct])
```

### 🔄 UPDATE (Actualizar Producto)

```
┌──────────┐         ┌──────────┐         ┌──────────┐
│          │  PUT    │          │  1. GET │          │
│ Cliente  │────────▶│   API    │────────▶│ Supabase │
│          │ /prod/2 │          │         │          │
│          │  {data} │    ▼     │         │          │
│          │         │ Find &   │         │          │
│          │         │ Update   │         │          │
│          │         │  in array│         │          │
│          │         │    ▼     │  2. SET │          │
│          │         │   API    │────────▶│ Supabase │
│          │◀────────│          │◀────────│          │
│          │ Updated │          │ Saved   │          │
└──────────┘         └──────────┘         └──────────┘
```

### ❌ DELETE (Eliminar Producto)

```
┌──────────┐         ┌──────────┐         ┌──────────┐
│          │ DELETE  │          │  1. GET │          │
│ Cliente  │────────▶│   API    │────────▶│ Supabase │
│          │ /prod/2 │          │         │          │
│          │         │    ▼     │         │          │
│          │         │ Remove   │         │          │
│          │         │ from     │         │          │
│          │         │  array   │         │          │
│          │         │    ▼     │  2. SET │          │
│          │         │   API    │────────▶│ Supabase │
│          │◀────────│          │◀────────│          │
│          │ Deleted │          │ Saved   │          │
└──────────┘         └──────────┘         └──────────┘
```

---

## 📊 Relaciones Lógicas (No Físicas)

```
┌─────────────────┐
│     USUARIO     │
│  id: user-123   │
└────────┬────────┘
         │
         │ 1:N (lógico, no FK)
         │
         ▼
┌─────────────────┐
│     CARRITO     │
│  (localStorage) │
│  userId: user-  │
│    123          │
└────────┬────────┘
         │
         │ N:M (lógico, no FK)
         │
         ▼
┌─────────────────┐
│   PRODUCTOS     │
│  id: prod-456   │
└─────────────────┘

┌─────────────────┐
│     USUARIO     │
│  id: user-123   │
└────────┬────────┘
         │
         │ 1:N (lógico)
         │
         ▼
┌─────────────────┐
│  PASSWORD       │
│   TOKENS        │
│  email: user@   │
└─────────────────┘
```

**Nota**: No hay Foreign Keys reales. Las relaciones se manejan mediante lógica de aplicación.

---

## 💾 Ejemplo Real de Datos en la Tabla

```sql
-- Así se vería la tabla kv_store_80f0f1f5 en Supabase:

┌──────────────────────────┬────────────────────────────────┐
│          key             │            value               │
├──────────────────────────┼────────────────────────────────┤
│ tlahtolli_products       │ [{id: "1", name: "Taza...",... │
│                          │   }, {id: "2", ...}, ...]      │
├──────────────────────────┼────────────────────────────────┤
│ tlahtolli_users          │ [{id: "user-123", email: "...", │
│                          │   }, {id: "user-456", ...}]    │
├──────────────────────────┼────────────────────────────────┤
│ tlahtolli_password_tokens│ [{email: "juan@...", token:... │
│                          │   }]                           │
└──────────────────────────┴────────────────────────────────┘
```

---

## 🎯 Comparación con Sistema Relacional

### Sistema Actual (KV Store):
```
UNA tabla → Múltiples keys → Arrays de objetos
✅ Simple
✅ Rápido para prototipos
⚠️ No escalable para millones de registros
```

### Sistema Relacional Tradicional:
```
MÚLTIPLES tablas → Relaciones con FK → Filas individuales
✅ Escalable
✅ Integridad referencial
⚠️ Más complejo de configurar
```

---

## 📈 Capacidades del Sistema Actual

| Aspecto | Capacidad | Notas |
|---------|-----------|-------|
| **Productos** | ~1,000 | Óptimo para 10-100 |
| **Usuarios** | ~10,000 | Óptimo para 100-1,000 |
| **Tokens** | ~100 | Se limpian automáticamente |
| **Tamaño total** | < 1 MB | Muy pequeño |
| **Latencia** | < 100ms | Excelente para prototipo |

---

## ✨ Resumen Visual

```
              🎮 TLAHTOLLI STUDIO
                      │
                      ▼
         ┌────────────────────────┐
         │   Supabase Database    │
         │  (1 tabla KV Store)    │
         └────────────────────────┘
                      │
         ┌────────────┼────────────┐
         │            │            │
         ▼            ▼            ▼
    📦 Products   👥 Users    🔑 Tokens
    (Array)       (Array)     (Array)
        │             │            │
        ▼             ▼            ▼
    12 items     0-100 items   0-10 items
    ~6 KB        ~3-30 KB      ~0.2-2 KB
```

**Total**: 1 tabla, 3 keys, < 50 KB de datos

---

**Última actualización**: 2026-02-20  
**Project**: hiowfuekyeeixfxdpkyz
