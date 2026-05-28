import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  ExternalLink, 
  AlertCircle, 
  MessageCircle,
  Copy,
  CheckCircle,
  Calendar,
  MapPin,
  Compass
} from 'lucide-react';
import { OrderTimeline } from './OrderTimeline';
import { TrackingInfo, OrderStatus, getStatusText, getStatusColor, generateMockTracking } from '../../types/tracking';
import { CartItem, OrderData } from '../../types';

interface OrderTrackingPageProps {
  orderNumber: string;
  items: CartItem[];
  orderData: OrderData;
  onBack: () => void;
  status?: OrderStatus;
}

export function OrderTrackingPage({ 
  orderNumber, 
  items,
  orderData,
  onBack,
  status = 'in_transit'
}: OrderTrackingPageProps) {
  const [tracking, setTracking] = useState<TrackingInfo | null>(null);
  const [copiedTracking, setCopiedTracking] = useState(false);
  const [copiedOrder, setCopiedOrder] = useState(false);

  useEffect(() => {
    // Simular carga de información de tracking
    const mockTracking = generateMockTracking(orderNumber, status);
    setTracking(mockTracking);
  }, [orderNumber, status]);

  const handleCopyTracking = () => {
    if (tracking) {
      navigator.clipboard.writeText(tracking.trackingNumber);
      setCopiedTracking(true);
      setTimeout(() => setCopiedTracking(false), 2000);
    }
  };

  const handleCopyOrder = () => {
    navigator.clipboard.writeText(orderNumber);
    setCopiedOrder(true);
    setTimeout(() => setCopiedOrder(false), 2000);
  };

  const handleContactSupport = () => {
    // En producción, esto abriría un chat o formulario de soporte
    window.location.href = `mailto:soporte@tlahtollistudio.com?subject=Pedido ${orderNumber} - Consulta&body=Número de pedido: ${orderNumber}%0D%0ANúmero de seguimiento: ${tracking?.trackingNumber}%0D%0A%0D%0ADescribe tu consulta:`;
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Por confirmar';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = orderData.shippingMethod?.price || 0;
  const finalTotal = total + shipping;

  const isLost = tracking?.currentStatus === 'lost';
  const isDelivered = tracking?.currentStatus === 'delivered';
  const statusColor = tracking ? getStatusColor(tracking.currentStatus) : '#73C2FB';

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFDD0' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </button>

        {/* Título principal */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Compass className="w-8 h-8" style={{ color: statusColor }} />
            <h1 className="text-gray-900">Camino del Aventurero</h1>
            <Compass className="w-8 h-8" style={{ color: statusColor }} />
          </div>
          <p className="text-gray-600 flex items-center justify-center gap-2">
            <span>✦</span>
            Rastrea el viaje de tus tesoros
            <span>✦</span>
          </p>
        </div>

        {/* Estado del pedido extraviado */}
        {isLost && (
          <div 
            className="bg-white rounded-lg shadow-sm p-6 mb-6 border-2"
            style={{ borderColor: '#FF4C4C' }}
          >
            <div className="flex items-start gap-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#FF4C4C' }}
              >
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-gray-900 mb-2" style={{ color: '#FF4C4C' }}>
                  Pedido Extraviado
                </h2>
                <p className="text-gray-600 mb-4">
                  Lamentamos informar que tu pedido ha sido marcado como extraviado durante el transporte. 
                  Nuestro equipo de soporte está aquí para ayudarte a resolver esta situación.
                </p>
                <div 
                  className="p-4 rounded-lg mb-4"
                  style={{ backgroundColor: '#FF4C4C' + '20' }}
                >
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>¿Qué hacer ahora?</strong>
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Contacta a nuestro equipo de soporte para iniciar el proceso de resolución</li>
                    <li>• Recibirás un reembolso completo o un reenvío de tu pedido</li>
                    <li>• El proceso de resolución toma de 3 a 5 días hábiles</li>
                  </ul>
                </div>
                <button
                  onClick={handleContactSupport}
                  className="px-6 py-3 rounded-lg text-white transition-all hover:shadow-md flex items-center gap-2"
                  style={{ backgroundColor: '#FF4C4C' }}
                >
                  <MessageCircle className="w-5 h-5" />
                  Contactar Soporte
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Estado entregado */}
        {isDelivered && (
          <div 
            className="bg-white rounded-lg shadow-sm p-6 mb-6 border-2"
            style={{ borderColor: '#50C878' }}
          >
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#50C878' }}
              >
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-gray-900 mb-1" style={{ color: '#50C878' }}>
                  ¡Pedido Entregado!
                </h2>
                <p className="text-gray-600">
                  Tu tesoro ha llegado a su destino. ¡Esperamos que disfrutes de tu compra! 🎉
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Información del pedido */}
          <div className="lg:col-span-1 space-y-6">
            {/* Información del pedido */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5" style={{ color: '#73C2FB' }} />
                <h2 className="text-gray-900">Información del Pedido</h2>
              </div>

              <div className="space-y-4">
                {/* Número de pedido */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Número de Pedido</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-3 py-2 bg-gray-50 rounded text-sm font-mono text-gray-900">
                      {orderNumber}
                    </code>
                    <button
                      onClick={handleCopyOrder}
                      className="p-2 rounded hover:bg-gray-100 transition-colors"
                      title="Copiar número de pedido"
                    >
                      {copiedOrder ? (
                        <CheckCircle className="w-4 h-4" style={{ color: '#50C878' }} />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Número de seguimiento */}
                {tracking && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Número de Seguimiento</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-3 py-2 bg-gray-50 rounded text-sm font-mono text-gray-900">
                        {tracking.trackingNumber}
                      </code>
                      <button
                        onClick={handleCopyTracking}
                        className="p-2 rounded hover:bg-gray-100 transition-colors"
                        title="Copiar número de seguimiento"
                      >
                        {copiedTracking ? (
                          <CheckCircle className="w-4 h-4" style={{ color: '#50C878' }} />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Paquetería */}
                {tracking && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Paquetería</p>
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4" style={{ color: '#73C2FB' }} />
                      <span className="text-gray-900">{tracking.carrier}</span>
                    </div>
                    <a
                      href={tracking.carrierUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-2 text-sm transition-colors hover:underline"
                      style={{ color: '#73C2FB' }}
                    >
                      Rastrear en {tracking.carrier}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}

                {/* Fecha estimada de entrega */}
                {tracking?.estimatedDelivery && !isDelivered && !isLost && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Entrega Estimada</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" style={{ color: '#F0E68C' }} />
                      <span className="text-gray-900">{formatDate(tracking.estimatedDelivery)}</span>
                    </div>
                  </div>
                )}

                {/* Estado actual */}
                {tracking && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Estado Actual</p>
                    <div 
                      className="px-4 py-2 rounded-lg flex items-center gap-2"
                      style={{ backgroundColor: statusColor + '20', color: statusColor }}
                    >
                      <span className="text-lg">{getStatusText(tracking.currentStatus)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Productos */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-gray-900 mb-4">Productos ({items.length})</h3>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.rarity}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-gray-600">Cantidad: {item.quantity}</p>
                        <p className="text-sm text-gray-900">${item.price * item.quantity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t mt-4 pt-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">${total} MXN</span>
                </div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Envío</span>
                  <span className="text-gray-900">${shipping} MXN</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">${finalTotal} MXN</span>
                </div>
              </div>
            </div>

            {/* Dirección de envío */}
            {orderData.shippingAddress && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5" style={{ color: '#73C2FB' }} />
                  <h3 className="text-gray-900">Dirección de Envío</h3>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>{orderData.shippingAddress.address}</p>
                  <p>{orderData.shippingAddress.city}, {orderData.shippingAddress.state}</p>
                  <p>C.P. {orderData.shippingAddress.zipCode}</p>
                </div>
              </div>
            )}
          </div>

          {/* Columna derecha - Timeline */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-gray-900 mb-6">Ruta del Pedido</h2>
              {tracking ? (
                <OrderTimeline events={tracking.events} />
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4" style={{ backgroundColor: '#73C2FB' + '20' }}>
                    <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" style={{ color: '#73C2FB' }} />
                  </div>
                  <p className="text-gray-600">Cargando información de seguimiento...</p>
                </div>
              )}
            </div>

            {/* Ayuda adicional */}
            {!isLost && (
              <div 
                className="mt-6 p-4 rounded-lg border"
                style={{ backgroundColor: '#73C2FB' + '20', borderColor: '#73C2FB' }}
              >
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#73C2FB' }} />
                  <div>
                    <p className="text-sm mb-2" style={{ color: '#73C2FB' }}>
                      <strong>¿Necesitas ayuda?</strong>
                    </p>
                    <p className="text-xs text-gray-600 mb-3">
                      Si tienes alguna pregunta sobre tu pedido o necesitas asistencia, nuestro equipo de soporte está disponible para ayudarte.
                    </p>
                    <button
                      onClick={handleContactSupport}
                      className="text-sm px-4 py-2 rounded-lg border-2 transition-all hover:shadow-sm"
                      style={{ borderColor: '#73C2FB', color: '#73C2FB' }}
                    >
                      Contactar Soporte
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
