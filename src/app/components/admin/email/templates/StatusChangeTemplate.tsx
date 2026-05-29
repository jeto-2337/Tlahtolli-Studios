import React from 'react';
import { Truck, Package, CheckCircle, MapPin } from 'lucide-react';

export function StatusChangeTemplate() {
  return (
    <div className="bg-gray-50 p-8 font-sans">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-8 text-center" style={{ backgroundColor: '#73C2FB' }}>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white flex items-center justify-center">
            <Truck className="w-8 h-8" style={{ color: '#73C2FB' }} />
          </div>
          <h1 className="text-2xl text-white mb-2">Tu pedido está en camino</h1>
          <p className="text-white/90">Actualización del estado de tu pedido</p>
        </div>

        {/* Status Info */}
        <div className="px-8 py-6 bg-white border-b border-gray-200">
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600 mb-1">Número de Pedido</p>
            <p className="text-xl text-gray-900">#TN89F2</p>
          </div>

          {/* Status Timeline */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#7B4FA6' }}>
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-gray-900">Pedido Confirmado</p>
                <p className="text-sm text-gray-600">03 Dic 2025, 14:30</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#7B4FA6' }}>
                <Package className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-gray-900">Procesando</p>
                <p className="text-sm text-gray-600">03 Dic 2025, 16:45</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#73C2FB' }}>
                <Truck className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-gray-900">Enviado</p>
                <p className="text-sm text-gray-600">04 Dic 2025, 10:20</p>
                <p className="text-sm" style={{ color: '#73C2FB' }}>Estado actual</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-200">
                <MapPin className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-gray-500">En Camino</p>
                <p className="text-sm text-gray-400">Próximo estado</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tracking Info */}
        <div className="px-8 py-6 bg-gray-50 border-b border-gray-200">
          <h3 className="text-sm text-gray-900 mb-3">Información de Rastreo</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Paquetería</span>
              <span className="text-gray-900">DHL Express</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Número de Guía</span>
              <span className="text-gray-900">1234567890123</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Fecha Estimada de Entrega</span>
              <span className="text-gray-900">07 Dic 2025</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="px-8 py-6 text-center">
          <a
            href="#"
            className="inline-block px-6 py-3 rounded-lg text-white no-underline transition-all hover:shadow-md mb-3"
            style={{ backgroundColor: '#73C2FB' }}
          >
            Seguir mi Paquete
          </a>
          <p className="text-xs text-gray-600">
            Haz clic para ver el rastreo en tiempo real
          </p>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-gray-50 text-center border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">
            ¿Necesitas ayuda? Contáctanos en soporte@tonalli.com
          </p>
          <p className="text-xs text-gray-500 mt-4">
            © 2025 Tlahtolli Studio. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
