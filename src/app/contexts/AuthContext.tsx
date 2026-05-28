import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types/auth';
import { validateEmail, validatePassword } from '../utils/validation';
import { authApi } from '../utils/api';

const AuthContext = createContext<AuthState | undefined>(undefined);

const SESSION_KEY = 'tlahtolli_session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Cargar sesión al inicio
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const sessionData = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData);
        
        // Check for admin session (productos)
        if (session.isAdmin && session.email === 'admin457@tonalli.com') {
          const adminUser: User = {
            id: 'admin-457',
            firstName: 'Admin',
            paternalLastName: 'Sistema',
            maternalLastName: 'Tonalli',
            email: 'admin457@tonalli.com',
            password: '123456',
            createdAt: new Date().toISOString(),
            isActive: true,
            rememberMe: true,
            isAdmin: true
          };
          setUser(adminUser);
          return;
        }

        // Check for email admin session (notificaciones)
        if (session.isAdmin && session.email === 'emailadmin@tonalli.com') {
          const emailAdminUser: User = {
            id: 'email-admin-458',
            firstName: 'Admin',
            paternalLastName: 'Notificaciones',
            maternalLastName: 'Tonalli',
            email: 'emailadmin@tonalli.com',
            password: '123456',
            createdAt: new Date().toISOString(),
            isActive: true,
            rememberMe: true,
            isAdmin: true
          };
          setUser(emailAdminUser);
          return;
        }
        
        // Get user from database
        const result = await authApi.getUserByEmail(session.email);
        if (result.data) {
          setUser(result.data);
        } else {
          localStorage.removeItem(SESSION_KEY);
          sessionStorage.removeItem(SESSION_KEY);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        localStorage.removeItem(SESSION_KEY);
        sessionStorage.removeItem(SESSION_KEY);
      }
    }
  };

  const register = async (
    firstName: string,
    paternalLastName: string,
    maternalLastName: string,
    email: string,
    password: string,
    rememberMe: boolean
  ): Promise<{ success: boolean; message: string }> => {
    // Validaciones
    if (!validateEmail(email)) {
      return { success: false, message: 'El email no es válido' };
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return { 
        success: false, 
        message: `Contraseña inválida: ${passwordValidation.errors.join(', ')}` 
      };
    }

    if (firstName.trim().length < 2) {
      return { success: false, message: 'El nombre debe tener al menos 2 caracteres' };
    }

    if (paternalLastName.trim().length < 2) {
      return { success: false, message: 'El apellido paterno debe tener al menos 2 caracteres' };
    }

    if (maternalLastName.trim().length < 2) {
      return { success: false, message: 'El apellido materno debe tener al menos 2 caracteres' };
    }

    // Register user via API
    const result = await authApi.register({
      firstName,
      paternalLastName,
      maternalLastName,
      email,
      password,
      rememberMe
    });

    if (result.error) {
      return { success: false, message: result.error };
    }
    
    // Iniciar sesión automáticamente
    setUser(result.data);
    if (rememberMe) {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ email: result.data.email }));
    } else {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ email: result.data.email }));
    }

    return { success: true, message: '¡Bienvenido a la aventura! Tu cuenta ha sido creada.' };
  };

  const login = async (
    email: string,
    password: string,
    rememberMe: boolean
  ): Promise<{ success: boolean; message: string; isAdmin?: boolean }> => {
    // Verificar credenciales de administrador de productos (hardcoded para demo)
    if (email === 'admin457@tonalli.com' && password === '123456') {
      const adminUser: User = {
        id: 'admin-457',
        firstName: 'Admin',
        paternalLastName: 'Sistema',
        maternalLastName: 'Tonalli',
        email: 'admin457@tonalli.com',
        password: '123456',
        createdAt: new Date().toISOString(),
        isActive: true,
        rememberMe,
        isAdmin: true
      };

      setUser(adminUser);
      
      if (rememberMe) {
        localStorage.setItem(SESSION_KEY, JSON.stringify({ email: adminUser.email, isAdmin: true }));
      } else {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({ email: adminUser.email, isAdmin: true }));
      }

      return { success: true, message: '¡Bienvenido, Administrador!', isAdmin: true };
    }

    // Verificar credenciales de administrador de correos (hardcoded para demo)
    if (email === 'emailadmin@tonalli.com' && password === '123456') {
      const emailAdminUser: User = {
        id: 'email-admin-458',
        firstName: 'Admin',
        paternalLastName: 'Notificaciones',
        maternalLastName: 'Tonalli',
        email: 'emailadmin@tonalli.com',
        password: '123456',
        createdAt: new Date().toISOString(),
        isActive: true,
        rememberMe,
        isAdmin: true
      };

      setUser(emailAdminUser);
      
      if (rememberMe) {
        localStorage.setItem(SESSION_KEY, JSON.stringify({ email: emailAdminUser.email, isAdmin: true }));
      } else {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({ email: emailAdminUser.email, isAdmin: true }));
      }

      return { success: true, message: '¡Bienvenido, Administrador de Notificaciones!', isAdmin: true };
    }

    // Login via API
    const result = await authApi.login({ email, password, rememberMe });

    if (result.error) {
      return { success: false, message: result.error };
    }

    setUser(result.data);
    
    if (rememberMe) {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ email: result.data.email }));
    } else {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ email: result.data.email }));
    }

    return { success: true, message: '¡Bienvenido de nuevo, aventurero!' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  };

  const reactivateAccount = async (
    email: string
  ): Promise<{ success: boolean; message: string }> => {
    // Get user to check if exists and get password
    const result = await authApi.getUserByEmail(email);
    
    if (result.error) {
      return { 
        success: false, 
        message: 'No encontramos una cuenta con este email.' 
      };
    }

    if (result.data.isActive) {
      return { 
        success: false, 
        message: 'Tu cuenta ya está activa. Puedes iniciar sesión normalmente.' 
      };
    }

    // For reactivation, we need the password - this is simplified for the demo
    // In production, you'd want to send an email with a reactivation link
    return {
      success: false,
      message: 'Para reactivar tu cuenta, inicia sesión normalmente con tu email y contraseña.'
    };
  };

  const deactivateAccount = async (
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    if (!user) {
      return { success: false, message: 'No hay sesión activa' };
    }

    const result = await authApi.deactivate({
      email: user.email,
      password
    });

    if (result.error) {
      return { success: false, message: result.error };
    }

    logout();
    return { success: true, message: result.data?.message || 'Cuenta desactivada exitosamente' };
  };

  const requestPasswordReset = async (
    email: string
  ): Promise<{ success: boolean; message: string; token?: string }> => {
    const result = await authApi.forgotPassword(email);

    if (result.error) {
      return { success: false, message: result.error };
    }

    return { 
      success: true, 
      message: result.data?.message || 'Token generado', 
      token: result.data?.token 
    };
  };

  const resetPassword = async (
    token: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return { 
        success: false, 
        message: `Contraseña inválida: ${passwordValidation.errors.join(', ')}` 
      };
    }

    const result = await authApi.resetPassword(token, newPassword);

    if (result.error) {
      return { success: false, message: result.error };
    }

    return { 
      success: true, 
      message: result.data?.message || 'Contraseña restablecida exitosamente' 
    };
  };

  const validateResetToken = async (
    token: string
  ): Promise<{ valid: boolean; email?: string; error?: string }> => {
    const result = await authApi.validateToken(token);

    if (result.error) {
      return { valid: false, error: result.error };
    }

    return result.data || { valid: false };
  };

  const value: AuthState = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    reactivateAccount,
    checkSession,
    requestPasswordReset,
    resetPassword,
    validateResetToken,
    deactivateAccount
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}