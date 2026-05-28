import React from 'react';
import { Package, MapPin, CreditCard, DollarSign, ShoppingBag, CheckCircle, ArrowLeft, Sparkles } from 'lucide-react';
import { CartItem, OrderData } from '../../types';
import { PaymentMethod } from '../../types/payment';

interface OrderConfirmationPreviewProps {
  orderData: OrderData;
  items: CartItem[];
  selectedMethod: PaymentMethod;
  paymentDetails?: {
    cardHolder: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  };
  onConfirm: () => void;
  onBack: () => void;
}

export function OrderConfirmationPreview({ 
  orderData, 
  items, 
  selectedMethod,
  paymentDetails,
  onConfirm, 
  onBack 
}: OrderConfirmationPreviewProps) {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = orderData.shippingMethod?.price || 99;
  const total = subtotal + shipping;

  const getMaskedCardNumber = (cardNumber: string) => {
    const cleaned = cardNumber.replace(/\s/g, '');
    return `•••• •••• •••• ${cleaned.slice(-4)}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="text-center mb-8">
          <div 
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{ backgroundColor: '#50C878' }}
          >
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-gray-900 mb-2">Confirmar Pedido</h2>
          <p className="text-gray-600 flex items-center justify-center gap-2">
            <span>✦</span>
            Revisa tu orden antes de finalizar
            <span>✦</span>
          </p>
        </div>

        <div 
          className="p-4 rounded-lg mb-6 border"
          style={{ backgroundColor: '#F0F9FF', borderColor: '#73C2FB' }}
        >
          <p className="text-sm text-gray-700 text-center">
            <strong>⚡ Último paso:</strong> Verifica que todos los datos sean correctos antes de proceder al pago
          </p>
        </div>

        {/* Resumen de productos */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag className="w-5 h-5" style={{ color: '#50C878' }} />
            <h3 className="text-gray-900">Productos ({items.length})</h3>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-white border border-gray-200 overflow-hidden flex-shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">Cantidad: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                  {item.quantity > 1 && (
                    <p className="text-xs text-gray-500">${item.price.toFixed(2)} c/u</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dirección de envío */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5" style={{ color: '#50C878' }} />
            <h3 className="text-gray-900">Dirección de Envío</h3>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            {orderData.shippingAddress ? (
              <>
                <p className="text-sm text-gray-900 mb-1">
                  {orderData.shippingAddress.street} {orderData.shippingAddress.number}
                </p>
                <p className="text-sm text-gray-600">
                  {orderData.shippingAddress.colony}, {orderData.shippingAddress.municipality}
                </p>
                <p className="text-sm text-gray-600">
                  {orderData.shippingAddress.state} - CP {orderData.shippingAddress.zipCode}
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-500 italic">Sin dirección especificada</p>
            )}
          </div>
        </div>

        {/* Método de envío */}
        {orderData.shippingMethod && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5" style={{ color: '#50C878' }} />
              <h3 className="text-gray-900">Método de Envío</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-900">{orderData.shippingMethod.method}</p>
                <p className="text-xs text-gray-500">Entrega estimada: 3-5 días hábiles</p>
              </div>
              <p className="text-sm" style={{ color: '#50C878' }}>
                ${orderData.shippingMethod.price.toFixed(2)}
              </p>
            </div>
          </div>
        )}

        {/* Método de pago */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5" style={{ color: '#50C878' }} />
            <h3 className="text-gray-900">Método de Pago</h3>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">{selectedMethod.icon}</div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{selectedMethod.name}</p>
                <p className="text-xs text-gray-500">{selectedMethod.description}</p>
              </div>
            </div>
            {paymentDetails && paymentDetails.cardNumber !== '0000 0000 0000 0000' && (
              <div className="border-t border-gray-200 pt-3 mt-3">
                <p className="text-xs text-gray-500 mb-1">Tarjeta registrada</p>
                <p className="text-sm text-gray-900 font-mono">
                  {getMaskedCardNumber(paymentDetails.cardNumber)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {paymentDetails.cardHolder}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Resumen de totales */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5" style={{ color: '#50C878' }} />
            <h3 className="text-gray-900">Resumen de Pago</h3>
          </div>
          <div 
            className="rounded-lg p-4 space-y-2"
            style={{ backgroundColor: '#73C2FB20', border: '2px solid #73C2FB' }}
          >
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="text-gray-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Envío:</span>
              <span className="text-gray-900">${shipping.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-300 pt-2 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-900">
                  <strong>Total a pagar:</strong>
                </span>
                <span className="text-2xl" style={{ color: '#73C2FB' }}>
                  <strong>${total.toFixed(2)} MXN</strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="space-y-3">
          <button
            onClick={onConfirm}
            className="w-full px-6 py-4 rounded-lg text-white transition-all hover:shadow-md flex items-center justify-center gap-2"
            style={{ backgroundColor: '#50C878' }}
          >
            <Sparkles className="w-5 h-5" />
            Procesar Pago de ${total.toFixed(2)}
          </button>
          <button
            onClick={onBack}
            className="w-full px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Regresar a editar
          </button>
        </div>

        {/* Información de seguridad */}
        <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#F0E68C' }}>
          <p className="text-xs text-gray-700 text-center">
            🔒 Tu información está protegida con encriptación de nivel bancario. 
            El pago será procesado de forma segura.
          </p>
        </div>
      </div>
    </div>
  );
}
