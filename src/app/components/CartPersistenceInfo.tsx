import React from 'react';
import { Info, ShoppingBag, Save, Users } from 'lucide-react';

interface CartPersistenceInfoProps {
  isAuthenticated: boolean;
}

export function CartPersistenceInfo({ isAuthenticated }: CartPersistenceInfoProps) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-gray-900 mb-2 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            Tu Bolsa de Tesoros está protegida
          </h3>
          
          {isAuthenticated ? (
            <div className="text-sm text-gray-700 space-y-2">
              <p className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Como aventurero registrado, tu carrito se guarda automáticamente en tu cuenta.</span>
              </p>
              <p className="text-gray-600">
                Puedes cerrar sesión y volver en cualquier momento - tus tesoros estarán esperándote.
              </p>
            </div>
          ) : (
            <div className="text-sm text-gray-700 space-y-2">
              <p className="flex items-center gap-2">
                <Save className="w-4 h-4 text-blue-600" />
                <span>Tu carrito se guarda localmente en este navegador.</span>
              </p>
              <p className="text-gray-600">
                💡 <strong>Consejo:</strong> Si inicias sesión, tu carrito se sincronizará con tu cuenta y estará disponible en cualquier dispositivo.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
