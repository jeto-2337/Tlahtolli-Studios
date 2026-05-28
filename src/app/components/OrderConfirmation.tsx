import React from 'react';
import { CheckCircle, Mail, Package, Truck } from 'lucide-react';
import { CartItem, OrderData } from '../types';

interface OrderConfirmationProps {
  orderNumber: string;
  items: CartItem[];
  orderData: OrderData;
  total: number;
  onViewEmailPreview: () => void;
  onBackToHome: () => void;
  onTrackOrder?: () => void;
}

export function OrderConfirmation({ 
  orderNumber, 
  items, 
  orderData, 
  total,
  onViewEmailPreview,
  onBackToHome,
  onTrackOrder
}: OrderConfirmationProps) {
  return (
    <div className="min-h-screen py-12" style={{ backgroundColor: '#FFFDD0' }}>
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 relative" style={{ backgroundColor: '#50C878' }}>
            <Package className="w-12 h-12 text-white" />
            <CheckCircle className="w-8 h-8 text-white absolute -bottom-2 -right-2" style={{ backgroundColor: '#50C878' }} />
          </div>
          <h1 className="text-gray-900 mb-2">¡Pedido exitoso!</h1>
          <p className="text-gray-600 flex items-center justify-center gap-2">
            <span>✦</span>
            Tu tesoro ha sido reclamado exitosamente
            <span>✦</span>
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b">
            <span className="text-gray-600">Código de pedido</span>
            <span className="text-gray-900 flex items-center gap-2">
              <span>✦</span>
              #{orderNumber}
            </span>
          </div>
          
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-gray-900">{item.name}</div>
                  <div className="text-sm text-gray-600">Cantidad: {item.quantity}</div>
                </div>
                <div className="text-gray-900">${item.price * item.quantity} MXN</div>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-900">Total:</span>
              <span className="text-gray-900" style={{ color: '#73C2FB' }}>${total} MXN</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 space-y-4">
          <h3 className="text-gray-900">Información de envío</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Estado:</span>
              <span 
                className="px-2 py-1 rounded text-xs"
                style={{ backgroundColor: '#F0E68C' }}
              >
                Pendiente de envío
              </span>
            </div>
            <div className="text-gray-700 ml-6">
              {orderData.shippingAddress?.street} {orderData.shippingAddress?.number}<br />
              {orderData.shippingAddress?.colony}<br />
              {orderData.shippingAddress?.municipality}, {orderData.shippingAddress?.state}<br />
              CP: {orderData.shippingAddress?.zipCode}
            </div>
            <div className="text-gray-600 ml-6">
              Método: {orderData.shippingMethod?.method}
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-6 mb-6 border" style={{ borderColor: '#73C2FB' }}>
          <div className="flex items-start gap-3">
            <Mail className="w-6 h-6 flex-shrink-0" style={{ color: '#73C2FB' }} />
            <div>
              <h3 className="text-gray-900 mb-1">Confirmación enviada</h3>
              <p className="text-sm text-gray-600 mb-3">
                Hemos enviado un correo de confirmación a <span className="text-gray-900">{orderData.customerInfo?.email}</span> con los detalles de tu pedido y el número de seguimiento cuando esté disponible.
              </p>
              <button
                onClick={onViewEmailPreview}
                className="text-sm underline"
                style={{ color: '#73C2FB' }}
              >
                Ver vista previa del correo
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onBackToHome}
            className="flex-1 px-6 py-3 rounded-lg text-white transition-all hover:shadow-md"
            style={{ backgroundColor: '#50C878' }}
          >
            Volver a la tienda
          </button>
          <button
            className="flex-1 px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Ver mis pedidos
          </button>
          {onTrackOrder && (
            <button
              onClick={onTrackOrder}
              className="flex-1 px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Rastrear pedido
            </button>
          )}
        </div>
      </div>
    </div>
  );
}