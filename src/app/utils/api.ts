import { projectId, publicAnonKey } from './supabase/info';
import { Product } from '../types';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-80f0f1f5`;

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Helper function to make API calls
async function apiCall<T>(
  endpoint: string,
  method: string = 'GET',
  body?: any
): Promise<ApiResponse<T>> {
  try {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      }
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    // Detectar error 521 o error HTML (no JSON)
    const contentType = response.headers.get('content-type');
    if (!response.ok || !contentType?.includes('application/json')) {
      // Si es HTML, probablemente es un error de Cloudflare/Supabase
      if (contentType?.includes('text/html')) {
        return { 
          error: 'La función de Supabase no está desplegada. Usando modo local.' 
        };
      }
      
      const errorData = await response.json().catch(() => ({}));
      
      // Solo loguear errores de servidor (500+), no errores de validación esperados (400, 401, 403)
      if (response.status >= 500) {
        console.error(`API Error (${method} ${endpoint}):`, errorData);
      }
      
      return { error: errorData.error || `Error ${response.status}: ${response.statusText}` };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    // Error de red - la API no está disponible
    return { 
      error: 'API no disponible. Usando modo local.' 
    };
  }
}

// ========== PRODUCTS API ==========

export const productsApi = {
  // Get all products
  async getAll(): Promise<ApiResponse<Product[]>> {
    const result = await apiCall<{ products: Product[] }>('/products', 'GET');
    if (result.error) {
      return { error: result.error };
    }
    return { data: result.data?.products || [] };
  },

  // Get single product by ID
  async getById(id: string): Promise<ApiResponse<Product>> {
    const result = await apiCall<{ product: Product }>(`/products/${id}`, 'GET');
    if (result.error) {
      return { error: result.error };
    }
    return { data: result.data?.product };
  },

  // Create new product
  async create(product: Omit<Product, 'id'>): Promise<ApiResponse<Product>> {
    const result = await apiCall<{ product: Product; message: string }>('/products', 'POST', product);
    if (result.error) {
      return { error: result.error };
    }
    return { data: result.data?.product };
  },

  // Update existing product
  async update(id: string, product: Partial<Product>): Promise<ApiResponse<Product>> {
    const result = await apiCall<{ product: Product; message: string }>(`/products/${id}`, 'PUT', product);
    if (result.error) {
      return { error: result.error };
    }
    return { data: result.data?.product };
  },

  // Delete product
  async delete(id: string): Promise<ApiResponse<{ message: string }>> {
    return await apiCall<{ message: string }>(`/products/${id}`, 'DELETE');
  },

  // Clear all products (utility)
  async clearAll(): Promise<ApiResponse<{ message: string }>> {
    return await apiCall<{ message: string }>('/products', 'DELETE');
  },

  // Reset to default products (utility)
  async reset(): Promise<ApiResponse<{ products: Product[]; message: string }>> {
    const result = await apiCall<{ products: Product[]; message: string }>('/products/reset', 'POST');
    if (result.error) {
      return { error: result.error };
    }
    return { data: result.data };
  },

  // Validate SKU uniqueness
  async validateSku(sku: string, productId?: string): Promise<ApiResponse<{ isUnique: boolean; message: string }>> {
    const result = await apiCall<{ isUnique: boolean; message: string }>('/products/validate-sku', 'POST', { sku, productId });
    if (result.error) {
      return { error: result.error };
    }
    return { data: result.data };
  }
};

// ========== AUTH API ==========

export const authApi = {
  // Register new user
  async register(userData: {
    firstName: string;
    paternalLastName: string;
    maternalLastName: string;
    email: string;
    password: string;
    rememberMe?: boolean;
  }): Promise<ApiResponse<any>> {
    const result = await apiCall<{ user: any; message: string }>('/auth/register', 'POST', userData);
    if (result.error) {
      return { error: result.error };
    }
    return { data: result.data?.user };
  },

  // Login user
  async login(credentials: {
    email: string;
    password: string;
    rememberMe?: boolean;
  }): Promise<ApiResponse<any>> {
    const result = await apiCall<{ user: any; message: string }>('/auth/login', 'POST', credentials);
    if (result.error) {
      return { error: result.error };
    }
    return { data: result.data?.user };
  },

  // Get user by email
  async getUserByEmail(email: string): Promise<ApiResponse<any>> {
    const result = await apiCall<{ user: any }>(`/auth/user/${encodeURIComponent(email)}`, 'GET');
    if (result.error) {
      return { error: result.error };
    }
    return { data: result.data?.user };
  },

  // Deactivate account
  async deactivate(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<{ message: string }>> {
    return await apiCall<{ message: string }>('/auth/deactivate', 'POST', credentials);
  },

  // Reactivate account
  async reactivate(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<{ message: string }>> {
    return await apiCall<{ message: string }>('/auth/reactivate', 'POST', credentials);
  },

  // Request password reset
  async forgotPassword(email: string): Promise<ApiResponse<{ message: string; token?: string; email?: string }>> {
    const result = await apiCall<{ message: string; token?: string; email?: string }>('/auth/forgot-password', 'POST', { email });
    if (result.error) {
      return { error: result.error };
    }
    return { data: result.data };
  },

  // Validate reset token
  async validateToken(token: string): Promise<ApiResponse<{ valid: boolean; email?: string; error?: string }>> {
    const result = await apiCall<{ valid: boolean; email?: string; error?: string }>('/auth/validate-token', 'POST', { token });
    if (result.error) {
      return { error: result.error };
    }
    return { data: result.data };
  },

  // Reset password
  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    return await apiCall<{ message: string }>('/auth/reset-password', 'POST', { token, newPassword });
  },

  // Get all users (admin)
  async getAllUsers(): Promise<ApiResponse<any[]>> {
    const result = await apiCall<{ users: any[] }>('/users', 'GET');
    if (result.error) {
      return { error: result.error };
    }
    return { data: result.data?.users || [] };
  }
};