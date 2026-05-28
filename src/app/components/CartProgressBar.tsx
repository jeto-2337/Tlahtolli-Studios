import React from 'react';
import { ShoppingCart, Package, CreditCard, CheckCircle } from 'lucide-react';

interface CartProgressBarProps {
  currentStep: 'cart' | 'shipping' | 'payment' | 'confirmation';
}

export function CartProgressBar({ currentStep }: CartProgressBarProps) {
  const steps = [
    { id: 'cart', name: 'Inventario', icon: ShoppingCart },
    { id: 'shipping', name: 'Envío', icon: Package },
    { id: 'payment', name: 'Pago', icon: CreditCard },
    { id: 'confirmation', name: 'Confirmación', icon: CheckCircle }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="w-full py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index < currentStepIndex;
            const isCurrent = step.id === currentStep;
            const isUpcoming = index > currentStepIndex;
            
            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center relative">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'text-white'
                        : isCurrent
                        ? 'text-white ring-4 ring-opacity-30'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                    style={{
                      backgroundColor: isCompleted || isCurrent ? '#73C2FB' : undefined,
                      ringColor: isCurrent ? '#73C2FB' : undefined
                    }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span
                    className={`text-sm mt-2 text-center whitespace-nowrap ${
                      isCurrent ? 'text-gray-900' : isCompleted ? 'text-gray-700' : 'text-gray-400'
                    }`}
                  >
                    {step.name}
                  </span>
                  {isCurrent && (
                    <div 
                      className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full"
                      style={{ backgroundColor: '#73C2FB' }}
                    />
                  )}
                </div>
                
                {index < steps.length - 1 && (
                  <div
                    className="flex-1 h-1 mx-2 transition-all rounded-full"
                    style={{
                      backgroundColor: isCompleted ? '#73C2FB' : '#E5E7EB'
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
