export type EmailStatus = 'sent' | 'failed' | 'retrying' | 'pending';

export type EmailEventType = 
  | 'order_confirmation'
  | 'shipping_notification'
  | 'delivery_confirmation'
  | 'password_reset'
  | 'account_activation'
  | 'account_reactivation'
  | 'stock_alert';

export interface EmailLog {
  id: string;
  eventType: EmailEventType;
  recipient: string;
  subject: string;
  status: EmailStatus;
  timestamp: string;
  retryCount: number;
  maxRetries: number;
  errorMessage?: string;
  templateId: string;
  metadata?: Record<string, any>;
  deliveryTime?: number; // milliseconds
  nextRetryAt?: string;
}

export interface EmailMetrics {
  totalSent: number;
  totalFailed: number;
  totalRetrying: number;
  totalPending: number;
  successRate: number;
  averageDeliveryTime: number; // milliseconds
  failuresByType: Record<EmailEventType, number>;
  sentByType: Record<EmailEventType, number>;
}

export interface EmailTemplate {
  id: string;
  name: string;
  eventType: EmailEventType;
  subject: string;
  htmlContent: string;
  placeholders: string[];
  isValid: boolean;
  validationErrors: string[];
  lastModified: string;
  usageCount: number;
}

export interface RetryPolicy {
  maxRetries: number;
  retryIntervalMinutes: number;
  backoffMultiplier: number;
}

export const DEFAULT_RETRY_POLICY: RetryPolicy = {
  maxRetries: 3,
  retryIntervalMinutes: 5,
  backoffMultiplier: 2
};

export const getEventTypeText = (type: EmailEventType): string => {
  const texts: Record<EmailEventType, string> = {
    order_confirmation: 'Confirmación de Pedido',
    shipping_notification: 'Notificación de Envío',
    delivery_confirmation: 'Confirmación de Entrega',
    password_reset: 'Recuperación de Contraseña',
    account_activation: 'Activación de Cuenta',
    account_reactivation: 'Reactivación de Cuenta',
    stock_alert: 'Alerta de Stock'
  };
  return texts[type];
};

export const getEventTypeIcon = (type: EmailEventType): string => {
  const icons: Record<EmailEventType, string> = {
    order_confirmation: '📦',
    shipping_notification: '🚚',
    delivery_confirmation: '✅',
    password_reset: '🔑',
    account_activation: '👤',
    account_reactivation: '🔄',
    stock_alert: '🔔'
  };
  return icons[type];
};

export const getStatusText = (status: EmailStatus): string => {
  const texts: Record<EmailStatus, string> = {
    sent: 'Enviado',
    failed: 'Fallido',
    retrying: 'Reintentando',
    pending: 'Pendiente'
  };
  return texts[status];
};

export const getStatusColor = (status: EmailStatus): string => {
  const colors: Record<EmailStatus, string> = {
    sent: '#50C878',
    failed: '#FF4C4C',
    retrying: '#F0E68C',
    pending: '#73C2FB'
  };
  return colors[status];
};

// Errores comunes de envío
export const EMAIL_ERRORS = {
  INVALID_RECIPIENT: 'Dirección de correo inválida',
  TEMPLATE_ERROR: 'Error en la plantilla',
  NETWORK_ERROR: 'Error de conexión',
  RATE_LIMIT: 'Límite de tasa excedido',
  TIMEOUT: 'Tiempo de espera agotado',
  PLACEHOLDER_MISSING: 'Placeholder faltante en plantilla',
  SMTP_ERROR: 'Error del servidor SMTP'
};

// Simulación de envío de email
export const simulateEmailSend = (): { success: boolean; deliveryTime: number; error?: string } => {
  const random = Math.random();
  const deliveryTime = Math.floor(Math.random() * 3000) + 500; // 500-3500ms
  
  // 90% de éxito
  if (random > 0.1) {
    return { success: true, deliveryTime };
  }
  
  // 10% de fallo con diferentes errores
  const errors = Object.values(EMAIL_ERRORS);
  const error = errors[Math.floor(Math.random() * errors.length)];
  
  return { success: false, deliveryTime: 0, error };
};

// Extraer placeholders de una plantilla
export const extractPlaceholders = (template: string): string[] => {
  const regex = /\{\{(\w+)\}\}/g;
  const placeholders: string[] = [];
  let match;
  
  while ((match = regex.exec(template)) !== null) {
    if (!placeholders.includes(match[1])) {
      placeholders.push(match[1]);
    }
  }
  
  return placeholders;
};

// Validar plantilla
export const validateTemplate = (template: EmailTemplate): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!template.subject.trim()) {
    errors.push('El asunto no puede estar vacío');
  }
  
  if (!template.htmlContent.trim()) {
    errors.push('El contenido no puede estar vacío');
  }
  
  // Validar que los placeholders estén correctamente formados
  const malformedPlaceholders = template.htmlContent.match(/\{\{[^}]*$/g);
  if (malformedPlaceholders) {
    errors.push('Placeholders mal formados detectados');
  }
  
  // Validar placeholders esenciales por tipo de evento
  const requiredPlaceholders: Record<EmailEventType, string[]> = {
    order_confirmation: ['orderNumber', 'customerName'],
    shipping_notification: ['orderNumber', 'trackingNumber'],
    delivery_confirmation: ['orderNumber', 'customerName'],
    password_reset: ['resetLink', 'customerName'],
    account_activation: ['activationLink', 'customerName'],
    account_reactivation: ['reactivationLink', 'customerName'],
    stock_alert: ['productName', 'customerName']
  };
  
  const required = requiredPlaceholders[template.eventType] || [];
  const existing = extractPlaceholders(template.htmlContent + template.subject);
  
  const missing = required.filter(p => !existing.includes(p));
  if (missing.length > 0) {
    errors.push(`Placeholders requeridos faltantes: ${missing.join(', ')}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
