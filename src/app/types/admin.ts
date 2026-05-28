export interface ValidationError {
  field: string;
  message: string;
}

// ========== INVENTORY ADJUSTMENT ==========

export interface InventoryAdjustment {
  id: string;
  productId: string;
  productName: string;
  previousStock: number;
  newStock: number;
  adjustment: number;
  reason: string;
  adjustedBy: string;
  timestamp: string;
}

export type AdjustmentReason = 
  | 'correction'
  | 'restock'
  | 'damage'
  | 'sale'
  | 'return'
  | 'manual';

export const getAdjustmentReasonText = (reason: AdjustmentReason): string => {
  const texts: Record<AdjustmentReason, string> = {
    correction: 'Corrección de inventario',
    restock: 'Reabastecimiento',
    damage: 'Producto dañado',
    sale: 'Venta manual',
    return: 'Devolución',
    manual: 'Ajuste manual'
  };
  return texts[reason];
};

export const getAdjustmentReasonIcon = (reason: AdjustmentReason): string => {
  const icons: Record<AdjustmentReason, string> = {
    correction: '🛡️',
    restock: '📦',
    damage: '⚠️',
    sale: '🛒',
    return: '↩️',
    manual: '✏️'
  };
  return icons[reason];
};

// ========== AUDIT LOG ==========

export type AuditAction = 
  | 'PRODUCT_CREATED'
  | 'PRODUCT_UPDATED'
  | 'PRODUCT_DELETED'
  | 'INVENTORY_ADJUSTED'
  | 'BULK_IMPORT'
  | 'INVENTORY_RESET';

export interface AuditLog {
  id: string;
  action: AuditAction;
  adminName: string;
  adminEmail: string;
  timestamp: string;
  details: AuditLogDetails;
}

export interface AuditLogDetails {
  productId?: string;
  productSku?: string;
  productName?: string;
  changes?: Record<string, { before: any; after: any }>;
  stockChange?: {
    before: number;
    after: number;
    adjustment: number;
    reason?: string;
  };
  bulkImport?: {
    created: number;
    updated: number;
    errors: number;
  };
  metadata?: Record<string, any>;
}

export const getAuditActionText = (action: AuditAction): string => {
  const texts: Record<AuditAction, string> = {
    PRODUCT_CREATED: 'Producto Creado',
    PRODUCT_UPDATED: 'Producto Actualizado',
    PRODUCT_DELETED: 'Producto Eliminado',
    INVENTORY_ADJUSTED: 'Inventario Ajustado',
    BULK_IMPORT: 'Importación Masiva',
    INVENTORY_RESET: 'Inventario Reiniciado'
  };
  return texts[action];
};

export const getAuditActionIcon = (action: AuditAction): string => {
  const icons: Record<AuditAction, string> = {
    PRODUCT_CREATED: '✨',
    PRODUCT_UPDATED: '✏️',
    PRODUCT_DELETED: '🗑️',
    INVENTORY_ADJUSTED: '📊',
    BULK_IMPORT: '📥',
    INVENTORY_RESET: '🔄'
  };
  return icons[action];
};

export const getAuditActionColor = (action: AuditAction): string => {
  const colors: Record<AuditAction, string> = {
    PRODUCT_CREATED: '#50C878',
    PRODUCT_UPDATED: '#73C2FB',
    PRODUCT_DELETED: '#FF4C4C',
    INVENTORY_ADJUSTED: '#F0E68C',
    BULK_IMPORT: '#2563EB',
    INVENTORY_RESET: '#9333EA'
  };
  return colors[action];
};

export interface ExcelImportResult {
  success: boolean;
  productsCreated: number;
  productsUpdated: number;
  errors: ExcelImportError[];
}

export interface ExcelImportError {
  row: number;
  field: string;
  value: string;
  message: string;
}

export interface ProductFormData {
  sku: string;
  name: string;
  price: number;
  image: string;
  category: 'taza' | 'playera' | 'peluche' | 'figura';
  rarity: 'Común' | 'Raro' | 'Épico' | 'Legendario';
  collection: string;
  description: string;
  stock: number;
}