# 🛒 Sistema de Persistencia del Carrito

## Resumen

El carrito de compras de **Tlahtolli Studio** se mantiene entre sesiones usando **localStorage** para todos los usuarios (invitados y autenticados). Cuando un usuario inicia sesión, su carrito de invitado se sincroniza automáticamente con su carrito de usuario.

---

## 📋 Características

### ✅ Para Usuarios Invitados
- ✨ Carrito guardado automáticamente en **localStorage**
- 🔄 Persiste entre sesiones del navegador
- 🔒 Almacenamiento local en el dispositivo
- ⚡ Actualización instantánea sin servidor

### ✅ Para Usuarios Autenticados
- 👤 Carrito asociado al **userId**
- 🔄 Persistencia entre dispositivos (mismo navegador)
- 📦 Sincronización automática al iniciar sesión
- 🔗 Fusión inteligente de carritos

### ✅ Sincronización al Login
- 🔀 Fusiona carrito de invitado + carrito de usuario
- ➕ Suma cantidades de productos duplicados
- 🧹 Limpia carrito de invitado después de sincronizar
- ✨ Transición fluida sin pérdida de datos

---

## 🏗️ Arquitectura

### Archivos Principales

```
/hooks/useCartPersistence.ts     → Hook principal de persistencia
/components/CartSyncIndicator.tsx → Indicador visual de guardado
/components/CartPersistenceInfo.tsx → Info para el usuario
/App.tsx → Integración del hook
```

### Claves de LocalStorage

```typescript
// Invitados
'tlahtolli_guest_cart'

// Usuarios autenticados
'tlahtolli_cart_{userId}'
```

---

## 🔧 Implementación Técnica

### Hook: `useCartPersistence`

```typescript
useCartPersistence(
  cartItems: CartItem[],
  setCartItems: (items: CartItem[]) => void,
  userId: string | null
)
```

**Funcionalidades:**
- ✅ Carga automática al montar el componente
- ✅ Guardado automático cuando cambian los items
- ✅ Sincronización al cambiar de usuario
- ✅ Fusión de carritos al login

### Estructura de Datos

```typescript
interface StoredCart {
  items: CartItem[];
  lastUpdated: string;
  userId?: string;
}
```

---

## 📊 Flujos de Usuario

### 1️⃣ Usuario Invitado Navega

```
1. Usuario agrega productos al carrito
2. Hook detecta cambio en cartItems
3. Guarda en localStorage con clave 'tlahtolli_guest_cart'
4. Muestra indicador "Carrito guardado localmente"
```

### 2️⃣ Invitado Cierra y Vuelve

```
1. Usuario regresa al sitio
2. Hook carga carrito desde 'tlahtolli_guest_cart'
3. setCartItems() restaura el estado
4. Carrito aparece completo
```

### 3️⃣ Invitado Inicia Sesión

```
1. Usuario hace login → userId disponible
2. Hook detecta cambio de userId (null → user.id)
3. Carga carrito de usuario: 'tlahtolli_cart_{userId}'
4. Carga carrito de invitado: 'tlahtolli_guest_cart'
5. Ejecuta mergeGuestCart():
   - Producto nuevo → agregar
   - Producto duplicado → sumar cantidades
6. Guarda carrito fusionado en 'tlahtolli_cart_{userId}'
7. Elimina 'tlahtolli_guest_cart'
8. Usuario ve todos sus productos
```

### 4️⃣ Usuario Autenticado Navega

```
1. Usuario logueado agrega productos
2. Hook guarda en 'tlahtolli_cart_{userId}'
3. Muestra indicador "Carrito guardado"
4. Carrito específico de su cuenta
```

### 5️⃣ Usuario Cierra Sesión

```
1. Usuario hace logout → userId = null
2. Hook carga 'tlahtolli_guest_cart' (vacío)
3. Carrito de usuario permanece en localStorage
4. Al volver a iniciar sesión, recupera su carrito
```

### 6️⃣ Completar Compra

```
1. Usuario completa orden
2. Llamada a clearCart()
3. Elimina localStorage correspondiente
4. setCartItems([]) limpia el estado
```

### 7️⃣ Compra como Usuario Autenticado

```
ANTES DE LA COMPRA:
- Carrito guardado en 'tlahtolli_cart_{userId}'
- Productos: [Taza A, Playera B, Peluche C]

DURANTE CHECKOUT:
- CheckoutModeIndicator muestra: "Comprando como usuario registrado"
- Ventajas mostradas:
  ✓ Historial de pedidos guardado
  ✓ Seguimiento en panel de usuario
  ✓ Datos guardados para futuras compras

DESPUÉS DE CONFIRMAR ORDEN:
- clearCart() ejecutado
- 'tlahtolli_cart_{userId}' eliminado
- Carrito vacío ✅

PRÓXIMA SESIÓN:
- Usuario inicia sesión
- Hook carga 'tlahtolli_cart_{userId}' (no existe)
- Carrito inicia vacío ✅
- Al agregar productos → se asocian a userId ✅
```

### 8️⃣ Compra como Invitado

```
ANTES DE LA COMPRA:
- Carrito guardado en 'tlahtolli_guest_cart'
- Productos: [Taza A, Playera B]

DURANTE CHECKOUT:
- CheckoutModeIndicator muestra: "Comprando como invitado"
- Ventajas mostradas:
  ✓ Proceso rápido sin registro
  ✓ Confirmación por email
  ✓ Rastreo con número de seguimiento

DESPUÉS DE CONFIRMAR ORDEN:
- clearCart() ejecutado
- 'tlahtolli_guest_cart' eliminado
- Carrito vacío ✅

PRÓXIMA SESIÓN:
- Usuario regresa al sitio
- Hook carga 'tlahtolli_guest_cart' (no existe)
- Carrito inicia vacío ✅
- Puede comprar nuevamente como invitado ✅
```

### 9️⃣ Invitado Compra → Luego Inicia Sesión

```
ESCENARIO:
1. Usuario invitado compra (carrito limpiado)
2. Cierra el navegador
3. Regresa y agrega productos como invitado
4. Decide crear cuenta e iniciar sesión

RESULTADO:
- Carrito de invitado actual se fusiona con carrito de usuario (vacío)
- Usuario ve sus productos actuales
- Puede continuar comprando como usuario autenticado ✅
```

---

## 🎨 Componentes Visuales

### CartSyncIndicator

**Ubicación:** Esquina inferior derecha
**Duración:** 2 segundos
**Estados:**
- 💾 **Invitado:** "Carrito guardado localmente" + icono Save
- ☁️ **Usuario:** "Carrito guardado" + icono Cloud

### CartPersistenceInfo

**Ubicación:** Página del carrito (arriba de los items)
**Propósito:** Educar al usuario sobre la persistencia

**Mensaje para invitados:**
```
Tu carrito se guarda localmente en este navegador.
💡 Consejo: Si inicias sesión, tu carrito se sincronizará 
con tu cuenta y estará disponible en cualquier dispositivo.
```

**Mensaje para usuarios:**
```
Como aventurero registrado, tu carrito se guarda 
automáticamente en tu cuenta.
Puedes cerrar sesión y volver en cualquier momento - 
tus tesoros estarán esperándote.
```

### CheckoutModeIndicator

**Ubicación:** Checkout (paso 1 - primer paso)
**Propósito:** Mostrar claramente el modo de compra y sus beneficios

**Modo Usuario Autenticado (verde esmeralda):**
```
🟢 Comprando como usuario registrado
¡Hola, [Nombre]! Tu orden se asociará a tu cuenta.

Beneficios:
✓ Historial de pedidos guardado
✓ Seguimiento de órdenes en tu panel
✓ Datos de envío guardados para futuras compras
```

**Modo Invitado (azul maya):**
```
🔵 Comprando como invitado
Completarás tu compra sin crear una cuenta.

Beneficios:
✓ Proceso rápido sin registro
✓ Recibirás confirmación por email
✓ Puedes rastrear tu orden con el número de seguimiento
```

---

## 🔐 Seguridad y Privacidad

### ✅ Datos Almacenados
- ID de productos
- Cantidades
- Timestamp de actualización
- userId (si aplica)

### ❌ Datos NO Almacenados
- Información personal (PII)
- Datos de pago
- Direcciones
- Credenciales

### 🛡️ Consideraciones
- LocalStorage es accesible solo por el dominio
- Límite ~5-10MB por dominio (suficiente)
- No expira automáticamente
- Usuario puede limpiar manualmente

---

## 📈 Métricas y Validaciones

### Stock en Tiempo Real

```typescript
// Al cargar carrito desde localStorage
cartItems.forEach(item => {
  const stockCheck = checkStock(item.id, item.quantity);
  if (!stockCheck.available) {
    // Ajustar cantidad o notificar
  }
});
```

### Validación al Agregar

```typescript
// En handleAddToCart
const existingItem = cartItems.find(item => item.id === product.id);
const currentQty = existingItem ? existingItem.quantity : 0;
const totalQty = currentQty + quantity;

const stockCheck = checkStock(product.id, totalQty);
if (!stockCheck.available) {
  showToast(stockCheck.message);
  return; // No agregar
}
```

---

## 🧪 Casos de Prueba

### ✅ Caso 1: Invitado Básico
```
1. Abrir sitio (sin login)
2. Agregar 3 productos
3. Cerrar navegador
4. Volver a abrir sitio
✓ Carrito debe tener 3 productos
```

### ✅ Caso 2: Login con Carrito Vacío
```
1. Usuario invitado agrega 2 productos
2. Iniciar sesión (carrito de usuario vacío)
3. Verificar carrito
✓ Debe tener 2 productos del invitado
```

### ✅ Caso 3: Login con Productos Duplicados
```
Estado inicial:
- Invitado: Producto A (qty: 3)
- Usuario: Producto A (qty: 2)

Después de login:
✓ Producto A (qty: 5)
```

### ✅ Caso 4: Login con Productos Diferentes
```
Estado inicial:
- Invitado: Producto A, B
- Usuario: Producto C, D

Después de login:
✓ Carrito con: A, B, C, D
```

### ✅ Caso 5: Logout y Re-login
```
1. Usuario logueado con 3 productos
2. Hacer logout
3. Volver a iniciar sesión
✓ Carrito debe mantener 3 productos
```

### ✅ Caso 6: Stock Insuficiente
```
1. Carrito guardado tiene Producto A (qty: 10)
2. Stock actualizado: Producto A = 5
3. Cargar carrito
✓ Mostrar alerta de stock insuficiente
✓ Ajustar cantidad o notificar
```

---

## 🚀 Mejoras Futuras (Con Supabase)

Si en el futuro se conecta Supabase:

### Base de Datos
```sql
CREATE TABLE cart_items (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  product_id VARCHAR NOT NULL,
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Sincronización Cloud
```typescript
// Guardar en Supabase + localStorage
await supabase
  .from('cart_items')
  .upsert({ user_id, product_id, quantity });

localStorage.setItem(key, JSON.stringify(cart));
```

### Sincronización Multi-Dispositivo
```typescript
// Real-time subscription
supabase
  .channel('cart_changes')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'cart_items' },
    (payload) => syncCart(payload)
  )
  .subscribe();
```

---

## 📚 Referencias

### Archivos Relacionados
- `/hooks/useCartPersistence.ts`
- `/components/CartSyncIndicator.tsx`
- `/components/CartPersistenceInfo.tsx`
- `/components/StockManager.tsx`
- `/App.tsx`

### Dependencias
- React Hooks (useState, useEffect, useCallback)
- AuthContext (useAuth)
- LocalStorage API

---

## 🎯 Resumen Ejecutivo

✅ **Implementado:**
- Persistencia automática con localStorage
- Sincronización al login
- Fusión inteligente de carritos
- Indicadores visuales
- Validación de stock

🎮 **Narrativa del Juego:**
- "Bolsa de Tesoros" → Carrito
- "Inventario de Batalla" → Página del carrito
- "Aventurero registrado" → Usuario autenticado
- Mensajes contextualizados con temática RPG

💪 **Beneficios:**
- ✅ Experiencia fluida sin pérdida de datos
- ✅ Sin necesidad de backend (por ahora)
- ✅ Rápido y eficiente
- ✅ Fácil de mantener