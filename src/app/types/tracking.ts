export type OrderStatus = 
  | 'confirmed'
  | 'shipped'
  | 'in_transit'
  | 'delivered'
  | 'lost';

export interface TrackingEvent {
  id: string;
  status: OrderStatus;
  title: string;
  description: string;
  timestamp: string;
  location?: string;
  isCompleted: boolean;
}

export interface TrackingInfo {
  trackingNumber: string;
  carrier: string;
  carrierUrl: string;
  estimatedDelivery?: string;
  currentStatus: OrderStatus;
  events: TrackingEvent[];
}

export interface OrderTracking {
  orderNumber: string;
  createdAt: string;
  trackingInfo?: TrackingInfo;
  supportMessage?: string;
}

export const getStatusText = (status: OrderStatus): string => {
  const texts: Record<OrderStatus, string> = {
    confirmed: 'Confirmado',
    shipped: 'Enviado',
    in_transit: 'En tránsito',
    delivered: 'Entregado',
    lost: 'Extraviado'
  };
  return texts[status];
};

export const getStatusIcon = (status: OrderStatus): string => {
  const icons: Record<OrderStatus, string> = {
    confirmed: '✓',
    shipped: '📦',
    in_transit: '🚚',
    delivered: '🏠',
    lost: '⚠️'
  };
  return icons[status];
};

export const getStatusColor = (status: OrderStatus): string => {
  const colors: Record<OrderStatus, string> = {
    confirmed: '#73C2FB',
    shipped: '#50C878',
    in_transit: '#73C2FB',
    delivered: '#50C878',
    lost: '#FF4C4C'
  };
  return colors[status];
};

export const getCarrierUrl = (carrier: string, trackingNumber: string): string => {
  const baseUrls: Record<string, string> = {
    'FedEx': `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`,
    'DHL': `https://www.dhl.com/mx-es/home/rastreo.html?tracking-id=${trackingNumber}`,
    'Estafeta': `https://www.estafeta.com/Rastreo/?numero=${trackingNumber}`,
    'Redpack': `https://www.redpack.com.mx/es/rastreo/?guias=${trackingNumber}`,
    'UPS': `https://www.ups.com/track?tracknum=${trackingNumber}`
  };
  return baseUrls[carrier] || '#';
};

// Simulación de tracking (en producción vendría de una API)
export const generateMockTracking = (orderNumber: string, status: OrderStatus = 'in_transit'): TrackingInfo => {
  const carriers = ['FedEx', 'DHL', 'Estafeta', 'Redpack', 'UPS'];
  const carrier = carriers[Math.floor(Math.random() * carriers.length)];
  const trackingNumber = `TLH${Math.random().toString(36).substr(2, 12).toUpperCase()}`;
  
  const now = new Date();
  const events: TrackingEvent[] = [];

  // Evento 1: Confirmado
  events.push({
    id: 'evt-1',
    status: 'confirmed',
    title: 'Pedido Confirmado',
    description: 'Tu pedido ha sido recibido y confirmado. El gremio ha iniciado la preparación.',
    timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'Tlahtolli Studio - Centro de Distribución',
    isCompleted: true
  });

  // Evento 2: Enviado
  if (['shipped', 'in_transit', 'delivered', 'lost'].includes(status)) {
    events.push({
      id: 'evt-2',
      status: 'shipped',
      title: 'Pedido Enviado',
      description: 'Tu pedido ha sido entregado al mensajero del gremio y está en camino.',
      timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Centro de Distribución - En ruta',
      isCompleted: true
    });
  }

  // Evento 3: En tránsito
  if (['in_transit', 'delivered', 'lost'].includes(status)) {
    events.push({
      id: 'evt-3',
      status: 'in_transit',
      title: 'En Tránsito',
      description: 'Tu pedido está viajando hacia su destino. El mensajero avanza por el camino.',
      timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Centro de Distribución Regional',
      isCompleted: true
    });
  }

  // Evento 4: Entregado o Extraviado
  if (status === 'delivered') {
    events.push({
      id: 'evt-4',
      status: 'delivered',
      title: '¡Entregado!',
      description: '¡Tu tesoro ha llegado a su destino! Esperamos que disfrutes de tu compra.',
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      location: 'Destino Final',
      isCompleted: true
    });
  } else if (status === 'lost') {
    events.push({
      id: 'evt-4',
      status: 'lost',
      title: 'Pedido Extraviado',
      description: 'Lamentamos informar que tu pedido ha sido marcado como extraviado durante el transporte.',
      timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
      location: 'Ubicación desconocida',
      isCompleted: true
    });
  } else {
    events.push({
      id: 'evt-4',
      status: 'delivered',
      title: 'Entrega Pendiente',
      description: 'Tu pedido será entregado pronto en tu ubicación.',
      timestamp: '',
      location: 'Destino Final',
      isCompleted: false
    });
  }

  const estimatedDelivery = status === 'delivered' 
    ? undefined 
    : new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString();

  return {
    trackingNumber,
    carrier,
    carrierUrl: getCarrierUrl(carrier, trackingNumber),
    estimatedDelivery,
    currentStatus: status,
    events
  };
};
