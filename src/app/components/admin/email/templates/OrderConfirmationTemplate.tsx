import React from 'react';
import { Package, MapPin, Mail } from 'lucide-react';

export function OrderConfirmationTemplate() {
  return (
    <div className="bg-gray-50 p-8 font-sans">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-8 text-center" style={{ backgroundColor: '#F4F0F8' }}>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#7B4FA6' }}>
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl text-gray-900 mb-2">¡Gracias por tu compra!</h1>
          <p className="text-gray-600">Tu pedido ha sido recibido exitosamente</p>
        </div>

        {/* Order Number */}
        <div className="px-8 py-6 bg-white border-b border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Número de Pedido</p>
            <p className="text-2xl text-gray-900">#TN89F2</p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="px-8 py-6 border-b border-gray-200">
          <h2 className="text-lg text-gray-900 mb-4">Resumen de tu Pedido</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <div>
                <p className="text-gray-900">Taza del Guardián</p>
                <p className="text-sm text-gray-600">Cantidad: 1</p>
              </div>
              <p className="text-gray-900">$299.00 MXN</p>
            </div>
            <div className="flex justify-between items-center py-2">
              <div>
                <p className="text-gray-900">Playera Legendaria</p>
                <p className="text-sm text-gray-600">Cantidad: 2</p>
              </div>
              <p className="text-gray-900">$798.00 MXN</p>
            </div>
          </div>
        </div>

        {/* Totals */}
        <div className="px-8 py-6 bg-gray-50 border-b border-gray-200">
          <div className="space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span>$1,097.00 MXN</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Envío</span>
              <span>$99.00 MXN</span>
            </div>
            <div className="flex justify-between text-lg pt-2 border-t border-gray-300">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">$1,196.00 MXN</span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="px-8 py-6 border-b border-gray-200">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <h3 className="text-sm text-gray-900 mb-2">Dirección de Envío</h3>
              <p className="text-sm text-gray-600">Juan Pérez</p>
              <p className="text-sm text-gray-600">Calle Ejemplo 123</p>
              <p className="text-sm text-gray-600">Colonia Centro, Ciudad de México</p>
              <p className="text-sm text-gray-600">CP 06000</p>
            </div>
          </div>
        </div>

        {/* Tracking Button */}
        <div className="px-8 py-6 text-center">
          <a
            href="#"
            className="inline-block px-6 py-3 rounded-lg text-white no-underline transition-all hover:shadow-md"
            style={{ backgroundColor: '#7B4FA6' }}
          >
            Ver mi Pedido
          </a>
          <p className="text-xs text-gray-600 mt-4">
            Recibirás un email cuando tu pedido sea enviado
          </p>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-gray-50 text-center border-t border-gray-200">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Mail className="w-4 h-4 text-gray-400" />
            <p className="text-sm text-gray-600">
              ¿Necesitas ayuda? Contáctanos en soporte@tonalli.com
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            © 2025 Tlahtolli Studio. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
