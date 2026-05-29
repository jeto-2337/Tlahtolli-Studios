import React, { useState } from 'react';
import { KeyRound, Mail, ArrowLeft, Sparkles, Shield, Clock, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { validateEmail } from '../utils/validation';
import { PasswordResetEmailPreview } from './PasswordResetEmailPreview';
import { sendEmail } from '../utils/emailStorage';

interface ForgotPasswordPageProps {
  onBackToLogin: () => void;
  onSuccess: () => void;
  onResetPassword?: (token: string) => void;
}

export function ForgotPasswordPage({ onBackToLogin, onSuccess, onResetPassword }: ForgotPasswordPageProps) {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [resetToken, setResetToken] = useState('');

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
      const result = await requestPasswordReset(email);

      // El servidor siempre devuelve success: true con el mensaje genérico
      // Solo genera token si el email existe
      if (result.success) {
        setSuccessMessage(
          'Si el correo está registrado en nuestro sistema, recibirás un enlace de recuperación en los próximos minutos. Por favor, revisa tu bandeja de entrada y spam.'
        );
        
        // Solo generar y enviar correo si el servidor devolvió un token (email existe)
        if (result.token) {
          const token = result.token;
          console.log('🔑 Token generado en ForgotPasswordPage:', token);
          setResetToken(token);
          
          // Registrar el correo en el sistema
          await sendEmail(
            'password_reset',
            email,
            'Recupera tu contraseña - Tlahtolli Studio',
            'template-password-reset',
            {
              resetToken: token,
              expiresIn: '5 minutos',
              requestedAt: new Date().toISOString()
            }
          );
        }
      } else {
        // Solo mostrar errores técnicos/de sistema
        setErrorMessage(result.message || 'Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error en recuperación de contraseña:', error);
      setErrorMessage('Ocurrió un error. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
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
            <h1 className="text-gray-900 mb-2">Recuperar Acceso al Reino</h1>
            <p className="text-gray-600 flex items-center justify-center gap-2">
              <span>✦</span>
              Restaura tu vínculo de jugador
              <span>✦</span>
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            {successMessage && (
              <div 
                className="mb-6 p-4 rounded-lg border"
                style={{ backgroundColor: '#F0F9FF', borderColor: '#73C2FB' }}
              >
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 flex-shrink-0" style={{ color: '#73C2FB' }} />
                  <div>
                    <p className="text-sm mb-2" style={{ color: '#73C2FB' }}>
                      <strong>✉️ Correo enviado con éxito</strong>
                    </p>
                    <p className="text-xs text-gray-600">
                      {successMessage}
                    </p>
                    <div className="mt-3 p-2 rounded" style={{ backgroundColor: '#C9A84C' }}>
                      <div className="flex items-center gap-2 text-xs text-gray-700">
                        <Clock className="w-4 h-4" />
                        <span>El enlace expirará en 5 minutos</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 p-4 rounded-lg flex items-center gap-3" style={{ backgroundColor: '#FF4C4C' }}>
                <Shield className="w-5 h-5 text-white" />
                <p className="text-white text-sm">{errorMessage}</p>
              </div>
            )}

            {!successMessage && (
              <>
                <div className="mb-6 p-4 rounded-lg border" style={{ borderColor: '#73C2FB', backgroundColor: '#F0F9FF' }}>
                  <p className="text-sm text-gray-700">
                    Ingresa tu email registrado y te enviaremos un enlace mágico para 
                    recuperar el acceso a tu cuenta.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm text-gray-700 mb-2">
                      Email registrado
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all"
                        style={{ '--tw-ring-color': '#73C2FB' } as React.CSSProperties}
                        placeholder="tu@email.com"
                      />
                      <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
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
                        Enviando llave mágica...
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-5 h-5" />
                        Enviar enlace de recuperación
                      </>
                    )}
                  </button>
                </form>
              </>
            )}

            {successMessage && (
              <div className="space-y-3">
                {resetToken && (
                  <button
                    onClick={() => setIsPreviewOpen(true)}
                    className="w-full px-6 py-3 rounded-lg border-2 transition-all hover:shadow-md flex items-center justify-center gap-2"
                    style={{ borderColor: '#73C2FB', color: '#73C2FB' }}
                  >
                    <Eye className="w-5 h-5" />
                    Ver correo enviado
                  </button>
                )}
                <button
                  onClick={onBackToLogin}
                  className="w-full px-6 py-3 rounded-lg text-white transition-all hover:shadow-md"
                  style={{ backgroundColor: '#7B4FA6' }}
                >
                  Volver al inicio de sesión
                </button>
                <button
                  onClick={() => {
                    setSuccessMessage('');
                    setEmail('');
                    setResetToken('');
                  }}
                  className="w-full px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Enviar otro enlace
                </button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-gray-900 mb-3 text-sm">¿Qué sucede después?</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span>✦</span>
                <span>Recibirás un correo con un enlace único</span>
              </li>
              <li className="flex items-center gap-2">
                <span>✦</span>
                <span>El enlace expira en 5 minutos por seguridad</span>
              </li>
              <li className="flex items-center gap-2">
                <span>✦</span>
                <span>Podrás crear una nueva contraseña segura</span>
              </li>
            </ul>
          </div>

          <div 
            className="rounded-lg p-6 border"
            style={{ backgroundColor: '#F0F9FF', borderColor: '#73C2FB' }}
          >
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 flex-shrink-0" style={{ color: '#73C2FB' }} />
              <div>
                <h3 className="text-gray-900 text-sm mb-1">Protección Mágica Activada</h3>
                <p className="text-xs text-gray-600">
                  Tu cuenta está protegida con encriptación de nivel empresarial. 
                  Solo tú podrás acceder al enlace de recuperación desde tu correo.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              ¿Recordaste tu contraseña?{' '}
              <button
                onClick={onBackToLogin}
                className="underline transition-colors"
                style={{ color: '#73C2FB' }}
              >
                Inicia sesión aquí
              </button>
            </p>
          </div>
        </div>
      </div>

      <PasswordResetEmailPreview
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        email={email}
        resetToken={resetToken}
        onTestLink={() => {
          setIsPreviewOpen(false);
          if (onResetPassword) {
            onResetPassword(resetToken);
          }
        }}
      />
    </>
  );
}