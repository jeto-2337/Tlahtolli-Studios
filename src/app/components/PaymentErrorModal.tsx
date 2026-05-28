import React from 'react';
import { AlertCircle, RotateCcw, CreditCard, ShoppingBag, X } from 'lucide-react';

export type PaymentErrorType = 
  | 'insufficient_funds'
  | 'card_declined'
  | 'expired_card'
  | 'invalid_cvv'
  | 'network_error'
  | 'timeout'
  | 'generic_error';

interface PaymentErrorModalProps {
  isOpen: boolean;
  errorType: PaymentErrorType;
  onRetry: () => void;
  onChangeMethod: () => void;
  onBackToCart: () => void;
  onClose: () => void;
}

const errorMessages: Record<PaymentErrorType, { title: string; description: string; icon: string }> = {
  insufficient_funds: {
    title: 'Fondos insuficientes',
    description: 'Tu tarjeta no tiene fondos suficientes para completar esta transacción.',
    icon: '💳'
  },
  card_declined: {
    title: 'Tarjeta declinada',
    description: 'Tu banco ha rechazado la transacción. Por favor, contacta a tu banco o intenta con otro método de pago.',
    icon: '🚫'
  },
  expired_card: {
    title: 'Tarjeta vencida',
    description: 'La tarjeta que intentaste usar ha expirado. Por favor, usa una tarjeta vigente.',
    icon: '📅'
  },
  invalid_cvv: {
    title: 'CVV incorrecto',
    description: 'El código de seguridad (CVV) no es válido. Verifica los 3 dígitos en el reverso de tu tarjeta.',
    icon: '🔐'
  },
  network_error: {
    title: 'Error de conexión',
    description: 'No pudimos conectar con la pasarela de pago. Verifica tu conexión a internet e intenta nuevamente.',
    icon: '📡'
  },
  timeout: {
    title: 'Tiempo de espera agotado',
    description: 'La transacción tardó demasiado tiempo. Por favor, intenta nuevamente.',
    icon: '⏱️'
  },
  generic_error: {
    title: 'Error en el pago',
    description: 'Ocurrió un error al procesar tu pago. Por favor, intenta nuevamente o usa otro método de pago.',
    icon: '⚠️'
  }
};

export function PaymentErrorModal({
  isOpen,
  errorType,
  onRetry,
  onChangeMethod,
  onBackToCart,
  onClose
}: PaymentErrorModalProps) {
  if (!isOpen) return null;

  const error = errorMessages[errorType] || errorMessages.generic_error;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}>
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#FEE2E2' }}
            >
              <AlertCircle className="w-6 h-6" style={{ color: '#FF4C4C' }} />
            </div>
            <div>
              <h3 className="text-gray-900">{error.title}</h3>
              <p className="text-sm text-gray-500">No se pudo procesar el pago</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {/* Icono grande del error */}
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{error.icon}</div>
            <p className="text-gray-700 leading-relaxed">
              {error.description}
            </p>
          </div>

          {/* Información adicional según el tipo de error */}
          <div 
            className="rounded-lg p-4 mb-6"
            style={{ backgroundColor: '#FEF3C7', borderLeft: '4px solid #F0E68C' }}
          >
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#92400E' }} />
              <div className="text-sm" style={{ color: '#92400E' }}>
                <p className="mb-2">
                  <strong>💡 Recomendaciones:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  {errorType === 'insufficient_funds' && (
                    <>
                      <li>Verifica el saldo disponible en tu cuenta</li>
                      <li>Intenta con otra tarjeta o método de pago</li>
                      <li>Reduce la cantidad de productos si es posible</li>
                    </>
                  )}
                  {errorType === 'card_declined' && (
                    <>
                      <li>Contacta a tu banco para más información</li>
                      <li>Verifica que no haya restricciones en tu tarjeta</li>
                      <li>Intenta con otro método de pago</li>
                    </>
                  )}
                  {errorType === 'expired_card' && (
                    <>
                      <li>Verifica la fecha de vencimiento de tu tarjeta</li>
                      <li>Usa una tarjeta vigente</li>
                      <li>Actualiza tu método de pago</li>
                    </>
                  )}
                  {errorType === 'invalid_cvv' && (
                    <>
                      <li>Verifica los 3 dígitos en el reverso de tu tarjeta</li>
                      <li>Asegúrate de ingresar el CVV correctamente</li>
                      <li>No confundas el CVV con el PIN</li>
                    </>
                  )}
                  {(errorType === 'network_error' || errorType === 'timeout') && (
                    <>
                      <li>Verifica tu conexión a internet</li>
                      <li>Intenta nuevamente en unos momentos</li>
                      <li>Cierra otras aplicaciones que usen internet</li>
                    </>
                  )}
                  {errorType === 'generic_error' && (
                    <>
                      <li>Verifica que todos los datos sean correctos</li>
                      <li>Intenta con otro método de pago</li>
                      <li>Contacta a soporte si el problema persiste</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="space-y-3">
            {/* Reintentar */}
            <button
              onClick={onRetry}
              className="w-full px-6 py-4 rounded-lg text-white transition-all hover:shadow-lg flex items-center justify-center gap-2"
              style={{ backgroundColor: '#50C878' }}
            >
              <RotateCcw className="w-5 h-5" />
              Reintentar pago
            </button>

            {/* Cambiar método */}
            <button
              onClick={onChangeMethod}
              className="w-full px-6 py-3 rounded-lg border-2 transition-all hover:bg-gray-50 flex items-center justify-center gap-2"
              style={{ borderColor: '#73C2FB', color: '#73C2FB' }}
            >
              <CreditCard className="w-5 h-5" />
              Cambiar método de pago
            </button>

            {/* Volver al carrito */}
            <button
              onClick={onBackToCart}
              className="w-full px-6 py-3 rounded-lg border border-gray-300 text-gray-700 transition-all hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Volver al carrito
            </button>
          </div>
        </div>

        {/* Footer */}
        <div 
          className="px-6 py-4 border-t border-gray-200 text-center"
          style={{ backgroundColor: '#F9FAFB' }}
        >
          <p className="text-xs text-gray-600">
            ¿Necesitas ayuda? Contacta a{' '}
            <a href="mailto:soporte@tonalli.com" className="underline" style={{ color: '#50C878' }}>
              soporte@tonalli.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
