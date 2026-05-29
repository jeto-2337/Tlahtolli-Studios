import React, { useState } from 'react';
import { ProgressBar } from './ProgressBar';
import { CheckoutForm } from './CheckoutForm';
import { ShippingMethod } from './ShippingMethod';
import { ErrorMessage } from './ErrorMessage';
import { GuestEmailStep } from './checkout/GuestEmailStep';
import { PersonalInfoStep } from './checkout/PersonalInfoStep';
import { ShippingMethodStep } from './checkout/ShippingMethodStep';
import { PaymentInfoStep } from './checkout/PaymentInfoStep';
import { OrderConfirmationStep } from './checkout/OrderConfirmationStep';
import { OrderData, CartItem } from '../types';
import { CheckoutModeIndicator } from './CheckoutModeIndicator';
import { useAuth } from '../contexts/AuthContext';

interface CheckoutProps {
  isGuest: boolean;
  items: CartItem[];
  onComplete: (orderData: OrderData) => void;
}

// Pasos para usuario registrado (ahora iguales al de invitado excepto sin email)
const registeredSteps = [
  { id: 1, name: 'Información' },
  { id: 2, name: 'Envío' },
  { id: 3, name: 'Pago' },
  { id: 4, name: 'Confirmar' }
];

// Pasos para invitado
const guestSteps = [
  { id: 1, name: 'Email' },
  { id: 2, name: 'Datos' },
  { id: 3, name: 'Envío' },
  { id: 4, name: 'Pago' },
  { id: 5, name: 'Confirmar' }
];

export function Checkout({ isGuest, items, onComplete }: CheckoutProps) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [orderData, setOrderData] = useState<OrderData>({ isGuest });
  const [error, setError] = useState<string | null>(null);

  const steps = isGuest ? guestSteps : registeredSteps;

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = orderData.shippingMethod?.price || 99;
  const total = subtotal + shipping;

  const handleStepClick = (stepId: number) => {
    // Permitir navegar a pasos anteriores
    if (stepId < currentStep) {
      setCurrentStep(stepId);
      setError(null);
      return;
    }
    
    // Para el paso de confirmación, validar que todo esté completo
    if (isGuest && stepId === 5) {
      // Validar que todos los pasos anteriores estén completos
      if (!orderData.guestEmail || !orderData.customerInfo || !orderData.shippingAddress || !orderData.shippingMethod || !orderData.paymentInfo) {
        return; // No permitir acceso
      }
    } else if (!isGuest && stepId === 4) {
      // Validar para usuario registrado
      if (!orderData.customerInfo || !orderData.shippingMethod || !orderData.paymentInfo) {
        return; // No permitir acceso
      }
    }
    
    // Permitir avanzar al siguiente paso
    if (stepId === currentStep + 1) {
      setCurrentStep(stepId);
      setError(null);
    }
  };

  // ========== FLUJO INVITADO ==========

  const handleGuestEmailComplete = (email: string) => {
    try {
      setError(null);
      setOrderData(prev => ({ ...prev, guestEmail: email }));
      setCurrentStep(2);
    } catch (err) {
      setError('Hubo un error al procesar el email. Por favor, intenta nuevamente.');
    }
  };

  const handlePersonalInfoComplete = (data: {
    firstName: string;
    paternalLastName: string;
    maternalLastName: string;
    phone: string;
    street: string;
    number: string;
    colony: string;
    municipality: string;
    state: string;
    zipCode: string;
  }) => {
    try {
      setError(null);
      
      // El email viene del guestEmail o del usuario autenticado
      const email = orderData.guestEmail || user?.email || '';
      
      setOrderData(prev => ({
        ...prev,
        customerInfo: {
          firstName: data.firstName,
          paternalLastName: data.paternalLastName,
          maternalLastName: data.maternalLastName,
          email: email,
          phone: data.phone
        },
        shippingAddress: {
          street: data.street,
          number: data.number,
          colony: data.colony,
          municipality: data.municipality,
          state: data.state,
          zipCode: data.zipCode
        }
      }));
      setCurrentStep(3);
    } catch (err) {
      setError('No pudimos procesar tu información. Por favor, verifica los datos e intenta nuevamente.');
    }
  };

  const handleGuestShippingComplete = (method: { method: string; price: number }) => {
    try {
      setError(null);
      setOrderData(prev => ({ ...prev, shippingMethod: method }));
      setCurrentStep(4);
    } catch (err) {
      setError('Hubo un problema al seleccionar el método de envío. Por favor, intenta de nuevo.');
    }
  };

  const handlePaymentInfoComplete = (data: {
    cardHolder: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  }) => {
    try {
      setError(null);
      setOrderData(prev => ({ ...prev, paymentInfo: data }));
      // Avanzar al siguiente paso: confirmación (5 para invitados, 4 para usuarios)
      setCurrentStep(isGuest ? 5 : 4);
    } catch (err) {
      setError('No pudimos procesar la información de pago. Por favor, verifica e intenta nuevamente.');
    }
  };

  const handleOrderConfirm = () => {
    try {
      setError(null);
      onComplete(orderData);
    } catch (err) {
      setError('No pudimos completar tu orden. Por favor, intenta nuevamente.');
    }
  };

  // ========== FLUJO USUARIO REGISTRADO ==========

  const handleFormComplete = (data: OrderData) => {
    try {
      setError(null);
      
      // Agregar el email del usuario autenticado al customerInfo
      const customerInfoWithEmail = {
        ...data.customerInfo!,
        email: user?.email || ''
      };
      
      setOrderData({ 
        ...orderData, 
        ...data,
        customerInfo: customerInfoWithEmail
      });
      setCurrentStep(2);
    } catch (err) {
      setError('No pudimos procesar tu información. Por favor, verifica los datos e intenta nuevamente.');
    }
  };

  const handleShippingComplete = (method: { method: string; price: number }) => {
    try {
      setError(null);
      setOrderData({ ...orderData, shippingMethod: method });
      setCurrentStep(3);
    } catch (err) {
      setError('Hubo un problema al seleccionar el método de envío. Por favor, intenta de nuevo.');
    }
  };

  const handlePaymentComplete = (paymentData?: any) => {
    try {
      setError(null);
      // Si Payment nos pasa datos de pago, actualizarlos en orderData
      if (paymentData) {
        setOrderData(prev => ({ ...prev, ...paymentData }));
      }
      // Avanzar al paso de confirmación
      setCurrentStep(4);
    } catch (err) {
      setError('No pudimos completar tu orden. Por favor, verifica tu información de pago e intenta nuevamente.');
    }
  };

  const handleRetry = () => {
    setError(null);
  };

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: '#F4F0F8' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-2">
          <h1 className="text-gray-900">Finalizar compra</h1>
          {isGuest && (
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="text-gray-600">✦ Comprando como invitado</span>
            </div>
          )}
        </div>
        
        <ProgressBar 
          currentStep={currentStep} 
          steps={steps} 
          onStepClick={handleStepClick}
          canNavigateBack={true}
        />
        
        <div className="py-8">
          {error && (
            <div className="max-w-2xl mx-auto mb-6">
              <ErrorMessage message={error} onRetry={handleRetry} />
            </div>
          )}
          
          {/* Indicador de modo de checkout */}
          {currentStep === 1 && (
            <div className="max-w-2xl mx-auto mb-6">
              <CheckoutModeIndicator 
                isAuthenticated={!isGuest}
                isGuestCheckout={isGuest}
                userName={user?.email?.split('@')[0] || user?.name}
              />
            </div>
          )}
          
          {/* ========== FLUJO INVITADO ========== */}
          {isGuest && (
            <>
              {currentStep === 1 && (
                <GuestEmailStep 
                  onComplete={handleGuestEmailComplete}
                  initialEmail={orderData.guestEmail}
                />
              )}
              
              {currentStep === 2 && (
                <PersonalInfoStep 
                  onComplete={handlePersonalInfoComplete}
                  initialData={{
                    firstName: orderData.customerInfo?.firstName,
                    paternalLastName: orderData.customerInfo?.paternalLastName,
                    maternalLastName: orderData.customerInfo?.maternalLastName,
                    phone: orderData.customerInfo?.phone,
                    street: orderData.shippingAddress?.street,
                    number: orderData.shippingAddress?.number,
                    colony: orderData.shippingAddress?.colony,
                    municipality: orderData.shippingAddress?.municipality,
                    state: orderData.shippingAddress?.state,
                    zipCode: orderData.shippingAddress?.zipCode
                  }}
                  guestEmail={orderData.guestEmail}
                />
              )}
              
              {currentStep === 3 && (
                <ShippingMethodStep 
                  onComplete={handleGuestShippingComplete}
                  initialMethod={orderData.shippingMethod}
                  shippingAddress={orderData.shippingAddress}
                />
              )}
              
              {currentStep === 4 && (
                <PaymentInfoStep 
                  onComplete={handlePaymentInfoComplete}
                  initialData={orderData.paymentInfo}
                />
              )}
              
              {currentStep === 5 && (
                <OrderConfirmationStep 
                  orderData={orderData}
                  items={items}
                  onConfirm={handleOrderConfirm}
                />
              )}
            </>
          )}
          
          {/* ========== FLUJO USUARIO REGISTRADO ========== */}
          {!isGuest && (
            <>
              {currentStep === 1 && (
                <CheckoutForm onComplete={handleFormComplete} isGuest={isGuest} />
              )}
              
              {currentStep === 2 && (
                <ShippingMethod onComplete={handleShippingComplete} />
              )}
              
              {currentStep === 3 && (
                <PaymentInfoStep 
                  onComplete={handlePaymentInfoComplete}
                  initialData={orderData.paymentInfo}
                />
              )}
              
              {currentStep === 4 && (
                <OrderConfirmationStep 
                  orderData={orderData}
                  items={items}
                  onConfirm={handleOrderConfirm}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}