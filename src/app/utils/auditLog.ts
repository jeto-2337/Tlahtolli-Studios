import { AuditLog, AuditAction, AuditLogDetails } from '../types/admin';

const AUDIT_LOG_KEY = 'tlahtolli_audit_log';

// Generar ID único
const generateId = (): string => {
  return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Guardar un nuevo log de auditoría
export const saveAuditLog = (
  action: AuditAction,
  adminName: string,
  adminEmail: string,
  details: AuditLogDetails
): void => {
  const logs = getAuditLogs();
  
  const newLog: AuditLog = {
    id: generateId(),
    action,
    adminName,
    adminEmail,
    timestamp: new Date().toISOString(),
    details
  };
  
  logs.unshift(newLog); // Agregar al inicio (más reciente primero)
  
  try {
    localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(logs));
    
    console.log(`
      ═══════════════════════════════════════
      📝 AUDIT LOG REGISTRADO
      ═══════════════════════════════════════
      Acción: ${action}
      Administrador: ${adminName} (${adminEmail})
      Fecha: ${new Date().toLocaleString('es-MX')}
      Detalles: ${JSON.stringify(details, null, 2)}
      ═══════════════════════════════════════
    `);
  } catch (error) {
    console.error('❌ Error al guardar audit log:', error);
  }
};

// Obtener todos los logs de auditoría
export const getAuditLogs = (): AuditLog[] => {
  try {
    const data = localStorage.getItem(AUDIT_LOG_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('❌ Error al cargar audit logs:', error);
    return [];
  }
};

// Obtener logs filtrados por acción
export const getAuditLogsByAction = (action: AuditAction): AuditLog[] => {
  return getAuditLogs().filter(log => log.action === action);
};

// Obtener logs filtrados por administrador
export const getAuditLogsByAdmin = (adminEmail: string): AuditLog[] => {
  return getAuditLogs().filter(log => log.adminEmail === adminEmail);
};

// Obtener logs de un producto específico
export const getAuditLogsByProduct = (productId: string): AuditLog[] => {
  return getAuditLogs().filter(log => log.details.productId === productId);
};

// Obtener logs en un rango de fechas
export const getAuditLogsByDateRange = (startDate: Date, endDate: Date): AuditLog[] => {
  return getAuditLogs().filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= startDate && logDate <= endDate;
  });
};

// Limpiar todos los logs (usar con precaución)
export const clearAuditLogs = (): void => {
  try {
    localStorage.removeItem(AUDIT_LOG_KEY);
    console.log('🧹 Audit logs limpiados');
  } catch (error) {
    console.error('❌ Error al limpiar audit logs:', error);
  }
};

// Obtener estadísticas de auditoría
export interface AuditStats {
  totalLogs: number;
  byAction: Record<AuditAction, number>;
  byAdmin: Record<string, number>;
  last24Hours: number;
  last7Days: number;
  last30Days: number;
}

export const getAuditStats = (): AuditStats => {
  const logs = getAuditLogs();
  const now = new Date();
  
  const stats: AuditStats = {
    totalLogs: logs.length,
    byAction: {
      PRODUCT_CREATED: 0,
      PRODUCT_UPDATED: 0,
      PRODUCT_DELETED: 0,
      INVENTORY_ADJUSTED: 0,
      BULK_IMPORT: 0,
      INVENTORY_RESET: 0
    },
    byAdmin: {},
    last24Hours: 0,
    last7Days: 0,
    last30Days: 0
  };
  
  logs.forEach(log => {
    // Contar por acción
    stats.byAction[log.action]++;
    
    // Contar por administrador
    if (!stats.byAdmin[log.adminEmail]) {
      stats.byAdmin[log.adminEmail] = 0;
    }
    stats.byAdmin[log.adminEmail]++;
    
    // Contar por tiempo
    const logDate = new Date(log.timestamp);
    const hoursDiff = (now.getTime() - logDate.getTime()) / (1000 * 60 * 60);
    const daysDiff = hoursDiff / 24;
    
    if (hoursDiff <= 24) stats.last24Hours++;
    if (daysDiff <= 7) stats.last7Days++;
    if (daysDiff <= 30) stats.last30Days++;
  });
  
  return stats;
};

// Exportar logs a CSV
export const exportAuditLogsToCSV = (): string => {
  const logs = getAuditLogs();
  
  const headers = [
    'ID',
    'Acción',
    'Administrador',
    'Email',
    'Fecha',
    'Producto ID',
    'Producto SKU',
    'Producto Nombre',
    'Detalles'
  ];
  
  const rows = logs.map(log => [
    log.id,
    log.action,
    log.adminName,
    log.adminEmail,
    new Date(log.timestamp).toLocaleString('es-MX'),
    log.details.productId || '',
    log.details.productSku || '',
    log.details.productName || '',
    JSON.stringify(log.details)
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  return csvContent;
};

// Descargar logs como archivo CSV
export const downloadAuditLogsCSV = (): void => {
  const csv = exportAuditLogsToCSV();
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
