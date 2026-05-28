# 🛒 Comparación de Modos de Compra

## 📋 Tabla Comparativa

| Característica | 👤 Usuario Invitado | 🔐 Usuario Autenticado |
|---|---|---|
| **Persistencia del Carrito** | localStorage local | localStorage asociado a userId |
| **Clave de Almacenamiento** | `tlahtolli_guest_cart` | `tlahtolli_cart_{userId}` |
| **Sincronización entre dispositivos** | ❌ No | ✅ Sí (mismo navegador) |
| **Historial de pedidos** | ❌ No | ✅ Sí (asociado a cuenta) |
| **Datos guardados** | ❌ No | ✅ Sí (direcciones, preferencias) |
| **Panel de seguimiento** | ❌ No | ✅ Sí (en dashboard) |
| **Proceso de checkout** | 5 pasos | 3 pasos |
| **Requiere cuenta** | ❌ No | ✅ Sí |
| **Velocidad de compra** | ⚡ Rápido | ⚡⚡ Más rápido (datos pre-llenados) |
| **Confirmación de orden** | 📧 Por email | 📧 Email + Panel de usuario |
| **Seguimiento de orden** | 🔍 Con número | 🔍 Número + Dashboard |

---

## 🔄 Flujos de Checkout

### 👤 Flujo Invitado (5 pasos)

```
┌─────────────────────────────────────────────────────────────┐
│  Paso 1: Email                                              │
│  ├─ Ingresar email para confirmación                        │
│  └─ Validación de formato                                   │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  Paso 2: Datos Personales                                   │
│  ├─ Nombre completo (3 campos)                              │
│  ├─ Teléfono                                                │
│  └─ Dirección completa (6 campos)                           │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  Paso 3: Método de Envío                                    │
│  ├─ Estándar (5-7 días) - $99 MXN                           │
│  ├─ Express (2-3 días) - $199 MXN                           │
│  └─ Same Day (mismo día) - $299 MXN                         │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  Paso 4: Información de Pago                                │
│  ├─ Tarjeta de crédito/débito                               │
│  ├─ Nombre en tarjeta                                       │
│  ├─ Fecha de expiración                                     │
│  └─ CVV                                                     │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  Paso 5: Confirmación                                       │
│  ├─ Revisar todos los datos                                 │
│  ├─ Confirmar orden                                         │
│  └─ ✅ Orden completada                                     │
└─────────────────────────────────────────────────────────────┘
                          ↓
           [clearCart() → carrito limpiado]
```

### 🔐 Flujo Usuario Autenticado (3 pasos)

```
┌─────────────────────────────────────────────────────────────┐
│  Paso 1: Información                                        │
│  ├─ Datos pre-llenados desde cuenta                         │
│  ├─ Editar si es necesario                                  │
│  └─ Dirección de envío guardada                             │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  Paso 2: Método de Envío                                    │
│  ├─ Estándar (5-7 días) - $99 MXN                           │
│  ├─ Express (2-3 días) - $199 MXN                           │
│  └─ Same Day (mismo día) - $299 MXN                         │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  Paso 3: Pago                                               │
│  ├─ Tarjeta guardada (opcional)                             │
│  ├─ O nueva tarjeta                                         │
│  └─ ✅ Confirmar y pagar                                    │
└─────────────────────────────────────────────────────────────┘
                          ↓
           [clearCart() → carrito limpiado]
                          ↓
      [Orden guardada en historial de usuario]
```

---

## 🎯 Indicadores Visuales

### Durante el Checkout

#### 🟢 Usuario Autenticado
```
┌─────────────────────────────────────────────────────────────┐
│  🟢 Comprando como usuario registrado                       │
│                                                             │
│  ¡Hola, Juan! Tu orden se asociará a tu cuenta.            │
│                                                             │
│  ● Historial de pedidos guardado                           │
│  ● Seguimiento de órdenes en tu panel                      │
│  ● Datos de envío guardados para futuras compras           │
└─────────────────────────────────────────────────────────────┘
```

#### 🔵 Usuario Invitado
```
┌─────────────────────────────────────────────────────────────┐
│  🔵 Comprando como invitado                                 │
│                                                             │
│  Completarás tu compra sin crear una cuenta.               │
│                                                             │
│  ● Proceso rápido sin registro                             │
│  ● Recibirás confirmación por email                        │
│  ● Puedes rastrear tu orden con el número de seguimiento   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔑 Escenarios Clave

### ✅ Escenario 1: Primera Compra como Invitado

```
Usuario nuevo → Navega tienda → Agrega productos → Checkout
                                                         ↓
                                            [Elige: Comprar como invitado]
                                                         ↓
                                         Completa 5 pasos del checkout
                                                         ↓
                                              Orden confirmada ✅
                                                         ↓
                                        Recibe email con:
                                        - Detalles de la orden
                                        - Número de seguimiento
                                        - Link para rastrear
                                                         ↓
                                          Carrito limpiado
```

### ✅ Escenario 2: Usuario Registrado Compra

```
Usuario logueado → Carrito guardado → Checkout
                                         ↓
                            [Automáticamente modo registrado]
                                         ↓
                        Datos pre-llenados (2 clics menos)
                                         ↓
                              Orden confirmada ✅
                                         ↓
                                Carrito limpiado
                                         ↓
                    Orden aparece en "Mis Pedidos"
                                         ↓
                 Puede rastrear desde dashboard
```

### ✅ Escenario 3: Invitado Compra → Crea Cuenta Después

```
Compra como invitado (Orden #123)
         ↓
Carrito limpiado
         ↓
Regresa al sitio → Agrega más productos
         ↓
Crea cuenta e inicia sesión
         ↓
Carrito actual se sincroniza ✅
         ↓
Nota: Orden #123 NO aparece en historial
(fue hecha como invitado, antes de crear cuenta)
         ↓
Futuras órdenes SÍ aparecerán en historial
```

### ✅ Escenario 4: Usuario Registrado → Logout → Login

```
Usuario logueado compra (Orden #456)
         ↓
Carrito limpiado
         ↓
Cierra sesión
         ↓
Agrega productos como invitado (diferentes)
         ↓
Inicia sesión nuevamente
         ↓
Carrito de invitado se fusiona ✅
         ↓
Ve: Orden #456 en historial
         ↓
Puede comprar los productos actuales
```

---

## 🎮 Recomendaciones para Usuarios

### Para Invitados:

✨ **Pros:**
- ✅ No necesitas crear cuenta
- ✅ Proceso rápido
- ✅ Ideal para compras únicas
- ✅ Recibes confirmación por email

⚠️ **Contras:**
- ❌ No guardas historial
- ❌ No hay dashboard de seguimiento
- ❌ Debes ingresar datos cada vez
- ❌ No hay sincronización entre dispositivos

💡 **Ideal para:**
- Primera compra
- Compras ocasionales
- No quieres registro
- Regalos únicos

### Para Usuarios Registrados:

✨ **Pros:**
- ✅ Historial completo de pedidos
- ✅ Seguimiento en dashboard
- ✅ Datos guardados (checkout más rápido)
- ✅ Carrito sincronizado
- ✅ Notificaciones de ofertas

⚠️ **Contras:**
- ⏱️ Requiere crear cuenta primero

💡 **Ideal para:**
- Compras frecuentes
- Coleccionistas
- Quieres rastrear todo
- Múltiples pedidos

---

## 📊 Métricas de Conversión

### Ventajas del Modo Invitado:
```
Tiempo de checkout: ~3-5 minutos
Campos a llenar: ~15 campos
Tasa de abandono típica: 30-40%
Conversión: Media-Alta
```

### Ventajas del Modo Registrado:
```
Tiempo de checkout (primera vez): ~4-6 minutos (incluye registro)
Tiempo de checkout (subsecuente): ~1-2 minutos (datos guardados)
Campos a llenar (primera vez): ~18 campos
Campos a llenar (subsecuente): ~2 campos
Tasa de abandono típica: 20-25%
Conversión: Alta
Recompra: Muy Alta
```

---

## 🔄 Post-Compra

### 👤 Invitado después de Comprar:

```
✅ Recibe email de confirmación
✅ Puede rastrear con número de orden
❌ No aparece en dashboard (no tiene cuenta)
❌ No recibe notificaciones push
❌ Debe guardar email/número manualmente
```

### 🔐 Usuario Registrado después de Comprar:

```
✅ Recibe email de confirmación
✅ Orden en dashboard "Mis Pedidos"
✅ Rastreo integrado en panel
✅ Notificaciones de estado
✅ Historial permanente
✅ Puede re-ordenar fácilmente
```

---

## 🎯 Resumen Visual

```
┌─────────────────────────────────────────────────────────────┐
│                    MODO DE COMPRA                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  👤 INVITADO              VS          🔐 REGISTRADO         │
│                                                             │
│  📦 Carrito local                    📦 Carrito con userId  │
│  🔍 Rastreo manual                   🔍 Dashboard integrado │
│  ⚡ Rápido (5 pasos)                 ⚡⚡ Más rápido (3)     │
│  📧 Email únicamente                 📧 + Dashboard         │
│  🚫 Sin historial                    ✅ Historial completo  │
│                                                             │
│  ✅ Limpieza después de compra en AMBOS modos              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```
