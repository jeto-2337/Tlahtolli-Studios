import React, { useState, useEffect } from 'react';
import { KeyRound, Eye, EyeOff, Sparkles, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { validatePassword } from '../utils/validation';
import { authApi } from '../utils/api';

interface ResetPasswordPageProps {
  token: string;
  onSuccess: () => void;
  onTokenExpired: () => void;
}

export function ResetPasswordPage({ token, onSuccess, onTokenExpired }: ResetPasswordPageProps) {
  const { resetPassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [tokenValid, setTokenValid] = useState(true);
  const [isValidatingToken, setIsValidatingToken] = useState(true);

  useEffect(() => {
    // Validar token con el backend
    const validateTokenAsync = async () => {
      console.log('🔍 ResetPasswordPage - Token recibido:', token);
      
      // Verificar que tenemos un token
      if (!token || token === 'demo-token') {
        setTokenValid(false);
        setErrorMessage('El enlace de recuperación no es válido. Por favor, solicita uno nuevo.');
        setIsValidatingToken(false);
        setTimeout(() => {
          onTokenExpired();
        }, 3000);
        return;
      }
      
      setIsValidatingToken(true);
      
      try {
        const result = await authApi.validateToken(token);
        console.log('🔍 ResetPasswordPage - Validación del backend:', result);
        
        if (result.error || !result.data?.valid) {
          setTokenValid(false);
          setErrorMessage(result.data?.error || 'El enlace de recuperación no es válido o ha expirado. Por favor, solicita uno nuevo.');
          setTimeout(() => {
            onTokenExpired();
          }, 3000);
        } else {
          console.log('✅ Token válido para email:', result.data.email);
          setTokenValid(true);
        }
      } catch (error) {
        console.error('❌ Error al validar token:', error);
        setTokenValid(false);
        setErrorMessage('Error al validar el enlace. Por favor, intenta nuevamente.');
        setTimeout(() => {
          onTokenExpired();
        }, 3000);
      } finally {
        setIsValidatingToken(false);
      }
    };

    validateTokenAsync();
  }, [token, onTokenExpired]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!password || !confirmPassword) {
      setErrorMessage('Por favor, completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden');
      return;
    }

    // Validación de seguridad mejorada (sin pasar email ya que no lo tenemos aquí)
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setErrorMessage(passwordValidation.errors.join('. '));
      return;
    }

    setIsLoading(true);

    try {
      const result = await resetPassword(token, password);

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

  const passwordValidation = validatePassword(password);
  const showValidation = password.length > 0;
  
  // Calcular fortaleza para visualización
  const getStrengthColor = () => {
    if (!passwordValidation.strength) return '#9CA3AF';
    switch (passwordValidation.strength) {
      case 'weak': return '#FF4C4C';
      case 'medium': return '#C9A84C';
      case 'strong': return '#7B4FA6';
      default: return '#9CA3AF';
    }
  };
  
  const getStrengthText = () => {
    if (!passwordValidation.strength) return 'Muy débil';
    switch (passwordValidation.strength) {
      case 'weak': return 'Débil';
      case 'medium': return 'Media';
      case 'strong': return 'Fuerte';
      default: return 'Muy débil';
    }
  };

  // Mostrar loading mientras se valida el token
  if (isValidatingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ backgroundColor: '#F4F0F8' }}>
        <div className="max-w-md w-full text-center">
          <div 
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 relative"
            style={{ backgroundColor: '#73C2FB' }}
          >
            <KeyRound className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-gray-900 mb-2">Validando enlace...</h2>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#7B4FA6', animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#73C2FB', animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#C9A84C', animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ backgroundColor: '#F4F0F8' }}>
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div 
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
              style={{ backgroundColor: '#FF4C4C' }}
            >
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="p-4 rounded-lg flex items-center gap-3" style={{ backgroundColor: '#FF4C4C' }}>
              <Shield className="w-5 h-5 text-white" />
              <p className="text-white text-sm">{errorMessage}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ backgroundColor: '#F4F0F8' }}>
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div 
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 relative"
            style={{ backgroundColor: '#7B4FA6' }}
          >
            <KeyRound className="w-8 h-8 text-white" />
            <div 
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#73C2FB' }}
            >
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          </div>
          <h1 className="text-gray-900 mb-2">Crear Nueva Contraseña</h1>
          <p className="text-gray-600 flex items-center justify-center gap-2">
            <span>✦</span>
            Forja una nueva llave mágica
            <span>✦</span>
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          {successMessage && (
            <div className="mb-6 p-4 rounded-lg flex items-center gap-3" style={{ backgroundColor: '#7B4FA6' }}>
              <CheckCircle className="w-5 h-5 text-white" />
              <div className="text-white">
                <p className="text-sm mb-1"><strong>¡Tu acceso ha sido restaurado!</strong></p>
                <p className="text-xs">{successMessage}</p>
              </div>
            </div>
          )}

          {errorMessage && !successMessage && (
            <div className="mb-6 p-4 rounded-lg flex items-center gap-3" style={{ backgroundColor: '#FF4C4C' }}>
              <Shield className="w-5 h-5 text-white" />
              <p className="text-white text-sm">{errorMessage}</p>
            </div>
          )}

          {!successMessage && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm text-gray-700 mb-2">
                  Nueva contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{ '--tw-ring-color': '#73C2FB' } as React.CSSProperties}
                    placeholder="Mínimo 5 caracteres"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {/* Indicador de fortaleza */}
                {showValidation && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">Fortaleza:</span>
                      <span 
                        className="text-xs" 
                        style={{ color: getStrengthColor() }}
                      >
                        {getStrengthText()}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full transition-all duration-300"
                        style={{ 
                          backgroundColor: getStrengthColor(),
                          width: passwordValidation.strength === 'strong' ? '100%' : 
                                 passwordValidation.strength === 'medium' ? '66%' : '33%'
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm text-gray-700 mb-2">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{ '--tw-ring-color': '#73C2FB' } as React.CSSProperties}
                    placeholder="Repite la contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {showValidation && (
                <div className="p-4 rounded-lg border" style={{ borderColor: '#73C2FB', backgroundColor: '#F0F9FF' }}>
                  <p className="text-sm mb-3" style={{ color: '#73C2FB' }}>
                    <strong>Requisitos de contraseña:</strong>
                  </p>
                  <ul className="space-y-2 text-xs">
                    <li className={`flex items-center gap-2 ${password.length >= 5 ? 'text-green-600' : 'text-gray-600'}`}>
                      {password.length >= 5 ? <CheckCircle className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border-2 border-gray-300" />}
                      <span>Mínimo 5 caracteres</span>
                    </li>
                    <li className={`flex items-center gap-2 ${/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-600'}`}>
                      {/[A-Z]/.test(password) ? <CheckCircle className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border-2 border-gray-300" />}
                      <span>Al menos una mayúscula</span>
                    </li>
                    <li className={`flex items-center gap-2 ${/[0-9]/.test(password) ? 'text-green-600' : 'text-gray-600'}`}>
                      {/[0-9]/.test(password) ? <CheckCircle className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border-2 border-gray-300" />}
                      <span>Al menos un número</span>
                    </li>
                    <li className={`flex items-center gap-2 ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? 'text-green-600' : 'text-gray-600'}`}>
                      {/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? <CheckCircle className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border-2 border-gray-300" />}
                      <span>Al menos un carácter especial</span>
                    </li>
                    {confirmPassword && (
                      <li className={`flex items-center gap-2 ${password === confirmPassword ? 'text-green-600' : 'text-red-600'}`}>
                        {password === confirmPassword ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        <span>{password === confirmPassword ? 'Las contraseñas coinciden' : 'Las contraseñas no coinciden'}</span>
                      </li>
                    )}
                  </ul>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !passwordValidation.isValid}
                className="w-full px-6 py-4 rounded-lg text-white transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ backgroundColor: '#7B4FA6' }}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Restaurando acceso...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Confirmar nueva contraseña
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        <div 
          className="rounded-lg p-6 border"
          style={{ backgroundColor: '#F0F9FF', borderColor: '#73C2FB' }}
        >
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 flex-shrink-0" style={{ color: '#73C2FB' }} />
            <div>
              <h3 className="text-gray-900 text-sm mb-1">Protección de Cuenta</h3>
              <p className="text-xs text-gray-600">
                Tu nueva contraseña será encriptada y almacenada de forma segura. 
                Asegúrate de guardarla en un lugar seguro.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}