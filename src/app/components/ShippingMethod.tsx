import React, { useState } from 'react';
import { Truck, Zap } from 'lucide-react';

interface ShippingMethodProps {
  onComplete: (method: { method: string; price: number }) => void;
}

export function ShippingMethod({ onComplete }: ShippingMethodProps) {
  const [selectedMethod, setSelectedMethod] = useState<'standard' | 'express'>('standard');

  const shippingOptions = [
    {
      id: 'standard',
      name: 'Envío estándar',
      price: 99,
      days: '5-7 días hábiles',
      icon: Truck
    },
    {
      id: 'express',
      name: 'Envío express',
      price: 199,
      days: '2-3 días hábiles',
      icon: Zap
    }
  ];

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
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-gray-900 mb-4">Método de envío</h2>
        <div className="space-y-3">
          {shippingOptions.map((option) => {
            const Icon = option.icon;
            return (
              <label
                key={option.id}
                className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
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
                  onChange={(e) => setSelectedMethod(e.target.value as 'standard' | 'express')}
                  className="w-5 h-5"
                  style={{ accentColor: '#73C2FB' }}
                />
                <Icon className="w-6 h-6 text-gray-600" />
                <div className="flex-1">
                  <div className="text-gray-900">{option.name}</div>
                  <div className="text-sm text-gray-600">{option.days}</div>
                </div>
                <div className="text-gray-900">${option.price} MXN</div>
              </label>
            );
          })}
        </div>
      </div>
      
      <button
        type="submit"
        className="w-full px-6 py-3 rounded-lg text-white transition-all hover:shadow-md"
        style={{ backgroundColor: '#50C878' }}
      >
        Continuar a pago
      </button>
    </form>
  );
}
