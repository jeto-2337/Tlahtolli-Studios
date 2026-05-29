import React from 'react';
import { X, Mail, KeyRound, Clock, Shield, ExternalLink } from 'lucide-react';

interface PasswordResetEmailPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  resetToken: string;
  onTestLink?: () => void;
}

export function PasswordResetEmailPreview({ 
  isOpen, 
  onClose, 
  email,
  resetToken,
  onTestLink
}: PasswordResetEmailPreviewProps) {
  if (!isOpen) return null;

  const resetLink = `${window.location.origin}/#reset-password?token=${resetToken}`;
  const expirationTime = new Date(Date.now() + 5 * 60 * 1000).toLocaleString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#73C2FB' }}
            >
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-gray-900">Preview del Correo de Recuperación</h2>
              <p className="text-sm text-gray-600">Este correo se enviará a: {email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Email Container */}
          <div className="max-w-xl mx-auto bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* Email Header */}
            <div 
              className="p-6 text-center"
              style={{ 
                background: 'linear-gradient(135deg, #7B4FA6 0%, #73C2FB 100%)'
              }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white mb-4 shadow-lg">
                <KeyRound className="w-8 h-8" style={{ color: '#7B4FA6' }} />
              </div>
              <h1 className="text-white text-2xl mb-2">
                Recuperación de Contraseña
              </h1>
              <p className="text-white text-sm opacity-90">
                Tlahtolli Studio
              </p>
            </div>

            {/* Email Body */}
            <div className="p-6 space-y-4">
              <div>
                <p className="text-gray-900 mb-2">
                  <strong>¡Hola, Aventurero!</strong>
                </p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Recibimos una solicitud para restablecer la contraseña de tu cuenta en <strong>Tlahtolli Studio</strong>.
                </p>
              </div>

              <div 
                className="p-4 rounded-lg border"
                style={{ 
                  backgroundColor: '#F0F9FF',
                  borderColor: '#73C2FB'
                }}
              >
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 flex-shrink-0" style={{ color: '#73C2FB' }} />
                  <div>
                    <p className="text-sm text-gray-900 mb-1">
                      <strong>Enlace temporal</strong>
                    </p>
                    <p className="text-xs text-gray-600">
                      Este enlace expirará en <strong>5 minutos</strong> (a las {expirationTime}) por seguridad.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center py-4">
                <a
                  href={resetLink}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white transition-all hover:shadow-md"
                  style={{ backgroundColor: '#7B4FA6' }}
                >
                  <KeyRound className="w-5 h-5" />
                  Restablecer mi contraseña
                </a>
              </div>

              <div className="text-center">
                <p className="text-xs text-gray-600 mb-2">
                  O copia y pega este enlace en tu navegador:
                </p>
                <div 
                  className="p-3 rounded-lg break-all text-xs font-mono"
                  style={{ backgroundColor: '#F3F4F6' }}
                >
                  {resetLink}
                </div>
              </div>

              <div 
                className="p-4 rounded-lg border"
                style={{ 
                  backgroundColor: '#FFF9E6',
                  borderColor: '#C9A84C'
                }}
              >
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 flex-shrink-0" style={{ color: '#D4AF37' }} />
                  <div>
                    <p className="text-sm text-gray-900 mb-1">
                      <strong>¿No solicitaste este cambio?</strong>
                    </p>
                    <p className="text-xs text-gray-600">
                      Si no solicitaste restablecer tu contraseña, ignora este correo. Tu cuenta permanecerá segura.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <p className="text-xs text-gray-600">
                  <strong>Consejos de seguridad:</strong>
                </p>
                <ul className="text-xs text-gray-600 space-y-1 ml-4">
                  <li>• Usa una contraseña única y segura</li>
                  <li>• Combina letras mayúsculas, minúsculas, números y símbolos</li>
                  <li>• No compartas tu contraseña con nadie</li>
                  <li>• Activa la autenticación de dos factores cuando esté disponible</li>
                </ul>
              </div>
            </div>

            {/* Email Footer */}
            <div 
              className="p-6 text-center border-t"
              style={{ backgroundColor: '#F4F0F8' }}
            >
              <p className="text-xs text-gray-600 mb-2">
                <strong>Tlahtolli Studio</strong> - Mercancía de Videojuegos
              </p>
              <p className="text-xs text-gray-500">
                Este es un correo automático generado por el sistema. Por favor, no respondas a este mensaje.
              </p>
              <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-500">
                <span>✦</span>
                <span>Protegido por encriptación de nivel empresarial</span>
                <span>✦</span>
              </div>
            </div>
          </div>

          {/* Debug Info */}
          <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#F3F4F6' }}>
            <p className="text-xs text-gray-700 mb-2">
              <strong>Información de desarrollo:</strong>
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-600">Email:</span>
                <p className="font-mono text-gray-900">{email}</p>
              </div>
              <div>
                <span className="text-gray-600">Token:</span>
                <p className="font-mono text-gray-900">{resetToken.substring(0, 20)}...</p>
              </div>
              <div>
                <span className="text-gray-600">Expira en:</span>
                <p className="font-mono text-gray-900">5 minutos</p>
              </div>
              <div>
                <span className="text-gray-600">Estado:</span>
                <p className="font-mono" style={{ color: '#7B4FA6' }}>Pendiente de envío</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={() => {
              if (onTestLink) {
                onTestLink();
              } else {
                window.open(resetLink, '_blank');
              }
            }}
            className="flex-1 px-4 py-3 rounded-lg text-white transition-all hover:shadow-md flex items-center justify-center gap-2"
            style={{ backgroundColor: '#73C2FB' }}
          >
            <ExternalLink className="w-4 h-4" />
            Probar enlace de recuperación
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-white transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
