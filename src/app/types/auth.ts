export interface User {
  id: string;
  firstName: string;
  paternalLastName: string;
  maternalLastName: string;
  email: string;
  password: string;
  createdAt: string;
  isActive: boolean;
  rememberMe?: boolean;
  isAdmin?: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<{ success: boolean; message: string; isAdmin?: boolean }>;
  register: (firstName: string, paternalLastName: string, maternalLastName: string, email: string, password: string, rememberMe: boolean) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  reactivateAccount: (email: string) => Promise<{ success: boolean; message: string }>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  checkSession: () => void;
}

export interface ValidationErrors {
  firstName?: string;
  paternalLastName?: string;
  maternalLastName?: string;
  email?: string;
  password?: string;
}