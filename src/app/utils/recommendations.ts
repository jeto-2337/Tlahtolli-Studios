import { Product } from '../types';

export type SimilarityReason = 
  | 'same_category'
  | 'similar_price'
  | 'same_rarity'
  | 'same_collection';

export interface ProductRecommendation {
  product: Product;
  reason: SimilarityReason;
  score: number;
}

const PRICE_THRESHOLD = 0.3; // 30% de diferencia de precio

export const getSimilarityReasonText = (reason: SimilarityReason): string => {
  const texts: Record<SimilarityReason, string> = {
    same_category: 'Misma categoría',
    similar_price: 'Similar por precio',
    same_rarity: 'Similar por rareza',
    same_collection: 'Misma colección'
  };
  return texts[reason];
};

export const getSimilarityReasonIcon = (reason: SimilarityReason): string => {
  const icons: Record<SimilarityReason, string> = {
    same_category: '⚔️', // Emblema de categoría
    similar_price: '💎', // Cristal de precio
    same_rarity: '✨', // Runa de rareza
    same_collection: '🏰' // Mundo/colección
  };
  return icons[reason];
};

export const calculateSimilarity = (
  targetProduct: Product,
  comparisonProduct: Product
): { score: number; reasons: SimilarityReason[] } => {
  let score = 0;
  const reasons: SimilarityReason[] = [];

  // No recomendar el mismo producto
  if (targetProduct.id === comparisonProduct.id) {
    return { score: 0, reasons: [] };
  }

  // No recomendar productos agotados
  if (comparisonProduct.isAvailable === false || comparisonProduct.stock === 0) {
    return { score: 0, reasons: [] };
  }

  // Misma categoría (mayor peso)
  if (targetProduct.category === comparisonProduct.category) {
    score += 40;
    reasons.push('same_category');
  }

  // Misma rareza
  if (targetProduct.rarity === comparisonProduct.rarity) {
    score += 30;
    reasons.push('same_rarity');
  }

  // Precio similar (dentro del threshold)
  const priceDiff = Math.abs(targetProduct.price - comparisonProduct.price) / targetProduct.price;
  if (priceDiff <= PRICE_THRESHOLD) {
    score += 20;
    reasons.push('similar_price');
  }

  // Misma colección
  if (targetProduct.collection === comparisonProduct.collection) {
    score += 10;
    reasons.push('same_collection');
  }

  return { score, reasons };
};

export const getRecommendations = (
  targetProduct: Product,
  allProducts: Product[],
  maxRecommendations: number = 6
): ProductRecommendation[] => {
  const recommendations: ProductRecommendation[] = [];

  for (const product of allProducts) {
    const { score, reasons } = calculateSimilarity(targetProduct, product);
    
    if (score > 0 && reasons.length > 0) {
      // Usar el primer motivo como el principal
      recommendations.push({
        product,
        reason: reasons[0],
        score
      });
    }
  }

  // Ordenar por score descendente y tomar los primeros N
  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, maxRecommendations);
};

// Sistema de notificaciones de stock
const NOTIFICATION_STORAGE_KEY = 'tlahtolli_stock_notifications';

export interface StockNotification {
  productId: string;
  productName: string;
  email?: string;
  timestamp: string;
}

export const registerStockNotification = (
  productId: string,
  productName: string,
  email?: string
): void => {
  const notifications = getStockNotifications();
  
  const notification: StockNotification = {
    productId,
    productName,
    email,
    timestamp: new Date().toISOString()
  };
  
  notifications.push(notification);
  localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(notifications));
  
  console.log(`
    ═══════════════════════════════════════
    📬 NOTIFICACIÓN REGISTRADA
    ═══════════════════════════════════════
    Producto: ${productName}
    ID: ${productId}
    ${email ? `Email: ${email}` : 'Usuario actual'}
    Fecha: ${new Date().toLocaleString()}
    
    Te notificaremos cuando este tesoro
    vuelva a estar disponible en el reino.
    ═══════════════════════════════════════
  `);
};

export const getStockNotifications = (): StockNotification[] => {
  try {
    const data = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const isProductInNotifications = (productId: string): boolean => {
  const notifications = getStockNotifications();
  return notifications.some(n => n.productId === productId);
};
