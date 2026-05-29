import React, { useState } from 'react';
import { CheckCircle, User, MapPin, Truck, CreditCard, Package, Sparkles, X, AlertCircle } from 'lucide-react';
import { CartItem, OrderData } from '../../types';

interface OrderConfirmationStepProps {
  orderData: OrderData;
  items: CartItem[];
  onConfirm: () => void;
}

export function OrderConfirmationStep({ orderData, items, onConfirm }: OrderConfirmationStepProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorType, setErrorType] = useState<'insufficient_funds' | 'invalid_method' | 'bank_rejected'>('insufficient_funds');

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = orderData.shippingMethod?.price || 0;
  const total = subtotal + shipping;

  const handleConfirm = () => {
    setIsProcessing(true);
    
    // Verificar flags anti-bot
    setTimeout(() => {
      if (orderData.paymentInfo?.antibot_insufficient_funds) {
        setIsProcessing(false);
        setErrorType('insufficient_funds');
        setShowErrorModal(true);
        return;
      }
      
      if (orderData.paymentInfo?.antibot_invalid_method) {
        setIsProcessing(false);
        setErrorType('invalid_method');
        setShowErrorModal(true);
        return;
      }
      
      if (orderData.paymentInfo?.antibot_bank_rejected) {
        setIsProcessing(false);
        setErrorType('bank_rejected');
        setShowErrorModal(true);
        return;
      }
      
      // Si no hay errores, proceder con la orden
      onConfirm();
    }, 2000);
  };

  const maskCardNumber = (cardNumber: string) => {
    const cleaned = cardNumber.replace(/\s/g, '');
    return `**** **** **** ${cleaned.slice(-4)}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#73C2FB' }}>
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-gray-900 mb-2">Confirma tu orden</h2>
          <p className="text-gray-600 text-sm flex items-center justify-center gap-2">
            <span>✦</span>
            Revisa que toda la información sea correcta
            <span>✦</span>
          </p>
        </div>

        <div className="space-y-6">
          {/* Datos Personales */}
          {orderData.customerInfo && (
            <div className="p-6 rounded-lg border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <User className="w-5 h-5 text-gray-600" />
                <h3 className="text-gray-900">Datos personales</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Nombre completo</p>
                  <p className="text-gray-900">
                    {orderData.customerInfo.firstName} {orderData.customerInfo.paternalLastName} {orderData.customerInfo.maternalLastName}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Email de contacto</p>
                  <p className="text-gray-900">{orderData.guestEmail || orderData.customerInfo.email}</p>
                </div>
                <div>
                  <p className="text-gray-600">Teléfono</p>
                  <p className="text-gray-900">{orderData.customerInfo.phone}</p>
                </div>
              </div>
            </div>
          )}

          {/* Dirección de Envío */}
          {orderData.shippingAddress && (
            <div className="p-6 rounded-lg border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-5 h-5 text-gray-600" />
                <h3 className="text-gray-900">Dirección de envío</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Calle</p>
                    <p className="text-gray-900">{orderData.shippingAddress.street}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Número</p>
                    <p className="text-gray-900">{orderData.shippingAddress.number}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Colonia</p>
                    <p className="text-gray-900">{orderData.shippingAddress.colony}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Código Postal</p>
                    <p className="text-gray-900">{orderData.shippingAddress.zipCode}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Municipio</p>
                    <p className="text-gray-900">{orderData.shippingAddress.municipality}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Estado</p>
                    <p className="text-gray-900">{orderData.shippingAddress.state}</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-200 mt-2">
                  <p className="text-gray-600">Dirección completa</p>
                  <p className="text-gray-900">
                    {orderData.shippingAddress.street} {orderData.shippingAddress.number}, {orderData.shippingAddress.colony}, {orderData.shippingAddress.municipality}, {orderData.shippingAddress.state}, CP {orderData.shippingAddress.zipCode}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Método de Envío */}
          {orderData.shippingMethod && (
            <div className="p-6 rounded-lg border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <Truck className="w-5 h-5 text-gray-600" />
                <h3 className="text-gray-900">Método de envío</h3>
              </div>
              <div className="flex items-center justify-between text-sm">
                <p className="text-gray-900">{orderData.shippingMethod.method}</p>
                <p className="text-gray-900">${orderData.shippingMethod.price} MXN</p>
              </div>
            </div>
          )}

          {/* Método de Pago */}
          {orderData.paymentInfo && (
            <div className="p-6 rounded-lg border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="w-5 h-5 text-gray-600" />
                <h3 className="text-gray-900">Método de pago</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Titular de la tarjeta</p>
                  <p className="text-gray-900">{orderData.paymentInfo.cardHolder}</p>
                </div>
                <div>
                  <p className="text-gray-600">Número de tarjeta</p>
                  <p className="text-gray-900">{maskCardNumber(orderData.paymentInfo.cardNumber)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Fecha de vencimiento</p>
                  <p className="text-gray-900">{orderData.paymentInfo.expiryDate}</p>
                </div>
              </div>
            </div>
          )}

          {/* Productos */}
          <div className="p-6 rounded-lg border-2 border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-5 h-5 text-gray-600" />
              <h3 className="text-gray-900">Productos ({items.length})</h3>
            </div>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="text-gray-900 text-sm">{item.name}</p>
                    <p className="text-gray-600 text-xs">Cantidad: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-900">${(item.price * item.quantity).toFixed(2)} MXN</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resumen de Pago */}
          <div className="p-6 rounded-lg" style={{ backgroundColor: '#73C2FB' }}>
            <div className="space-y-3">
              <div className="flex justify-between text-white">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)} MXN</span>
              </div>
              <div className="flex justify-between text-white">
                <span>Envío</span>
                <span>${shipping.toFixed(2)} MXN</span>
              </div>
              <div className="border-t-2 border-white/30 pt-3">
                <div className="flex justify-between text-white">
                  <span>Total</span>
                  <span>${total.toFixed(2)} MXN</span>
                </div>
              </div>
            </div>
          </div>

          {/* Botón de Confirmación */}
          <button
            onClick={handleConfirm}
            disabled={isProcessing}
            className="w-full px-6 py-4 rounded-lg text-white transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ backgroundColor: '#7B4FA6' }}
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Procesando pago...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Confirmar y pagar
              </>
            )}
          </button>
        </div>
      </div>

      {/* Modal de Error */}
      {showErrorModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setShowErrorModal(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#FF4C4C' + '20' }}
                >
                  <AlertCircle className="w-6 h-6" style={{ color: '#FF4C4C' }} />
                </div>
                <div>
                  <h3 className="text-gray-900">Pago fallido</h3>
                </div>
              </div>
              <button 
                onClick={() => setShowErrorModal(false)} 
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div 
              className="p-4 rounded-lg mb-6"
              style={{ backgroundColor: '#FF4C4C' + '10' }}
            >
              {errorType === 'insufficient_funds' && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-700">
                    <strong>Fondos insuficientes</strong>
                  </p>
                  <p className="text-xs text-gray-600">
                    Tu banco ha rechazado la transacción por fondos insuficientes. Por favor, verifica tu saldo o utiliza otro método de pago.
                  </p>
                </div>
              )}
              {errorType === 'invalid_method' && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-700">
                    <strong>Método de pago inválido</strong>
                  </p>
                  <p className="text-xs text-gray-600">
                    Los datos de tu tarjeta no pudieron ser validados. Por favor, verifica el número de tarjeta, fecha de vencimiento y CVV.
                  </p>
                </div>
              )}
              {errorType === 'bank_rejected' && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-700">
                    <strong>Transacción rechazada por el banco</strong>
                  </p>
                  <p className="text-xs text-gray-600">
                    Tu banco ha rechazado esta transacción. Por favor, contacta a tu institución bancaria o intenta con otra tarjeta.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-600 mb-6">
              <span>✦</span>
              <p>
                {(errorType === 'insufficient_funds' || errorType === 'invalid_method' || errorType === 'bank_rejected') && 'Puedes volver atrás para modificar tu método de pago'}
              </p>
              <span>✦</span>
            </div>

            <button
              onClick={() => setShowErrorModal(false)}
              className="w-full px-6 py-3 rounded-lg text-white transition-all hover:shadow-md"
              style={{ backgroundColor: '#7B4FA6' }}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}