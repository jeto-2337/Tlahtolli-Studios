import { Product } from '../types';
import { InventoryAdjustment } from '../types/admin';

const PRODUCTS_KEY = 'tlahtolli_admin_products';
const ADJUSTMENTS_KEY = 'tlahtolli_inventory_adjustments';

// Productos
export const saveProducts = (products: Product[]): void => {
  try {
    const productsJson = JSON.stringify(products);
    localStorage.setItem(PRODUCTS_KEY, productsJson);
    
    // Verificar que se guardó correctamente
    const verification = localStorage.getItem(PRODUCTS_KEY);
    if (verification === productsJson) {
      console.log(`✅ PRODUCTOS GUARDADOS EXITOSAMENTE: ${products.length} productos`);
      console.log(`📦 IDs guardados:`, products.map(p => ({ id: p.id, name: p.name, sku: p.sku })));
    } else {
      console.error('❌ ERROR: Los productos no se guardaron correctamente');
    }
  } catch (error) {
    console.error('❌ ERROR al guardar productos:', error);
  }
};

export const getStoredProducts = (): Product[] | null => {
  const data = localStorage.getItem(PRODUCTS_KEY);
  return data ? JSON.parse(data) : null;
};

export const clearProducts = (): void => {
  localStorage.removeItem(PRODUCTS_KEY);
};

// Ajustes de inventario
export const saveAdjustment = (adjustment: InventoryAdjustment): void => {
  const adjustments = getAdjustments();
  adjustments.push(adjustment);
  localStorage.setItem(ADJUSTMENTS_KEY, JSON.stringify(adjustments));
  
  console.log(`
    ═══════════════════════════════════════
    📊 AJUSTE DE INVENTARIO REGISTRADO
    ═══════════════════════════════════════
    Producto: ${adjustment.productName}
    Stock anterior: ${adjustment.previousStock}
    Stock nuevo: ${adjustment.newStock}
    Ajuste: ${adjustment.adjustment > 0 ? '+' : ''}${adjustment.adjustment}
    Motivo: ${adjustment.reason}
    Ajustado por: ${adjustment.adjustedBy}
    Fecha: ${new Date(adjustment.timestamp).toLocaleString()}
    ═══════════════════════════════════════
  `);
};

export const getAdjustments = (): InventoryAdjustment[] => {
  const data = localStorage.getItem(ADJUSTMENTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const getProductAdjustments = (productId: string): InventoryAdjustment[] => {
  return getAdjustments().filter(adj => adj.productId === productId);
};

export const clearAdjustments = (): void => {
  localStorage.removeItem(ADJUSTMENTS_KEY);
};

// Validación de SKU único
export const isSkuUnique = (sku: string, currentProductId?: string): boolean => {
  const products = getStoredProducts();
  if (!products) return true;
  
  return !products.some(p => 
    p.sku === sku && p.id !== currentProductId
  );
};

// Verificar si un producto tiene ventas
export const canDeleteProduct = (product: Product): boolean => {
  // En modo administrador, permitir eliminar CUALQUIER producto
  // La única restricción es si tiene ventas activas (podríamos remover esta también si queremos)
  // Por ahora, permitimos eliminar TODO
  return true;
};