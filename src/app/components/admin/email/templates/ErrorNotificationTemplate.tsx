import React from 'react';
import { AlertTriangle, Mail, XCircle, Clock } from 'lucide-react';

export function ErrorNotificationTemplate() {
  return (
    <div className="bg-gray-50 p-8 font-sans">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden border-2" style={{ borderColor: '#FF4C4C' }}>
        {/* Header */}
        <div className="p-8 text-center" style={{ backgroundColor: '#FFF5F5' }}>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FF4C4C' }}>
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl text-gray-900 mb-2">Error en Envío de Correo</h1>
          <p className="text-gray-600">Notificación para el equipo de operaciones</p>
        </div>

        {/* Error Summary */}
        <div className="px-8 py-6 bg-white border-b border-gray-200">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#FF4C4C' }} />
              <div>
                <h3 className="text-sm text-gray-900 mb-1">No se pudo entregar el correo al cliente</h3>
                <p className="text-sm text-red-700">
                  El sistema ha intentado enviar el correo múltiples veces sin éxito
                </p>
              </div>
            </div>
          </div>

          {/* Order Info */}
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Pedido Asociado</span>
              <span className="text-sm text-gray-900">#TN89D4</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Destinatario</span>
              <span className="text-sm text-gray-900">cliente@email.com</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Tipo de Correo</span>
              <span className="text-sm text-gray-900">Confirmación de Pedido</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Fecha del Primer Intento</span>
              <span className="text-sm text-gray-900">04 Dic 2025, 14:17</span>
            </div>
          </div>
        </div>

        {/* Attempts */}
        <div className="px-8 py-6 border-b border-gray-200">
          <h3 className="text-sm text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Historial de Intentos
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: '#C9A84C' }}>
                <span className="text-xs text-gray-700">1</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">14:17:32</p>
                <p className="text-xs text-gray-600">Connection timeout (SMTP server not responding)</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: '#C9A84C' }}>
                <span className="text-xs text-gray-700">2</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">14:22:45</p>
                <p className="text-xs text-gray-600">Connection timeout (SMTP server not responding)</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: '#FF4C4C' }}>
                <span className="text-xs text-white">3</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">14:27:58</p>
                <p className="text-xs text-red-700">Connection timeout (SMTP server not responding)</p>
                <p className="text-xs text-red-600 mt-1">Intentos agotados - Requiere acción manual</p>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="px-8 py-6 bg-gray-50 border-b border-gray-200">
          <h3 className="text-sm text-gray-900 mb-3">Detalles Técnicos</h3>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-xs text-green-400 font-mono">
{`Error: Connection timeout
  at SMTPConnection.connect (smtp.js:156)
  at sendEmail (mailer.js:42)
  at processOrder (orders.js:89)
  
SMTP Config:
  Host: smtp.tonalli.com
  Port: 587
  TLS: enabled
  
Last Response: 421 Service not available`}
            </pre>
          </div>
        </div>

        {/* Action Required */}
        <div className="px-8 py-6 text-center">
          <p className="text-sm text-gray-900 mb-4">
            Se requiere revisar la configuración SMTP y contactar al cliente manualmente
          </p>
          <a
            href="#"
            className="inline-block px-6 py-3 rounded-lg text-white no-underline transition-all hover:shadow-md"
            style={{ backgroundColor: '#FF4C4C' }}
          >
            Revisar en el Panel Admin
          </a>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-gray-50 text-center border-t border-gray-200">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Mail className="w-4 h-4 text-gray-400" />
            <p className="text-sm text-gray-600">
              Notificación automática del sistema TONALLI
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            © 2025 Tlahtolli Studio - Sistema Interno de Notificaciones
          </p>
        </div>
      </div>
    </div>
  );
}
