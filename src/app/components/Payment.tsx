import React, { useState } from 'react';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { PaymentDetailsForm } from './PaymentDetailsForm';
import { OrderConfirmationPreview } from './checkout/OrderConfirmationPreview';
import { PaymentProcessing } from './PaymentProcessing';
import { PaymentMethod, PaymentTransaction } from '../types/payment';
import { OrderData, CartItem } from '../types';

interface PaymentProps {
  onComplete: (transaction?: PaymentTransaction) => void;
  total: number;
  orderId?: string;
  onBackToCart?: () => void;
  orderData?: OrderData;
  items?: CartItem[];
  onPaymentDataUpdate?: (paymentData: any) => void;
}

export function Payment({ 
  onComplete, 
  total, 
  orderId = `ORD-${Date.now()}`, 
  onBackToCart,
  orderData,
  items = [],
  onPaymentDataUpdate
}: PaymentProps) {
  const [step, setStep] = useState<'select' | 'details' | 'confirm' | 'process' | 'complete'>('select');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<{
    cardHolder: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  } | null>(null);
  const [transaction, setTransaction] = useState<PaymentTransaction | null>(null);

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
  };

  const handleContinueFromSelect = () => {
    if (selectedMethod) {
      // Si el método requiere redirección externa, avanzar directamente
      if (selectedMethod.type === 'external') {
        // Para métodos externos, no capturamos detalles, solo avanzamos
        if (orderData) {
          const paymentData = {
            paymentMethod: selectedMethod
          };
          onComplete(paymentData);
        } else {
          setStep('confirm');
        }
      } else {
        // Para tarjetas, ir a captura de detalles
        setStep('details');
      }
    }
  };

  const handlePaymentDetailsComplete = (details: {
    cardHolder: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  }) => {
    setPaymentDetails(details);
    
    // Guardar los datos de pago en orderData si existe (flujo usuario registrado)
    if (orderData) {
      // Pasar los datos de pago y método al componente padre (Checkout)
      const paymentData = {
        paymentInfo: details,
        paymentMethod: selectedMethod
      };
      onComplete(paymentData);
    } else {
      // Flujo antiguo (sin orderData, muestra confirmación interna)
      setStep('confirm');
    }

    // Actualizar datos de pago si se proporciona la función de callback
    if (onPaymentDataUpdate) {
      onPaymentDataUpdate(details);
    }
  };

  const handleBackToSelect = () => {
    setStep('select');
    setSelectedMethod(null);
    setPaymentDetails(null);
  };

  const handleBackToDetails = () => {
    setStep('details');
  };

  const handleConfirmOrder = () => {
    setStep('process');
  };

  const handlePaymentSuccess = (txn: PaymentTransaction) => {
    setTransaction(txn);
    setStep('complete');
    setTimeout(() => {
      onComplete(txn);
    }, 2000);
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
  };

  const handleChangeMethod = () => {
    setStep('select');
    setSelectedMethod(null);
    setPaymentDetails(null);
  };

  // Paso 1: Seleccionar método
  if (step === 'select') {
    return (
      <PaymentMethodSelector
        onMethodSelect={handleMethodSelect}
        selectedMethod={selectedMethod}
        onContinue={handleContinueFromSelect}
      />
    );
  }

  // Paso 2: Ingresar detalles de pago
  if (step === 'details' && selectedMethod) {
    return (
      <PaymentDetailsForm
        selectedMethod={selectedMethod}
        onComplete={handlePaymentDetailsComplete}
        onBack={handleBackToSelect}
      />
    );
  }

  // Paso 3: Confirmar orden
  if (step === 'confirm' && selectedMethod && paymentDetails && orderData) {
    return (
      <OrderConfirmationPreview
        orderData={orderData}
        items={items}
        selectedMethod={selectedMethod}
        paymentDetails={paymentDetails}
        onConfirm={handleConfirmOrder}
        onBack={handleBackToDetails}
      />
    );
  }

  // Paso 4: Procesar pago
  if (step === 'process' && selectedMethod) {
    return (
      <PaymentProcessing
        method={selectedMethod}
        amount={total}
        orderId={orderId}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
        onChangeMethod={handleChangeMethod}
        onBackToCart={onBackToCart}
      />
    );
  }

  return null;
}