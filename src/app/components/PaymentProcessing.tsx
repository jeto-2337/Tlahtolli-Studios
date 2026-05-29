import React, { useState } from 'react';
import { 
  CreditCard,
  CheckCircle,
  XCircle,
  Loader,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  Sparkles,
  Shield,
  TrendingUp,
  ShoppingBag
} from 'lucide-react';
import { PaymentMethod, PaymentTransaction } from '../types/payment';
import { processPayment } from '../utils/paymentGateway';
import { PaymentProcessingModal } from './PaymentProcessingModal';
import { PaymentErrorModal, PaymentErrorType } from './PaymentErrorModal';

interface PaymentProcessingProps {
  method: PaymentMethod;
  amount: number;
  orderId: string;
  onSuccess: (transaction: PaymentTransaction) => void;
  onError: (error: string) => void;
  onChangeMethod: () => void;
  onBackToCart?: () => void;
}

export function PaymentProcessing({ 
  method, 
  amount, 
  orderId,
  onSuccess, 
  onError,
  onChangeMethod,
  onBackToCart
}: PaymentProcessingProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [errorType, setErrorType] = useState<PaymentErrorType>('generic_error');
  const [transaction, setTransaction] = useState<PaymentTransaction | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      const result = await processPayment(method.id, amount, orderId);

      if (result.success) {
        const newTransaction: PaymentTransaction = {
          id: `TXN-${Date.now()}`,
          orderId,
          method: method.id,
          amount,
          status: 'success',
          timestamp: new Date().toISOString(),
          retryCount
        };

        setTransaction(newTransaction);
        setPaymentStatus('success');
        
        setTimeout(() => {
          onSuccess(newTransaction);
        }, 2000);
      } else {
        setErrorMessage(result.message || 'Error desconocido');
        setPaymentStatus('error');
        setRetryCount(retryCount + 1);
        setErrorType(result.errorType || 'generic_error');
        onError(result.message || 'Error desconocido');
        setShowErrorModal(true);
      }
    } catch (error) {
      setErrorMessage('Error al procesar el pago. Por favor, intenta nuevamente.');
      setPaymentStatus('error');
      setRetryCount(retryCount + 1);
      setErrorType('generic_error');
      onError('Error al procesar el pago');
      setShowErrorModal(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetry = () => {
    setPaymentStatus('idle');
    setErrorMessage('');
  };

  if (paymentStatus === 'success' && transaction) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div 
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 relative"
            style={{ backgroundColor: '#7B4FA6' }}
          >
            <CheckCircle className="w-10 h-10 text-white" />
            <div className="absolute inset-0 rounded-full animate-ping opacity-25" style={{ backgroundColor: '#7B4FA6' }} />
          </div>
          <h2 className="text-gray-900 mb-2">¡Pago Exitoso!</h2>
          <p className="text-gray-600 flex items-center justify-center gap-2">
            <span>✦</span>
            Tu tesoro ha sido asegurado
            <span>✦</span>
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div 
            className="p-6 rounded-lg mb-6"
            style={{ backgroundColor: '#7B4FA6' + '20' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6" style={{ color: '#7B4FA6' }} />
              <div>
                <p className="text-sm text-gray-600">Código de pedido</p>
                <p className="text-gray-900">{orderId}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="text-2xl">{method.icon}</div>
              <div>
                <p className="text-sm text-gray-600">Método de Pago</p>
                <p className="text-gray-900">{method.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6" style={{ color: '#7B4FA6' }} />
              <div>
                <p className="text-sm text-gray-600">Monto</p>
                <p className="text-gray-900">${amount.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div 
            className="p-4 rounded-lg border mb-6"
            style={{ backgroundColor: '#F0F9FF', borderColor: '#73C2FB' }}
          >
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 flex-shrink-0" style={{ color: '#73C2FB' }} />
              <div>
                <p className="text-sm mb-2" style={{ color: '#73C2FB' }}>
                  <strong>Transacción Confirmada</strong>
                </p>
                <p className="text-xs text-gray-600">
                  ID de transacción: {transaction.id}
                </p>
                <p className="text-xs text-gray-600">
                  Fecha: {new Date(transaction.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600 text-center">
            Se ha enviado una confirmación por correo electrónico con los detalles de tu compra
          </p>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'error') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div 
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
            style={{ backgroundColor: '#FF4C4C' }}
          >
            <XCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-gray-900 mb-2">Pago Rechazado</h2>
          <p className="text-gray-600 flex items-center justify-center gap-2">
            <span>✦</span>
            El portal encontró un obstáculo
            <span>✦</span>
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div 
            className="p-6 rounded-lg mb-6"
            style={{ backgroundColor: '#FF4C4C' }}
          >
            <div className="flex items-start gap-3 text-white">
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <div>
                <p className="mb-2">
                  <strong>Motivo del rechazo:</strong>
                </p>
                <p className="text-sm">
                  {errorMessage}
                </p>
              </div>
            </div>
          </div>

          <div 
            className="p-4 rounded-lg border mb-6"
            style={{ backgroundColor: '#C9A84C' + '40', borderColor: '#C9A84C' }}
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-gray-700" />
              <div className="text-sm text-gray-700">
                <p className="mb-2"><strong>¿Qué puedes hacer?</strong></p>
                <ul className="space-y-1 text-xs">
                  <li>• Verifica que los datos sean correctos</li>
                  <li>• Confirma que tengas fondos suficientes</li>
                  <li>• Intenta con otro método de pago</li>
                  <li>• Contacta a tu banco si el problema persiste</li>
                </ul>
              </div>
            </div>
          </div>

          {retryCount > 0 && (
            <div className="mb-6 text-center text-sm text-gray-600">
              Intentos realizados: {retryCount}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={handleRetry}
              className="px-6 py-3 rounded-lg border-2 transition-all hover:shadow-md flex items-center justify-center gap-2"
              style={{ borderColor: '#73C2FB', color: '#73C2FB' }}
            >
              <RefreshCw className="w-5 h-5" />
              Reintentar pago
            </button>
            <button
              onClick={onChangeMethod}
              className="px-6 py-3 rounded-lg text-white transition-all hover:shadow-md flex items-center justify-center gap-2"
              style={{ backgroundColor: '#7B4FA6' }}
            >
              <ArrowLeft className="w-5 h-5" />
              Cambiar método
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div 
          className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
          style={{ backgroundColor: '#7B4FA6' }}
        >
          <CreditCard className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-gray-900 mb-2">Procesar Pago</h2>
        <p className="text-gray-600 flex items-center justify-center gap-2">
          <span>✦</span>
          Ingresa al portal de pago seguro
          <span>✦</span>
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{method.icon}</div>
              <div>
                <p className="text-sm text-gray-600">Método seleccionado</p>
                <p className="text-gray-900">{method.name}</p>
              </div>
            </div>
            <button
              onClick={onChangeMethod}
              className="text-sm underline"
              style={{ color: '#73C2FB' }}
            >
              Cambiar
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Número de Orden</p>
              <p className="text-gray-900">{orderId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Monto Total</p>
              <p className="text-gray-900">${amount.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Tiempo de Proceso</p>
              <p className="text-gray-900">{method.processingTime}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Comisión</p>
              <p className="text-gray-900">{method.fee}</p>
            </div>
          </div>

          <div 
            className="p-4 rounded-lg border"
            style={{ backgroundColor: '#F0F9FF', borderColor: '#73C2FB' }}
          >
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 flex-shrink-0" style={{ color: '#73C2FB' }} />
              <div className="text-sm text-gray-700">
                <p className="mb-2"><strong>Protección del Cofre Activada</strong></p>
                <p className="text-xs text-gray-600">
                  Tu pago está protegido con encriptación SSL de 256 bits y cumple con los 
                  estándares PCI DSS. Tu información financiera nunca se almacena en nuestros servidores.
                </p>
              </div>
            </div>
          </div>
        </div>

        {paymentStatus === 'processing' ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#73C2FB' + '20' }}>
              <Loader className="w-8 h-8 animate-spin" style={{ color: '#73C2FB' }} />
            </div>
            <p className="text-gray-900 mb-2">Procesando tu pago...</p>
            <p className="text-sm text-gray-600">Conectando con el portal seguro</p>
          </div>
        ) : (
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full px-6 py-4 rounded-lg text-white transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ backgroundColor: '#7B4FA6' }}
          >
            <Sparkles className="w-5 h-5" />
            Realizar Pago Seguro
          </button>
        )}
      </div>

      <div className="text-center">
        <button
          onClick={onChangeMethod}
          className="text-sm text-gray-600 hover:text-gray-900 underline flex items-center gap-2 mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a métodos de pago
        </button>
      </div>

      {/* Modal de procesamiento */}
      <PaymentProcessingModal isOpen={paymentStatus === 'processing'} />

      {/* Modal de error */}
      <PaymentErrorModal
        isOpen={showErrorModal}
        errorType={errorType}
        onRetry={() => {
          setShowErrorModal(false);
          handleRetry();
        }}
        onChangeMethod={() => {
          setShowErrorModal(false);
          onChangeMethod();
        }}
        onBackToCart={() => {
          setShowErrorModal(false);
          // Esta funcionalidad se manejará en el componente padre
          if (onBackToCart) {
            onBackToCart();
          } else {
            window.history.back();
          }
        }}
        onClose={() => setShowErrorModal(false)}
      />
    </div>
  );
}