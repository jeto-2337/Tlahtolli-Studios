import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Create Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-80f0f1f5/health", (c) => {
  return c.json({ status: "ok" });
});

// ========== PRODUCTS CRUD ==========

// Get all products
app.get("/make-server-80f0f1f5/products", async (c) => {
  try {
    // First, ensure the products are in the KV store
    const products = await kv.get('tlahtolli_products');
    
    if (!products) {
      // Initialize with default products if none exist
      const defaultProducts = [
        {
          id: '1',
          name: 'Taza del Guardián',
          description: 'Taza de cerámica con diseños místicos del videojuego',
          price: 299,
          image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800',
          category: 'tazas',
          stock: 15,
          rarity: 'común'
        },
        {
          id: '2',
          name: 'Playera Legendaria',
          description: 'Playera 100% algodón con estampado del protagonista',
          price: 449,
          originalPrice: 599,
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
          category: 'playeras',
          stock: 8,
          rarity: 'legendario'
        },
        {
          id: '3',
          name: 'Peluche del Compañero',
          description: 'Peluche suave del personaje secundario favorito',
          price: 599,
          image: 'https://images.unsplash.com/photo-1530325553241-4f6e7690cf36?w=800',
          category: 'peluches',
          stock: 12,
          rarity: 'raro'
        },
        {
          id: '4',
          name: 'Figura Épica del Héroe',
          description: 'Figura coleccionable de edición limitada',
          price: 1299,
          originalPrice: 1599,
          image: 'https://images.unsplash.com/photo-1601814933824-fd0b574dd592?w=800',
          category: 'figuras',
          stock: 5,
          rarity: 'épico'
        }
      ];
      await kv.set('tlahtolli_products', defaultProducts);
      return c.json({ products: defaultProducts });
    }
    
    return c.json({ products });
  } catch (error) {
    console.log('Error fetching products:', error);
    return c.json({ error: 'Error al obtener productos', details: error.message }, 500);
  }
});

// Get single product by ID
app.get("/make-server-80f0f1f5/products/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const products = await kv.get('tlahtolli_products') || [];
    const product = products.find((p: any) => p.id === id);
    
    if (!product) {
      return c.json({ error: 'Producto no encontrado' }, 404);
    }
    
    return c.json({ product });
  } catch (error) {
    console.log('Error fetching product:', error);
    return c.json({ error: 'Error al obtener producto', details: error.message }, 500);
  }
});

// Create new product
app.post("/make-server-80f0f1f5/products", async (c) => {
  try {
    const body = await c.req.json();
    const { sku, name, description, price, originalPrice, image, category, stock, rarity, collection, isAvailable, hasSales } = body;
    
    // Validate required fields
    if (!sku || !name || !price || !category || stock === undefined || !rarity) {
      return c.json({ error: 'Faltan campos requeridos (sku, name, price, category, stock, rarity)' }, 400);
    }
    
    const products = await kv.get('tlahtolli_products') || [];
    
    // Check if SKU already exists
    const skuExists = products.some((p: any) => p.sku === sku);
    if (skuExists) {
      return c.json({ error: `El SKU "${sku}" ya está en uso` }, 400);
    }
    
    // Generate new ID
    const newId = String(Math.max(0, ...products.map((p: any) => parseInt(p.id) || 0)) + 1);
    
    const newProduct = {
      id: newId,
      sku,
      name,
      description: description || '',
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      image: image || 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800',
      category,
      stock: Number(stock),
      rarity,
      collection: collection || '',
      isAvailable: isAvailable !== undefined ? isAvailable : (Number(stock) > 0),
      hasSales: hasSales || false,
      createdAt: new Date().toISOString()
    };
    
    const updatedProducts = [...products, newProduct];
    await kv.set('tlahtolli_products', updatedProducts);
    
    console.log('Product created successfully:', newProduct);
    return c.json({ product: newProduct, message: 'Producto creado exitosamente' }, 201);
  } catch (error) {
    console.log('Error creating product:', error);
    return c.json({ error: 'Error al crear producto', details: error.message }, 500);
  }
});

// Update existing product
app.put("/make-server-80f0f1f5/products/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const products = await kv.get('tlahtolli_products') || [];
    const productIndex = products.findIndex((p: any) => p.id === id);
    
    if (productIndex === -1) {
      return c.json({ error: 'Producto no encontrado' }, 404);
    }
    
    // Update product with new data
    const updatedProduct = {
      ...products[productIndex],
      ...body,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };
    
    products[productIndex] = updatedProduct;
    await kv.set('tlahtolli_products', products);
    
    console.log('Product updated successfully:', updatedProduct);
    return c.json({ product: updatedProduct, message: 'Producto actualizado exitosamente' });
  } catch (error) {
    console.log('Error updating product:', error);
    return c.json({ error: 'Error al actualizar producto', details: error.message }, 500);
  }
});

// Delete product
app.delete("/make-server-80f0f1f5/products/:id", async (c) => {
  try {
    const id = c.req.param('id');
    
    const products = await kv.get('tlahtolli_products') || [];
    const filteredProducts = products.filter((p: any) => p.id !== id);
    
    if (filteredProducts.length === products.length) {
      return c.json({ error: 'Producto no encontrado' }, 404);
    }
    
    await kv.set('tlahtolli_products', filteredProducts);
    
    console.log('Product deleted successfully:', id);
    return c.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.log('Error deleting product:', error);
    return c.json({ error: 'Error al eliminar producto', details: error.message }, 500);
  }
});

// Clear all products (utility endpoint)
app.delete("/make-server-80f0f1f5/products", async (c) => {
  try {
    await kv.set('tlahtolli_products', []);
    console.log('All products cleared');
    return c.json({ message: 'Todos los productos eliminados' });
  } catch (error) {
    console.log('Error clearing products:', error);
    return c.json({ error: 'Error al limpiar productos', details: error.message }, 500);
  }
});

// Reset to default products (utility endpoint)
app.post("/make-server-80f0f1f5/products/reset", async (c) => {
  try {
    const defaultProducts = [
      {
        id: '1',
        name: 'Taza del Guardián',
        description: 'Taza de cerámica con diseños místicos del videojuego',
        price: 299,
        image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800',
        category: 'tazas',
        stock: 15,
        rarity: 'común'
      },
      {
        id: '2',
        name: 'Playera Legendaria',
        description: 'Playera 100% algodón con estampado del protagonista',
        price: 449,
        originalPrice: 599,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
        category: 'playeras',
        stock: 8,
        rarity: 'legendario'
      },
      {
        id: '3',
        name: 'Peluche del Compañero',
        description: 'Peluche suave del personaje secundario favorito',
        price: 599,
        image: 'https://images.unsplash.com/photo-1530325553241-4f6e7690cf36?w=800',
        category: 'peluches',
        stock: 12,
        rarity: 'raro'
      },
      {
        id: '4',
        name: 'Figura Épica del Héroe',
        description: 'Figura coleccionable de edición limitada',
        price: 1299,
        originalPrice: 1599,
        image: 'https://images.unsplash.com/photo-1601814933824-fd0b574dd592?w=800',
        category: 'figuras',
        stock: 5,
        rarity: 'épico'
      }
    ];
    
    await kv.set('tlahtolli_products', defaultProducts);
    console.log('Products reset to defaults');
    return c.json({ products: defaultProducts, message: 'Productos restablecidos a valores predeterminados' });
  } catch (error) {
    console.log('Error resetting products:', error);
    return c.json({ error: 'Error al restablecer productos', details: error.message }, 500);
  }
});

// Validate SKU uniqueness
app.post("/make-server-80f0f1f5/products/validate-sku", async (c) => {
  try {
    const body = await c.req.json();
    const { sku, productId } = body;
    
    if (!sku) {
      return c.json({ error: 'SKU es requerido' }, 400);
    }
    
    const products = await kv.get('tlahtolli_products') || [];
    const skuExists = products.some((p: any) => p.sku === sku && p.id !== productId);
    
    return c.json({ 
      isUnique: !skuExists,
      message: skuExists ? `El SKU "${sku}" ya está en uso` : 'SKU disponible'
    });
  } catch (error) {
    console.log('Error validating SKU:', error);
    return c.json({ error: 'Error al validar SKU', details: error.message }, 500);
  }
});

// ========== USERS CRUD ==========

// Register new user
app.post("/make-server-80f0f1f5/auth/register", async (c) => {
  try {
    const body = await c.req.json();
    const { firstName, paternalLastName, maternalLastName, email, password, rememberMe } = body;
    
    // Validate required fields
    if (!firstName || !paternalLastName || !maternalLastName || !email || !password) {
      return c.json({ error: 'Faltan campos requeridos' }, 400);
    }
    
    // Get existing users
    const users = await kv.get('tlahtolli_users') || [];
    
    // Check if user already exists
    const existingUser = users.find((u: any) => u.email === email);
    if (existingUser) {
      return c.json({ error: 'Este email ya está registrado' }, 400);
    }
    
    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      firstName,
      paternalLastName,
      maternalLastName,
      email,
      password, // En producción real, esto debería estar hasheado con bcrypt
      createdAt: new Date().toISOString(),
      isActive: true,
      rememberMe: rememberMe || false,
      isAdmin: false
    };
    
    const updatedUsers = [...users, newUser];
    await kv.set('tlahtolli_users', updatedUsers);
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    
    console.log('User registered successfully:', email);
    return c.json({ 
      user: userWithoutPassword, 
      message: 'Usuario registrado exitosamente' 
    }, 201);
  } catch (error) {
    console.log('Error registering user:', error);
    return c.json({ error: 'Error al registrar usuario', details: error.message }, 500);
  }
});

// Login user
app.post("/make-server-80f0f1f5/auth/login", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, rememberMe } = body;
    
    if (!email || !password) {
      return c.json({ error: 'Email y contraseña son requeridos' }, 400);
    }
    
    const users = await kv.get('tlahtolli_users') || [];
    
    // Find user by email
    const user = users.find((u: any) => u.email === email);
    
    if (!user) {
      return c.json({ error: 'Email o contraseña incorrectos' }, 401);
    }
    
    // Check if user is active
    if (!user.isActive) {
      return c.json({ error: 'Esta cuenta ha sido desactivada. Por favor, reactívala desde la página de login.' }, 403);
    }
    
    // Verify password (en producción, usar bcrypt.compare)
    if (user.password !== password) {
      return c.json({ error: 'Email o contraseña incorrectos' }, 401);
    }
    
    // Update rememberMe if provided
    if (rememberMe !== undefined) {
      user.rememberMe = rememberMe;
      await kv.set('tlahtolli_users', users);
    }
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    
    console.log('User logged in successfully:', email);
    return c.json({ 
      user: userWithoutPassword, 
      message: 'Login exitoso' 
    });
  } catch (error) {
    console.log('Error logging in user:', error);
    return c.json({ error: 'Error al iniciar sesión', details: error.message }, 500);
  }
});

// Get user by email (for session check)
app.get("/make-server-80f0f1f5/auth/user/:email", async (c) => {
  try {
    const email = c.req.param('email');
    
    const users = await kv.get('tlahtolli_users') || [];
    const user = users.find((u: any) => u.email === email && u.isActive);
    
    if (!user) {
      return c.json({ error: 'Usuario no encontrado' }, 404);
    }
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    
    return c.json({ user: userWithoutPassword });
  } catch (error) {
    console.log('Error fetching user:', error);
    return c.json({ error: 'Error al obtener usuario', details: error.message }, 500);
  }
});

// Deactivate account
app.post("/make-server-80f0f1f5/auth/deactivate", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;
    
    if (!email || !password) {
      return c.json({ error: 'Email y contraseña son requeridos' }, 400);
    }
    
    const users = await kv.get('tlahtolli_users') || [];
    const userIndex = users.findIndex((u: any) => u.email === email);
    
    if (userIndex === -1) {
      return c.json({ error: 'Usuario no encontrado' }, 404);
    }
    
    // Verify password
    if (users[userIndex].password !== password) {
      return c.json({ error: 'Contraseña incorrecta' }, 401);
    }
    
    // Deactivate user
    users[userIndex].isActive = false;
    users[userIndex].deactivatedAt = new Date().toISOString();
    
    await kv.set('tlahtolli_users', users);
    
    console.log('User deactivated:', email);
    return c.json({ message: 'Cuenta desactivada exitosamente' });
  } catch (error) {
    console.log('Error deactivating user:', error);
    return c.json({ error: 'Error al desactivar cuenta', details: error.message }, 500);
  }
});

// Reactivate account
app.post("/make-server-80f0f1f5/auth/reactivate", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;
    
    if (!email || !password) {
      return c.json({ error: 'Email y contraseña son requeridos' }, 400);
    }
    
    const users = await kv.get('tlahtolli_users') || [];
    const userIndex = users.findIndex((u: any) => u.email === email);
    
    if (userIndex === -1) {
      return c.json({ error: 'Usuario no encontrado' }, 404);
    }
    
    // Verify password
    if (users[userIndex].password !== password) {
      return c.json({ error: 'Contraseña incorrecta' }, 401);
    }
    
    // Reactivate user
    users[userIndex].isActive = true;
    users[userIndex].reactivatedAt = new Date().toISOString();
    
    await kv.set('tlahtolli_users', users);
    
    console.log('User reactivated:', email);
    return c.json({ message: 'Cuenta reactivada exitosamente' });
  } catch (error) {
    console.log('Error reactivating user:', error);
    return c.json({ error: 'Error al reactivar cuenta', details: error.message }, 500);
  }
});

// Create password reset token
app.post("/make-server-80f0f1f5/auth/forgot-password", async (c) => {
  try {
    const body = await c.req.json();
    const { email } = body;
    
    if (!email) {
      return c.json({ error: 'Email es requerido' }, 400);
    }
    
    const users = await kv.get('tlahtolli_users') || [];
    const user = users.find((u: any) => u.email === email && u.isActive);
    
    // IMPORTANTE: Siempre devolver respuesta exitosa por seguridad
    // No revelar si el email existe o no
    if (!user) {
      console.log('Password reset requested for non-existent email:', email);
      return c.json({ 
        message: 'Si el email está registrado, recibirás un enlace para restablecer tu contraseña'
      }, 200);
    }
    
    // Generate reset token
    const token = `reset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const tokenExpiry = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutos
    
    // Store reset token
    const tokens = await kv.get('tlahtolli_password_tokens') || [];
    tokens.push({
      email,
      token,
      expiresAt: tokenExpiry,
      createdAt: new Date().toISOString(),
      used: false
    });
    
    await kv.set('tlahtolli_password_tokens', tokens);
    
    console.log('Password reset token created for:', email, 'Token:', token);
    return c.json({ 
      message: 'Token de restablecimiento creado',
      token, // En producción, esto se enviaría por email
      email
    }, 200);
  } catch (error) {
    console.log('Error creating reset token:', error);
    return c.json({ error: 'Error al crear token de recuperación', details: error.message }, 500);
  }
});

// Validate reset token
app.post("/make-server-80f0f1f5/auth/validate-token", async (c) => {
  try {
    const body = await c.req.json();
    const { token } = body;
    
    if (!token) {
      return c.json({ valid: false, error: 'Token es requerido' }, 200);
    }
    
    const tokens = await kv.get('tlahtolli_password_tokens') || [];
    const resetToken = tokens.find((t: any) => t.token === token && !t.used);
    
    if (!resetToken) {
      return c.json({ valid: false, error: 'Token inválido' }, 200);
    }
    
    // Check if token is expired
    if (new Date(resetToken.expiresAt) < new Date()) {
      return c.json({ valid: false, error: 'Token expirado' }, 200);
    }
    
    return c.json({ valid: true, email: resetToken.email }, 200);
  } catch (error) {
    console.log('Error validating token:', error);
    return c.json({ valid: false, error: 'Error al validar token' }, 200);
  }
});

// Reset password
app.post("/make-server-80f0f1f5/auth/reset-password", async (c) => {
  try {
    const body = await c.req.json();
    const { token, newPassword } = body;
    
    if (!token || !newPassword) {
      return c.json({ error: 'Token y nueva contraseña son requeridos' }, 400);
    }
    
    // Validate token
    const tokens = await kv.get('tlahtolli_password_tokens') || [];
    const resetToken = tokens.find((t: any) => t.token === token && !t.used);
    
    if (!resetToken) {
      return c.json({ error: 'Token inválido' }, 400);
    }
    
    if (new Date(resetToken.expiresAt) < new Date()) {
      return c.json({ error: 'Token expirado' }, 400);
    }
    
    // Update password
    const users = await kv.get('tlahtolli_users') || [];
    const userIndex = users.findIndex((u: any) => u.email === resetToken.email);
    
    if (userIndex === -1) {
      return c.json({ error: 'Usuario no encontrado' }, 404);
    }
    
    users[userIndex].password = newPassword;
    users[userIndex].passwordUpdatedAt = new Date().toISOString();
    
    // Mark token as used
    resetToken.used = true;
    resetToken.usedAt = new Date().toISOString();
    
    await kv.set('tlahtolli_users', users);
    await kv.set('tlahtolli_password_tokens', tokens);
    
    console.log('Password reset successfully for:', resetToken.email);
    return c.json({ message: 'Contraseña restablecida exitosamente' });
  } catch (error) {
    console.log('Error resetting password:', error);
    return c.json({ error: 'Error al restablecer contraseña', details: error.message }, 500);
  }
});

// Get all users (admin only - simple version sin auth real)
app.get("/make-server-80f0f1f5/users", async (c) => {
  try {
    const users = await kv.get('tlahtolli_users') || [];
    
    // Return users without passwords
    const usersWithoutPasswords = users.map((u: any) => {
      const { password, ...userWithoutPassword } = u;
      return userWithoutPassword;
    });
    
    return c.json({ users: usersWithoutPasswords });
  } catch (error) {
    console.log('Error fetching users:', error);
    return c.json({ error: 'Error al obtener usuarios', details: error.message }, 500);
  }
});

// Create admin user (special endpoint)
app.post("/make-server-80f0f1f5/auth/create-admin", async (c) => {
  try {
    const body = await c.req.json();
    const { firstName, paternalLastName, maternalLastName, email, password } = body;
    
    // Validate required fields
    if (!firstName || !paternalLastName || !maternalLastName || !email || !password) {
      return c.json({ error: 'Faltan campos requeridos' }, 400);
    }
    
    // Get existing users
    const users = await kv.get('tlahtolli_users') || [];
    
    // Check if user already exists
    const existingUser = users.find((u: any) => u.email === email);
    if (existingUser) {
      return c.json({ error: 'Este email ya está registrado' }, 400);
    }
    
    // Create new ADMIN user
    const newAdmin = {
      id: `user-${Date.now()}`,
      firstName,
      paternalLastName,
      maternalLastName,
      email,
      password, // En producción real, esto debería estar hasheado con bcrypt
      createdAt: new Date().toISOString(),
      isActive: true,
      rememberMe: true,
      isAdmin: true // 🔑 ADMIN USER
    };
    
    const updatedUsers = [...users, newAdmin];
    await kv.set('tlahtolli_users', updatedUsers);
    
    // Return user without password
    const { password: _, ...adminWithoutPassword } = newAdmin;
    
    console.log('Admin user created successfully:', email);
    return c.json({ 
      user: adminWithoutPassword, 
      message: 'Usuario administrador creado exitosamente' 
    }, 201);
  } catch (error) {
    console.log('Error creating admin:', error);
    return c.json({ error: 'Error al crear administrador', details: error.message }, 500);
  }
});

Deno.serve(app.fetch);