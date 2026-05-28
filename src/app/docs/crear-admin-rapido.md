# 🔑 Crear Usuario Admin Rápidamente

## 📋 Método 1: Ejecutar en la Consola del Navegador (MÁS RÁPIDO)

Abre la consola del navegador (F12) y copia/pega este código:

```javascript
// 🔑 CREAR ADMIN RÁPIDO
(async function crearAdmin() {
  const admin = {
    firstName: 'Admin',
    paternalLastName: 'Tlahtolli',
    maternalLastName: 'Studio',
    email: 'admin@tlahtolli.com',
    password: 'admin123'
  };
  
  try {
    const response = await fetch(
      'https://hiowfuekyeeixfxdpkyz.supabase.co/functions/v1/make-server-80f0f1f5/auth/create-admin',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhpb3dmdWVreWVlaXhmeGRwa3l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3ODc1ODgsImV4cCI6MjA1NDM2MzU4OH0.NqeeMhQB4XcvV3yTkqOkh1Oy3qewz_pYVpLNFpaDdlo'
        },
        body: JSON.stringify(admin)
      }
    );
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ ADMIN CREADO EXITOSAMENTE!');
      console.log('📧 Email:', admin.email);
      console.log('🔐 Password:', admin.password);
      console.log('👤 Datos:', data.user);
    } else {
      console.error('❌ Error:', data.error);
    }
  } catch (error) {
    console.error('❌ Error de conexión:', error);
    console.log('⚠️ La API no está disponible. Asegúrate de desplegar la función de Supabase.');
  }
})();
```

### 🎯 Personalizar Credenciales

Si quieres usar otras credenciales, modifica estas líneas antes de ejecutar:

```javascript
const admin = {
  firstName: 'TuNombre',           // ← Cambia aquí
  paternalLastName: 'TuApellido',  // ← Cambia aquí
  maternalLastName: 'Materno',     // ← Cambia aquí
  email: 'tu@email.com',           // ← Cambia aquí
  password: 'tuPassword123'        // ← Cambia aquí
};
```

---

## 📋 Método 2: Crear Múltiples Admins

Si necesitas crear varios admins a la vez:

```javascript
// 🔑 CREAR MÚLTIPLES ADMINS
const admins = [
  {
    firstName: 'Admin',
    paternalLastName: 'Principal',
    maternalLastName: 'Studio',
    email: 'admin@tlahtolli.com',
    password: 'admin123'
  },
  {
    firstName: 'Developer',
    paternalLastName: 'Dev',
    maternalLastName: 'Team',
    email: 'dev@tlahtolli.com',
    password: 'dev123'
  }
];

(async function crearMultiplesAdmins() {
  for (const admin of admins) {
    try {
      const response = await fetch(
        'https://hiowfuekyeeixfxdpkyz.supabase.co/functions/v1/make-server-80f0f1f5/auth/create-admin',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhpb3dmdWVreWVlaXhmeGRwa3l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3ODc1ODgsImV4cCI6MjA1NDM2MzU4OH0.NqeeMhQB4XcvV3yTkqOkh1Oy3qewz_pYVpLNFpaDdlo'
          },
          body: JSON.stringify(admin)
        }
      );
      
      const data = await response.json();
      
      if (response.ok) {
        console.log(`✅ Admin creado: ${admin.email} / ${admin.password}`);
      } else {
        console.error(`❌ Error con ${admin.email}:`, data.error);
      }
    } catch (error) {
      console.error(`❌ Error creando ${admin.email}:`, error);
    }
  }
})();
```

---

## 📋 Método 3: Verificar Usuarios Existentes

Para ver todos los usuarios en la base de datos:

```javascript
// 👥 VER TODOS LOS USUARIOS
(async function verUsuarios() {
  try {
    const response = await fetch(
      'https://hiowfuekyeeixfxdpkyz.supabase.co/functions/v1/make-server-80f0f1f5/users',
      {
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhpb3dmdWVreWVlaXhmeGRwa3l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3ODc1ODgsImV4cCI6MjA1NDM2MzU4OH0.NqeeMhQB4XcvV3yTkqOkh1Oy3qewz_pYVpLNFpaDdlo'
        }
      }
    );
    
    const data = await response.json();
    
    console.log('👥 USUARIOS EN LA BASE DE DATOS:');
    console.table(data.users);
    
    const admins = data.users.filter(u => u.isAdmin);
    console.log(`\n🔑 Total de admins: ${admins.length}`);
    console.table(admins);
  } catch (error) {
    console.error('❌ Error:', error);
  }
})();
```

---

## 🎯 Credenciales por Defecto

Si ejecutas el script sin modificaciones, se creará:

| Campo | Valor |
|-------|-------|
| **Email** | `admin@tlahtolli.com` |
| **Password** | `admin123` |
| **Nombre** | Admin Tlahtolli Studio |
| **Rol** | Administrador (isAdmin: true) |

---

## ⚠️ Importante

1. **Guarda las credenciales** - No hay forma de recuperarlas después
2. **API debe estar desplegada** - Si ves error 521, despliega la función de Supabase
3. **Modo Local** - En modo local (localStorage) NO puedes crear usuarios, solo funciona con API

---

## 🔧 Solución de Problemas

### Error: "Este email ya está registrado"
✅ **Solución**: Cambia el email en el código

### Error 521 / "fetch failed"
✅ **Solución**: La API no está desplegada. Despliega la función de Supabase Edge Function

### Error: "La API no está disponible"
✅ **Solución**: Verifica que:
- El projectId es correcto: `hiowfuekyeeixfxdpkyz`
- El publicAnonKey es correcto
- La función Edge está desplegada en Supabase

---

## 📱 Método 4: Usar cURL (Terminal)

Si prefieres usar la terminal:

```bash
curl -X POST \
  https://hiowfuekyeeixfxdpkyz.supabase.co/functions/v1/make-server-80f0f1f5/auth/create-admin \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhpb3dmdWVreWVlaXhmeGRwa3l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3ODc1ODgsImV4cCI6MjA1NDM2MzU4OH0.NqeeMhQB4XcvV3yTkqOkh1Oy3qewz_pYVpLNFpaDdlo' \
  -d '{
    "firstName": "Admin",
    "paternalLastName": "Tlahtolli",
    "maternalLastName": "Studio",
    "email": "admin@tlahtolli.com",
    "password": "admin123"
  }'
```

---

## ✅ Después de Crear el Admin

1. Ve a la página de login: http://localhost:3000 (o tu URL)
2. Inicia sesión con:
   - **Email**: `admin@tlahtolli.com`
   - **Password**: `admin123`
3. Verás el botón "Panel Admin" en el header
4. ¡Listo! 🎉

---

**Última actualización**: 2026-04-09
