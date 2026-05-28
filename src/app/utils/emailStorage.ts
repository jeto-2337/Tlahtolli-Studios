import { EmailLog, EmailMetrics, EmailTemplate, EmailEventType, simulateEmailSend, DEFAULT_RETRY_POLICY } from '../types/email';

const LOGS_KEY = 'tlahtolli_email_logs';
const TEMPLATES_KEY = 'tlahtolli_email_templates';

// Logs de email
export const saveEmailLog = (log: EmailLog): void => {
  const logs = getEmailLogs();
  logs.push(log);
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  
  console.log(`
    ═══════════════════════════════════════
    📧 REGISTRO DE CORREO
    ═══════════════════════════════════════
    ID: ${log.id}
    Tipo: ${log.eventType}
    Destinatario: ${log.recipient}
    Estado: ${log.status}
    Reintentos: ${log.retryCount}/${log.maxRetries}
    ${log.errorMessage ? `Error: ${log.errorMessage}` : ''}
    Tiempo: ${new Date(log.timestamp).toLocaleString()}
    ═══════════════════════════════════════
  `);
};

export const getEmailLogs = (): EmailLog[] => {
  const data = localStorage.getItem(LOGS_KEY);
  return data ? JSON.parse(data) : [];
};

export const updateEmailLog = (logId: string, updates: Partial<EmailLog>): void => {
  const logs = getEmailLogs();
  const index = logs.findIndex(log => log.id === logId);
  
  if (index >= 0) {
    logs[index] = { ...logs[index], ...updates };
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  }
};

export const clearEmailLogs = (): void => {
  localStorage.removeItem(LOGS_KEY);
};

// Plantillas
export const saveEmailTemplate = (template: EmailTemplate): void => {
  const templates = getEmailTemplates();
  const index = templates.findIndex(t => t.id === template.id);
  
  if (index >= 0) {
    templates[index] = template;
  } else {
    templates.push(template);
  }
  
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
};

export const getEmailTemplates = (): EmailTemplate[] => {
  const data = localStorage.getItem(TEMPLATES_KEY);
  return data ? JSON.parse(data) : getDefaultTemplates();
};

export const getEmailTemplate = (id: string): EmailTemplate | undefined => {
  const templates = getEmailTemplates();
  return templates.find(t => t.id === id);
};

export const clearEmailTemplates = (): void => {
  localStorage.removeItem(TEMPLATES_KEY);
};

// Métricas
export const calculateMetrics = (): EmailMetrics => {
  const logs = getEmailLogs();
  
  const totalSent = logs.filter(l => l.status === 'sent').length;
  const totalFailed = logs.filter(l => l.status === 'failed').length;
  const totalRetrying = logs.filter(l => l.status === 'retrying').length;
  const totalPending = logs.filter(l => l.status === 'pending').length;
  
  const total = logs.length || 1;
  const successRate = (totalSent / total) * 100;
  
  const deliveryTimes = logs
    .filter(l => l.status === 'sent' && l.deliveryTime)
    .map(l => l.deliveryTime!);
  
  const averageDeliveryTime = deliveryTimes.length > 0
    ? deliveryTimes.reduce((sum, time) => sum + time, 0) / deliveryTimes.length
    : 0;
  
  const failuresByType: Record<EmailEventType, number> = {
    order_confirmation: 0,
    shipping_notification: 0,
    delivery_confirmation: 0,
    password_reset: 0,
    account_activation: 0,
    account_reactivation: 0,
    stock_alert: 0
  };
  
  const sentByType: Record<EmailEventType, number> = {
    order_confirmation: 0,
    shipping_notification: 0,
    delivery_confirmation: 0,
    password_reset: 0,
    account_activation: 0,
    account_reactivation: 0,
    stock_alert: 0
  };
  
  logs.forEach(log => {
    if (log.status === 'failed') {
      failuresByType[log.eventType]++;
    }
    if (log.status === 'sent') {
      sentByType[log.eventType]++;
    }
  });
  
  return {
    totalSent,
    totalFailed,
    totalRetrying,
    totalPending,
    successRate,
    averageDeliveryTime,
    failuresByType,
    sentByType
  };
};

// Simular envío de email
export const sendEmail = (
  eventType: EmailEventType,
  recipient: string,
  subject: string,
  templateId: string,
  metadata?: Record<string, any>
): Promise<EmailLog> => {
  return new Promise((resolve) => {
    const logId = `email-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const log: EmailLog = {
      id: logId,
      eventType,
      recipient,
      subject,
      status: 'pending',
      timestamp: new Date().toISOString(),
      retryCount: 0,
      maxRetries: DEFAULT_RETRY_POLICY.maxRetries,
      templateId,
      metadata
    };
    
    saveEmailLog(log);
    
    // Simular envío
    setTimeout(() => {
      const result = simulateEmailSend();
      
      if (result.success) {
        updateEmailLog(logId, {
          status: 'sent',
          deliveryTime: result.deliveryTime
        });
        
        log.status = 'sent';
        log.deliveryTime = result.deliveryTime;
      } else {
        updateEmailLog(logId, {
          status: 'failed',
          errorMessage: result.error
        });
        
        log.status = 'failed';
        log.errorMessage = result.error;
        
        // Programar reintento si no se han agotado
        if (log.retryCount < log.maxRetries) {
          scheduleRetry(log);
        }
      }
      
      resolve(log);
    }, 1000);
  });
};

// Programar reintento
export const scheduleRetry = (log: EmailLog): void => {
  const retryInterval = DEFAULT_RETRY_POLICY.retryIntervalMinutes * 60 * 1000;
  const backoff = Math.pow(DEFAULT_RETRY_POLICY.backoffMultiplier, log.retryCount);
  const nextRetryDelay = retryInterval * backoff;
  const nextRetryAt = new Date(Date.now() + nextRetryDelay).toISOString();
  
  updateEmailLog(log.id, {
    status: 'retrying',
    nextRetryAt
  });
  
  console.log(`📧 Reintento programado para ${log.recipient} en ${nextRetryDelay / 1000}s`);
};

// Reintentar envío
export const retryEmail = (log: EmailLog): Promise<EmailLog> => {
  return new Promise((resolve) => {
    updateEmailLog(log.id, {
      retryCount: log.retryCount + 1,
      status: 'retrying'
    });
    
    setTimeout(() => {
      const result = simulateEmailSend();
      
      if (result.success) {
        updateEmailLog(log.id, {
          status: 'sent',
          deliveryTime: result.deliveryTime
        });
        
        log.status = 'sent';
        log.deliveryTime = result.deliveryTime;
      } else {
        const newRetryCount = log.retryCount + 1;
        
        if (newRetryCount >= log.maxRetries) {
          // Reintentos agotados
          updateEmailLog(log.id, {
            status: 'failed',
            errorMessage: `${result.error} (Reintentos agotados)`,
            retryCount: newRetryCount
          });
          
          log.status = 'failed';
          log.errorMessage = `${result.error} (Reintentos agotados)`;
        } else {
          // Programar siguiente reintento
          updateEmailLog(log.id, {
            status: 'retrying',
            errorMessage: result.error,
            retryCount: newRetryCount
          });
          
          log.status = 'retrying';
          log.errorMessage = result.error;
          log.retryCount = newRetryCount;
          
          scheduleRetry(log);
        }
      }
      
      resolve(log);
    }, 1000);
  });
};

// Plantillas por defecto
const getDefaultTemplates = (): EmailTemplate[] => {
  return [
    {
      id: 'template-order-confirmation',
      name: 'Confirmación de Pedido',
      eventType: 'order_confirmation',
      subject: '¡Pedido Confirmado! {{orderNumber}} - Tlahtolli Studio',
      htmlContent: `
        <h1>¡Hola {{customerName}}!</h1>
        <p>Tu pedido <strong>#{{orderNumber}}</strong> ha sido confirmado.</p>
        <p>Te notificaremos cuando tu tesoro esté en camino.</p>
        <p>Total: ${{total}} MXN</p>
      `,
      placeholders: ['customerName', 'orderNumber', 'total'],
      isValid: true,
      validationErrors: [],
      lastModified: new Date().toISOString(),
      usageCount: 0
    },
    {
      id: 'template-shipping-notification',
      name: 'Notificación de Envío',
      eventType: 'shipping_notification',
      subject: '📦 Tu pedido {{orderNumber}} está en camino',
      htmlContent: `
        <h1>¡Tu tesoro está en camino!</h1>
        <p>Pedido: <strong>#{{orderNumber}}</strong></p>
        <p>Número de seguimiento: <strong>{{trackingNumber}}</strong></p>
        <p>Paquetería: {{carrier}}</p>
      `,
      placeholders: ['orderNumber', 'trackingNumber', 'carrier'],
      isValid: true,
      validationErrors: [],
      lastModified: new Date().toISOString(),
      usageCount: 0
    },
    {
      id: 'template-password-reset',
      name: 'Recuperación de Contraseña',
      eventType: 'password_reset',
      subject: 'Recupera tu contraseña - Tlahtolli Studio',
      htmlContent: `
        <h1>Hola {{customerName}},</h1>
        <p>Recibimos una solicitud para restablecer tu contraseña.</p>
        <p><a href="{{resetLink}}">Haz clic aquí para crear una nueva contraseña</a></p>
        <p>Este enlace expirará en 24 horas.</p>
      `,
      placeholders: ['customerName', 'resetLink'],
      isValid: true,
      validationErrors: [],
      lastModified: new Date().toISOString(),
      usageCount: 0
    }
  ];
};

// Simular carga masiva
export const simulateBulkSend = (count: number): Promise<void> => {
  return new Promise((resolve) => {
    const events: EmailEventType[] = [
      'order_confirmation',
      'shipping_notification',
      'delivery_confirmation',
      'password_reset'
    ];
    
    for (let i = 0; i < count; i++) {
      const eventType = events[Math.floor(Math.random() * events.length)];
      const recipient = `usuario${i}@example.com`;
      const subject = `Test ${i + 1}`;
      const templateId = `template-${eventType}`;
      
      setTimeout(() => {
        sendEmail(eventType, recipient, subject, templateId);
      }, i * 10); // Espaciar los envíos
    }
    
    setTimeout(resolve, count * 10 + 2000);
  });
};
