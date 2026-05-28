import React from 'react';
import { X, Sword, Package, MapPin, CreditCard } from 'lucide-react';
import { CartItem, OrderData } from '../types';

interface EmailPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
  items: CartItem[];
  orderData: OrderData;
  total: number;
}

export function EmailPreview({ 
  isOpen, 
  onClose, 
  orderNumber, 
  items, 
  orderData, 
  total 
}: EmailPreviewProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8">
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white rounded-t-lg z-10">
          <h3 className="text-gray-900">Vista previa del correo</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-8" style={{ backgroundColor: '#FFFDD0' }}>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="text-center py-8 px-6" style={{ backgroundColor: '#50C878' }}>
              <div className="flex items-center justify-center gap-2 mb-3">
                <Sword className="w-8 h-8 text-white" />
                <span className="text-white text-2xl">Epic Quest Store</span>
              </div>
              <h1 className="text-white mb-2">¡Tu pedido ha sido confirmado!</h1>
              <p className="text-white text-opacity-90">
                Gracias por tu compra, {orderData.customerInfo?.firstName} {orderData.customerInfo?.paternalLastName}
              </p>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="text-center">
                <div className="inline-block px-4 py-2 rounded-lg mb-2" style={{ backgroundColor: '#F0E68C' }}>
                  <span className="text-gray-900">Pedido #{orderNumber}</span>
                </div>
                <p className="text-gray-600">
                  {new Date().toLocaleDateString('es-MX', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              
              <div className="border rounded-lg p-4" style={{ borderColor: '#73C2FB' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Package className="w-5 h-5" style={{ color: '#73C2FB' }} />
                  <h3 className="text-gray-900">Estado del pedido</h3>
                </div>
                <div 
                  className="inline-block px-3 py-1 rounded text-sm"
                  style={{ backgroundColor: '#F0E68C' }}
                >
                  Pendiente de envío
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Tu pedido está siendo preparado. Te notificaremos cuando sea enviado con el número de seguimiento.
                </p>
              </div>
              
              <div>
                <h3 className="text-gray-900 mb-4">Resumen del pedido</h3>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div className="flex-1">
                        <div className="text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-600">
                          {item.collection} • Cantidad: {item.quantity}
                        </div>
                      </div>
                      <div className="text-gray-900">${item.price * item.quantity} MXN</div>
                    </div>
                  ))}
                  
                  <div className="flex items-center justify-between pt-3">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">${total} MXN</span>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-gray-600" />
                    <h3 className="text-gray-900">Dirección de envío</h3>
                  </div>
                  <div className="text-sm text-gray-700">
                    {orderData.shippingAddress?.street} {orderData.shippingAddress?.number}<br />
                    {orderData.shippingAddress?.colony}<br />
                    {orderData.shippingAddress?.municipality}, {orderData.shippingAddress?.state}<br />
                    CP: {orderData.shippingAddress?.zipCode}
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    <h3 className="text-gray-900">Método de pago</h3>
                  </div>
                  <div className="text-sm text-gray-700">
                    Tarjeta de crédito/débito<br />
                    <span className="text-gray-600">Pago procesado exitosamente</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center pt-4">
                <button 
                  className="px-6 py-3 rounded-lg text-white transition-all hover:shadow-md"
                  style={{ backgroundColor: '#50C878' }}
                >
                  Rastrear mi pedido
                </button>
              </div>
              
              <div className="text-center text-sm text-gray-600 pt-4 border-t">
                <p>¿Necesitas ayuda? Contáctanos en soporte@epicquest.store</p>
                <p className="mt-2">© 2025 Epic Quest Store. Todos los derechos reservados.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}