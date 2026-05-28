import React, { useState } from 'react';
import { Search, Package, AlertCircle, ArrowLeft } from 'lucide-react';

interface TrackOrderPageProps {
  onBack: () => void;
  onTrackOrder: (orderNumber: string) => void;
}

export function TrackOrderPage({ onBack, onTrackOrder }: TrackOrderPageProps) {
  const [orderNumber, setOrderNumber] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderNumber.trim()) {
      setError('Por favor ingresa un número de pedido');
      return;
    }

    if (orderNumber.trim().length < 5) {
      setError('El número de pedido no es válido');
      return;
    }

    setError('');
    onTrackOrder(orderNumber.trim().toUpperCase());
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFDD0' }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </button>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <div 
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
              style={{ backgroundColor: '#73C2FB' + '20' }}
            >
              <Package className="w-8 h-8" style={{ color: '#73C2FB' }} />
            </div>
            <h1 className="text-gray-900 mb-2">Rastrear Pedido</h1>
            <p className="text-gray-600">
              Ingresa tu número de pedido para consultar el estado de tu envío
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="orderNumber" className="block text-sm text-gray-700 mb-2">
                Número de Pedido *
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="orderNumber"
                  value={orderNumber}
                  onChange={(e) => {
                    setOrderNumber(e.target.value.toUpperCase());
                    setError('');
                  }}
                  placeholder="Ej: ABC123XYZ"
                  className={`w-full px-4 py-3 pl-12 border rounded-lg focus:ring-2 focus:ring-offset-2 outline-none transition-all font-mono ${
                    error ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              {error && (
                <div className="flex items-center gap-2 mt-2 text-sm" style={{ color: '#FF4C4C' }}>
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Puedes encontrar tu número de pedido en el email de confirmación
              </p>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 rounded-lg text-white transition-all hover:shadow-md flex items-center justify-center gap-2"
              style={{ backgroundColor: '#50C878' }}
            >
              <Search className="w-5 h-5" />
              Rastrear Pedido
            </button>
          </form>

          <div 
            className="mt-6 p-4 rounded-lg border"
            style={{ backgroundColor: '#73C2FB' + '20', borderColor: '#73C2FB' }}
          >
            <p className="text-sm mb-2" style={{ color: '#73C2FB' }}>
              <strong>¿Dónde encuentro mi número de pedido?</strong>
            </p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• En el email de confirmación que recibiste después de realizar tu compra</li>
              <li>• En la página de confirmación después de completar tu pedido</li>
              <li>• En tu cuenta de usuario, sección "Mis Pedidos"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
