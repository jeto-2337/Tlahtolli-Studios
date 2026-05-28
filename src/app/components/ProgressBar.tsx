import React from 'react';
import { Check, Lock } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number;
  steps: { id: number; name: string }[];
  onStepClick?: (stepId: number) => void;
  canNavigateBack?: boolean;
  completedSteps?: number[];
}

export function ProgressBar({ currentStep, steps, onStepClick, canNavigateBack = false, completedSteps = [] }: ProgressBarProps) {
  const handleStepClick = (stepId: number) => {
    // Permitir navegar a pasos anteriores o al paso actual
    if (canNavigateBack && stepId <= currentStep && onStepClick) {
      onStepClick(stepId);
    }
  };

  return (
    <div className="w-full py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            const isClickable = canNavigateBack && step.id <= currentStep;
            const isFuture = step.id > currentStep;
            
            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'text-white'
                        : isCurrent
                        ? 'text-white'
                        : 'bg-gray-200 text-gray-500'
                    } ${isClickable ? 'cursor-pointer hover:scale-110' : ''} ${isFuture ? 'opacity-50' : ''}`}
                    style={{
                      backgroundColor: isCompleted || isCurrent ? '#73C2FB' : undefined
                    }}
                    onClick={() => handleStepClick(step.id)}
                    title={isClickable ? `Ir a ${step.name}` : isFuture ? 'Completa los pasos anteriores' : ''}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : isFuture ? (
                      <span>{step.id}</span>
                    ) : (
                      <span>{step.id}</span>
                    )}
                  </div>
                  <span
                    className={`text-sm mt-2 text-center whitespace-nowrap ${
                      isCurrent ? 'text-gray-900' : isCompleted ? 'text-gray-700' : 'text-gray-500'
                    } ${isClickable ? 'cursor-pointer hover:text-gray-900' : ''}`}
                    onClick={() => handleStepClick(step.id)}
                  >
                    {step.name}
                  </span>
                </div>
                
                {index < steps.length - 1 && (
                  <div
                    className="flex-1 h-0.5 mx-2 transition-all"
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