import React, { useState } from 'react';
import { X, Bell, AlertCircle, CheckCircle, Mail } from 'lucide-react';
import { Product } from '../../types';
import { isValidEmail } from '../../types/suggestions';
import { isAlreadySubscribed, saveSubscription } from '../../utils/subscriptionStorage';

interface RestockNotificationModalProps {
  product: Product;
  onClose: () => void;
  onSuccess: () => void;
}

export function RestockNotificationModal({ product, onClose, onSuccess }: RestockNotificationModalProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validar email
    if (!email.trim()) {
      setError('Por favor ingresa tu correo electrónico');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Por favor ingresa un correo electrónico válido');
      return;
    }

    // Verificar si ya está suscrito
    if (isAlreadySubscribed(product.id, email)) {
      setError('Ya estás suscrito a las notificaciones de este producto');
      return;
    }

    setIsSubmitting(true);

    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Guardar suscripción
    const subscription = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      productId: product.id,
      productName: product.name,
      email: email.trim(),
      subscribedAt: new Date().toISOString(),
      notified: false
    };

    saveSubscription(subscription);

    setIsSubmitting(false);
    setIsSuccess(true);

    // Cerrar después de 2 segundos
    setTimeout(() => {
      onSuccess();
      onClose();
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 text-center">
          <div 
            className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: '#50C878' }}
          >
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-gray-900 mb-3">¡Suscripción Exitosa!</h2>
          <p className="text-gray-600 mb-4">
            Te avisaremos cuando <strong>{product.name}</strong> vuelva a estar disponible.
          </p>
          <p className="text-sm text-gray-500">
            Recibirás un correo de confirmación en {email}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="rounded-lg shadow-xl max-w-md w-full"
        style={{ backgroundColor: '#FFFDD0' }}
      >
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#73C2FB' + '20' }}
            >
              <Bell className="w-5 h-5" style={{ color: '#73C2FB' }} />
            </div>
            <div>
              <h3 className="text-gray-900">Notificarme cuando esté disponible</h3>
              <p className="text-sm text-gray-600">{product.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Contenido */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Info */}
          <div 
            className="p-4 rounded-lg border mb-4"
            style={{ backgroundColor: '#73C2FB' + '20', borderColor: '#73C2FB' }}
          >
            <p className="text-sm text-gray-700">
              Te enviaremos un correo automático cuando este tesoro vuelva a estar en el inventario del gremio.
            </p>
          </div>

          {/* Campo de email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm text-gray-700 mb-2">
              Correo electrónico *
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="tu@correo.com"
                className={`w-full px-4 py-3 pl-12 border rounded-lg focus:ring-2 focus:ring-offset-2 outline-none transition-all ${
                  error ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            {error && (
              <div className="flex items-center gap-2 mt-2 text-sm" style={{ color: '#FF4C4C' }}>
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Nota informativa */}
          <p className="text-xs text-gray-500 mb-6">
            Recibirás un correo de confirmación. Puedes cancelar tu suscripción en cualquier momento.
          </p>

          {/* Botones */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 transition-all hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-lg text-white transition-all hover:shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ backgroundColor: '#73C2FB' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4" />
                  <span>Solicitar notificación</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
