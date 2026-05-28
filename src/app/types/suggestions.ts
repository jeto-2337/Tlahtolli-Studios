import { Product } from './index';

export type SuggestionReason = 'category' | 'tags' | 'price';

export interface ProductSuggestion {
  product: Product;
  reason: SuggestionReason;
  score: number;
}

export interface RestockSubscription {
  id: string;
  productId: string;
  productName: string;
  email: string;
  subscribedAt: string;
  notified: boolean;
}

export const getReasonText = (reason: SuggestionReason): string => {
  const texts: Record<SuggestionReason, string> = {
    category: 'Similar por categoría',
    tags: 'Similar por etiquetas',
    price: 'Precio cercano'
  };
  return texts[reason];
};

export const getReasonIcon = (reason: SuggestionReason): string => {
  const icons: Record<SuggestionReason, string> = {
    category: '📦',
    tags: '🏷️',
    price: '💰'
  };
  return icons[reason];
};

// Algoritmo de sugerencias
export const generateSuggestions = (
  outOfStockProduct: Product,
  allProducts: Product[],
  maxSuggestions: number = 6
): ProductSuggestion[] => {
  const suggestions: ProductSuggestion[] = [];

  // Excluir el producto actual
  const availableProducts = allProducts.filter(p => p.id !== outOfStockProduct.id);

  availableProducts.forEach(product => {
    let score = 0;
    let primaryReason: SuggestionReason = 'category';

    // 1. Similaridad por categoría (peso: 3 puntos)
    if (product.category === outOfStockProduct.category) {
      score += 3;
      primaryReason = 'category';
    }

    // 2. Similaridad por rareza/tags (peso: 2 puntos)
    if (product.rarity === outOfStockProduct.rarity) {
      score += 2;
      if (score < 3) primaryReason = 'tags';
    }

    // 3. Similaridad por precio (peso: 1 punto)
    const priceDiff = Math.abs(product.price - outOfStockProduct.price);
    const priceThreshold = outOfStockProduct.price * 0.3; // ±30%
    
    if (priceDiff <= priceThreshold) {
      score += 1;
      if (score < 2) primaryReason = 'price';
    }

    // 4. Bonus si está en stock (peso: 1 punto)
    if (product.isAvailable && (product.stock || 0) > 0) {
      score += 1;
    }

    // Solo incluir si tiene al menos 1 punto de similitud
    if (score > 0) {
      suggestions.push({
        product,
        reason: primaryReason,
        score
      });
    }
  });

  // Ordenar por score descendente
  suggestions.sort((a, b) => b.score - a.score);

  // Retornar máximo N sugerencias
  return suggestions.slice(0, maxSuggestions);
};

// Validación de email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
