import React, { useState } from 'react';
import { Truck, Zap, Package, Sparkles } from 'lucide-react';

interface ShippingMethodStepProps {
  onComplete: (method: { method: string; price: number }) => void;
  initialMethod?: { method: string; price: number };
  shippingAddress?: {
    state: string;
    municipality: string;
    zipCode: string;
  };
}

export function ShippingMethodStep({ onComplete, initialMethod, shippingAddress }: ShippingMethodStepProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>(
    initialMethod?.method === 'Envío express' ? 'express' : 'standard'
  );

  // Opciones de envío basadas en la ubicación
  const getShippingOptions = () => {
    const baseOptions = [
      {
        id: 'standard',
        name: 'Envío estándar',
        description: 'Ruta terrestre del comerciante',
        price: 99,
        days: '5-7 días hábiles',
        icon: Truck
      },
      {
        id: 'express',
        name: 'Envío express',
        description: 'Mensajero veloz del reino',
        price: 199,
        days: '2-3 días hábiles',
        icon: Zap
      }
    ];

    // Agregar envío premium si está en ciertas ubicaciones
    if (shippingAddress?.state?.toLowerCase().includes('ciudad de méxico') ||
        shippingAddress?.state?.toLowerCase().includes('cdmx') ||
        shippingAddress?.state?.toLowerCase().includes('guadalajara') ||
        shippingAddress?.state?.toLowerCase().includes('monterrey')) {
      baseOptions.push({
        id: 'premium',
        name: 'Envío premium',
        description: 'Portal mágico instantáneo',
        price: 299,
        days: '24 horas',
        icon: Package
      });
    }

    return baseOptions;
  };

  const shippingOptions = getShippingOptions();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selected = shippingOptions.find(opt => opt.id === selectedMethod);
    if (selected) {
      onComplete({
        method: selected.name,
        price: selected.price
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="text-center mb-6">
          <h2 className="text-gray-900 mb-2">Método de envío</h2>
          <p className="text-gray-600 text-sm flex items-center justify-center gap-2">
            <span>✦</span>
            Elige cómo quieres recibir tu tesoro
            <span>✦</span>
          </p>
        </div>

        {shippingAddress && (
          <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#F0E68C' }}>
            <p className="text-sm text-gray-700">
              <strong>Destino:</strong> {shippingAddress.municipality}, {shippingAddress.state} - CP {shippingAddress.zipCode}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            {shippingOptions.map((option) => {
              const Icon = option.icon;
              return (
                <label
                  key={option.id}
                  className={`flex items-start gap-4 p-5 border-2 rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                    selectedMethod === option.id
                      ? 'bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{
                    borderColor: selectedMethod === option.id ? '#73C2FB' : undefined
                  }}
                >
                  <input
                    type="radio"
                    name="shipping"
                    value={option.id}
                    checked={selectedMethod === option.id}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    className="w-5 h-5 mt-1"
                    style={{ accentColor: '#73C2FB' }}
                  />
                  <Icon className="w-6 h-6 text-gray-600 mt-1" />
                  <div className="flex-1">
                    <div className="text-gray-900 mb-1">{option.name}</div>
                    <div className="text-sm text-gray-600 mb-1">{option.description}</div>
                    <div className="text-sm text-gray-500">{option.days}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-900">${option.price} MXN</div>
                  </div>
                </label>
              );
            })}
          </div>

          <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFFDD0' }}>
            <p className="text-xs text-gray-600">
              💡 Tip: Los envíos superiores a $500 MXN tienen envío estándar gratuito
            </p>
          </div>

          <button
            type="submit"
            className="w-full px-6 py-4 rounded-lg text-white transition-all hover:shadow-md flex items-center justify-center gap-2"
            style={{ backgroundColor: '#50C878' }}
          >
            <Sparkles className="w-5 h-5" />
            Continuar a método de pago
          </button>
        </form>
      </div>
    </div>
  );
}
