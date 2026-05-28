import React, { useState } from 'react';
import { LogIn, Eye, EyeOff, Shield, Sparkles, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginPageProps {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
  onSwitchToReactivate: () => void;
  onSwitchToForgotPassword: () => void;
  onAdminLogin?: () => void;
  onBackToHome?: () => void;
}

export function LoginPage({ onSuccess, onSwitchToRegister, onSwitchToReactivate, onSwitchToForgotPassword, onAdminLogin, onBackToHome }: LoginPageProps) {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.email || !formData.password) {
      setErrorMessage('Por favor, completa todos los campos');
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(
        formData.email,
        formData.password,
        formData.rememberMe
      );

      if (result.success) {
        setSuccessMessage(result.message);
        setTimeout(() => {
          if (result.isAdmin && onAdminLogin) {
            onAdminLogin();
          } else {
            onSuccess();
          }
        }, 1000);
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage('Ocurrió un error. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ backgroundColor: '#FFFDD0' }}>
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#50C878' }}>
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-gray-900 mb-2">Portal de Acceso</h1>
          <p className="text-gray-600 flex items-center justify-center gap-2">
            <span>✦</span>
            Continúa tu aventura
            <span>✦</span>
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          {successMessage && (
            <div className="mb-6 p-4 rounded-lg flex items-center gap-3" style={{ backgroundColor: '#50C878' }}>
              <Sparkles className="w-5 h-5 text-white" />
              <p className="text-white text-sm">{successMessage}</p>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 p-4 rounded-lg flex items-center gap-3" style={{ backgroundColor: '#FF4C4C' }}>
              <Shield className="w-5 h-5 text-white" />
              <p className="text-white text-sm">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all"
                style={{ '--tw-ring-color': '#73C2FB' } as React.CSSProperties}
                placeholder="tu@email.com"
              />
            </div>

            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="block text-sm text-gray-700">
                Contraseña
              </label>
              <button
                type="button"
                onClick={onSwitchToForgotPassword}
                className="text-xs transition-colors hover:underline"
                style={{ color: '#73C2FB' }}
              >
                Recuperar Contraseña
              </button>
            </div>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all pr-12"
                style={{ '--tw-ring-color': '#73C2FB' } as React.CSSProperties}
                placeholder="Tu contraseña"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300"
                  style={{ accentColor: '#73C2FB' }}
                />
                <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
                  Recuérdame
                </label>
              </div>
              {/* Botón de cuenta inactiva eliminado */}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-4 rounded-lg text-white transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ backgroundColor: '#50C878' }}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Accediendo...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Iniciar sesión
                </>
              )}
            </button>
          </form>

          <div className="mt-6 space-y-2 text-center">
            <p className="text-sm text-gray-600">
              ¿Aún no tienes una cuenta?{' '}
              <button
                onClick={onSwitchToRegister}
                className="underline transition-colors"
                style={{ color: '#73C2FB' }}
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        </div>

        <div 
          className="rounded-lg p-6 border"
          style={{ backgroundColor: '#F0F9FF', borderColor: '#73C2FB' }}
        >
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 flex-shrink-0" style={{ color: '#73C2FB' }} />
            <div>
              <h3 className="text-gray-900 text-sm mb-1">Seguridad de tu cuenta</h3>
              <p className="text-xs text-gray-600">
                Tus datos están protegidos con encriptación de nivel empresarial. 
                La opción "Recuérdame" mantiene tu sesión activa de forma segura.
              </p>
            </div>
          </div>
        </div>

        {onBackToHome && (
          <div className="mt-4 text-center">
            <button
              onClick={onBackToHome}
              className="text-sm underline"
              style={{ color: '#73C2FB' }}
            >
              <ArrowLeft className="w-4 h-4 inline-block mr-1" />
              Volver al inicio
            </button>
          </div>
        )}
      </div>
    </div>
  );
}