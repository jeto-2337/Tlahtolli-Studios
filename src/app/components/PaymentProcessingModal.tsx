import React from 'react';
import { Loader2, Shield, Lock, CreditCard } from 'lucide-react';

interface PaymentProcessingModalProps {
  isOpen: boolean;
}

export function PaymentProcessingModal({ isOpen }: PaymentProcessingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}>
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
        {/* Spinner animado */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#ECFDF5' }}
            >
              <Loader2 
                className="w-12 h-12 animate-spin" 
                style={{ color: '#7B4FA6' }} 
              />
            </div>
            <div 
              className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center border-4 border-white"
              style={{ backgroundColor: '#73C2FB' }}
            >
              <Shield className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Texto */}
        <div className="text-center mb-6">
          <h3 className="text-gray-900 mb-2">
            Procesando tu pago
          </h3>
          <p className="text-gray-600">
            Estamos verificando tu información de pago con tu banco...
          </p>
        </div>

        {/* Indicadores de seguridad */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#F0F9FF' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#73C2FB' }}>
              <Lock className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Conexión segura</p>
              <p className="text-xs text-gray-600">Encriptación SSL de 256 bits</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#ECFDF5' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#7B4FA6' }}>
              <CreditCard className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Pago protegido</p>
              <p className="text-xs text-gray-600">Tus datos están seguros</p>
            </div>
          </div>
        </div>

        {/* Nota */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            No cierres esta ventana ni actualices la página
          </p>
        </div>
      </div>
    </div>
  );
}
