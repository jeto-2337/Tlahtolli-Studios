import React, { useState } from 'react';
import { ArrowLeft, Minus, Plus, AlertTriangle } from 'lucide-react';
import { Product } from '../types';
import { RarityBadge } from './RarityBadge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { OutOfStockProduct } from './OutOfStockProduct';
import { getAvailableStock } from './StockManager';

interface ProductDetailProps {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onBuyAsGuest?: (product: Product) => void;
  onViewProduct: (productId: string) => void;
}

export function ProductDetail({ 
  product, 
  allProducts,
  onBack, 
  onAddToCart, 
  onBuyAsGuest,
  onViewProduct 
}: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  
  const maxStock = getAvailableStock(product.id);
  const isLowStock = maxStock > 0 && maxStock <= 10;

  const handleIncrement = () => {
    if (quantity < maxStock) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (quantity > maxStock) {
      // Ajustar automáticamente al máximo disponible
      onAddToCart(product, maxStock);
      setQuantity(1);
    } else {
      onAddToCart(product, quantity);
      setQuantity(1); // Reset quantity after adding
    }
  };

  // Si el producto está agotado, mostrar el componente especial con sugerencias
  if (product.isAvailable === false || product.stock === 0) {
    return (
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver a productos
          </button>
        </div>
        <OutOfStockProduct 
          product={product}
          allProducts={allProducts}
          onAddToCart={onAddToCart}
          onViewProduct={onViewProduct}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        Volver a productos
      </button>
      
      <div className="grid md:grid-cols-2 gap-12">
        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="space-y-6">
          <div>
            <h1 className="text-gray-900 mb-3">{product.name}</h1>
            <div className="flex items-center gap-3 mb-4">
              <RarityBadge rarity={product.rarity} />
            </div>
            <div className="text-gray-600 mb-4">
              {product.collection}
            </div>
          </div>
          
          <div className="border-t border-b py-6">
            <div className="text-gray-900 mb-1">${product.price} MXN</div>
            <div className="text-sm text-gray-600">Envío gratis en pedidos mayores a $500</div>
          </div>
          
          <div>
            <h3 className="text-gray-900 mb-2">Descripción</h3>
            <p className="text-gray-600">
              {product.description}
            </p>
          </div>
          
          {/* Selector de Cantidad */}
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="block text-sm text-gray-700 mb-3">Cantidad</label>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white rounded-lg border-2 border-gray-300 px-4 py-3">
                <button
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                  className="text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Disminuir cantidad"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="text-gray-900 w-12 text-center">{quantity}</span>
                <button
                  onClick={handleIncrement}
                  disabled={quantity >= maxStock}
                  className="text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Aumentar cantidad"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="text-sm text-gray-600">
                {isLowStock ? (
                  <span style={{ color: '#C9A84C' }}>
                    Solo {maxStock} disponibles
                  </span>
                ) : (
                  <span>Disponible</span>
                )}
              </div>
            </div>
            {quantity > 1 && (
              <div className="mt-3 text-sm text-gray-600">
                Subtotal: <span className="text-gray-900">${(product.price * quantity).toFixed(2)} MXN</span>
              </div>
            )}
          </div>
          
          <div className="space-y-3 pt-4">
            <button
              onClick={handleAddToCart}
              className="w-full px-6 py-4 rounded-lg text-white transition-all hover:shadow-md"
              style={{ backgroundColor: '#7B4FA6' }}
            >
              Añadir {quantity > 1 ? `${quantity} unidades` : ''} al carrito
            </button>
            {onBuyAsGuest && (
              <button
                onClick={() => onBuyAsGuest(product)}
                className="w-full px-6 py-4 rounded-lg border-2 text-gray-700 hover:bg-gray-50 transition-all"
                style={{ borderColor: '#73C2FB' }}
              >
                Comprar como invitado
              </button>
            )}
            <div className="text-sm text-center">
              Estado: {' '}
              {product.stock && product.stock <= 5 ? (
                <span style={{ color: '#C9A84C' }}>
                  ¡Solo quedan {product.stock} unidades!
                </span>
              ) : (
                <span className="text-gray-900">En stock</span>
              )}
            </div>
          </div>
          
          <div className="pt-6 space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span>✦</span>
              <span>Producto oficial licenciado</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✦</span>
              <span>Envío seguro y rastreable</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✦</span>
              <span>Garantía de satisfacción</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}