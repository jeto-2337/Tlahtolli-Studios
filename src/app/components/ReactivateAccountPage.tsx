import React, { useState } from 'react';
import { RefreshCw, Sparkles, Shield, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { validateEmail } from '../utils/validation';

interface ReactivateAccountPageProps {
  onSuccess: () => void;
  onBackToLogin: () => void;
}

export function ReactivateAccountPage({ onSuccess, onBackToLogin }: ReactivateAccountPageProps) {
  const { reactivateAccount } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email) {
      setErrorMessage('Por favor, ingresa tu email');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage('Por favor, ingresa un email válido');
      return;
    }

    setIsLoading(true);

    try {
      const result = await reactivateAccount(email);

      if (result.success) {
        setSuccessMessage(result.message);
        setTimeout(() => {
          onSuccess();
        }, 2000);
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
    <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ backgroundColor: '#F4F0F8' }}>
      <div className="max-w-md w-full space-y-8">
        <button
          onClick={onBackToLogin}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al inicio de sesión
        </button>

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#7B4FA6' }}>
            <RefreshCw className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-gray-900 mb-2">Reactivar Cuenta</h1>
          <p className="text-gray-600 flex items-center justify-center gap-2">
            <span>✦</span>
            Regresa a tu aventura
            <span>✦</span>
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          {successMessage && (
            <div className="mb-6 p-4 rounded-lg flex items-center gap-3" style={{ backgroundColor: '#7B4FA6' }}>
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

          <div className="mb-6 p-4 rounded-lg border" style={{ borderColor: '#73C2FB', backgroundColor: '#F0F9FF' }}>
            <p className="text-sm text-gray-700">
              Si tu cuenta fue desactivada, ingresa tu email registrado para reactivarla 
              y continuar disfrutando de todos los beneficios.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm text-gray-700 mb-2">
                Email registrado
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all"
                style={{ '--tw-ring-color': '#73C2FB' } as React.CSSProperties}
                placeholder="tu@email.com"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-4 rounded-lg text-white transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ backgroundColor: '#7B4FA6' }}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Reactivando...
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  Reactivar cuenta
                </>
              )}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-gray-900 mb-3 text-sm">¿Qué sucede al reactivar?</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <span>✦</span>
              <span>Recuperas acceso completo a tu cuenta</span>
            </li>
            <li className="flex items-center gap-2">
              <span>✦</span>
              <span>Tus datos y pedidos previos se mantienen</span>
            </li>
            <li className="flex items-center gap-2">
              <span>✦</span>
              <span>Puedes continuar comprando inmediatamente</span>
            </li>
          </ul>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            ¿Necesitas ayuda?{' '}
            <button
              className="underline transition-colors"
              style={{ color: '#73C2FB' }}
            >
              Contáctanos
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
