import { Product } from '../types';

// Inventario de stock global (sincronizado con la base de datos)
export const stockInventory: { [key: string]: number } = {};

// Función para sincronizar el inventario con productos desde la base de datos
export function syncStockWithProducts(products: Product[]): void {
  // Limpiar todo el inventario primero
  Object.keys(stockInventory).forEach(key => {
    delete stockInventory[key];
  });
  
  // Cargar stock desde productos de la base de datos
  products.forEach(product => {
    stockInventory[product.id] = product.stock ?? 0;
  });
  
  console.log(`🔄 Inventario sincronizado con ${products.length} productos de la base de datos`);
  console.log('📦 Stock actual:', stockInventory);
}

export function checkStock(productId: string, requestedQuantity: number): {
  available: boolean;
  currentStock: number;
  message?: string;
} {
  const currentStock = stockInventory[productId] || 0;
  
  if (requestedQuantity <= currentStock) {
    return {
      available: true,
      currentStock
    };
  }
  
  return {
    available: false,
    currentStock,
    message: currentStock === 0 
      ? '⚠️ Este tesoro está agotado. Explora otros cofres disponibles.' 
      : `⚠️ Solo quedan ${currentStock} ${currentStock === 1 ? 'unidad disponible' : 'unidades disponibles'}. Ajusta la cantidad.`
  };
}

export function updateStock(productId: string, quantity: number): boolean {
  if (stockInventory[productId] !== undefined) {
    stockInventory[productId] = quantity;
    return true;
  }
  return false;
}

export function getAvailableStock(productId: string): number {
  return stockInventory[productId] || 0;
}

// Verificar si hay stock disponible para un producto
export function hasStock(productId: string): boolean {
  return (stockInventory[productId] || 0) > 0;
}

// Calcular el stock disponible considerando lo que ya está en el carrito
export function getAvailableStockForCart(productId: string, currentCartQuantity: number = 0): number {
  const totalStock = stockInventory[productId] || 0;
  return Math.max(0, totalStock - currentCartQuantity);
}

// Deprecated: Mantener por compatibilidad pero ya no se usa
export function syncStockWithStoredProducts(): void {
  console.warn('⚠️ syncStockWithStoredProducts está deprecado. Usar syncStockWithProducts en su lugar.');
}