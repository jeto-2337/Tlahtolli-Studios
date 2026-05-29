import React from 'react';
import { User, UserCheck, ShoppingBag } from 'lucide-react';

interface CheckoutModeIndicatorProps {
  isAuthenticated: boolean;
  isGuestCheckout: boolean;
  userName?: string;
}

export function CheckoutModeIndicator({ 
  isAuthenticated, 
  isGuestCheckout, 
  userName 
}: CheckoutModeIndicatorProps) {
  // Determinar el modo de compra
  const checkoutMode = isAuthenticated && !isGuestCheckout ? 'authenticated' : 'guest';
  
  return (
    <div className={`rounded-lg p-4 mb-6 border ${
      checkoutMode === 'authenticated' 
        ? 'bg-emerald-50 border-emerald-200' 
        : 'bg-blue-50 border-blue-200'
    }`}>
      <div className="flex items-start gap-3">
        {checkoutMode === 'authenticated' ? (
          <>
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#7B4FA6' }}
            >
              <UserCheck className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-gray-900">Comprando como usuario registrado</h3>
              </div>
              <p className="text-sm text-gray-700">
                ¡Hola, <strong>{userName || 'Aventurero'}</strong>! Tu orden se asociará a tu cuenta.
              </p>
              <div className="mt-3 space-y-1.5 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#7B4FA6' }}></span>
                  <span>Historial de pedidos guardado</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#7B4FA6' }}></span>
                  <span>Seguimiento de órdenes en tu panel</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#7B4FA6' }}></span>
                  <span>Datos de envío guardados para futuras compras</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#73C2FB' }}
            >
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-gray-900">Comprando como invitado</h3>
              </div>
              <p className="text-sm text-gray-700">
                Completarás tu compra sin crear una cuenta.
              </p>
              <div className="mt-3 space-y-1.5 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#73C2FB' }}></span>
                  <span>Proceso rápido sin registro</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#73C2FB' }}></span>
                  <span>Recibirás confirmación por email</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#73C2FB' }}></span>
                  <span>Puedes rastrear tu orden con el número de seguimiento</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
