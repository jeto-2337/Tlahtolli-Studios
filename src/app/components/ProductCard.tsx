import React, { useState } from 'react';
import { Plus, Minus, ShoppingCart, AlertTriangle } from 'lucide-react';
import { Product } from '../types';
import { RarityBadge } from './RarityBadge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { getAvailableStock } from './StockManager';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity?: number) => void;
  onViewDetails: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart, onViewDetails }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [showQuantitySelector, setShowQuantitySelector] = useState(false);
  
  const maxStock = getAvailableStock(product.id);
  const isOutOfStock = maxStock === 0;
  const isLowStock = maxStock > 0 && maxStock <= 5;

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity < maxStock) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, quantity);
    setQuantity(1); // Reset after adding
    setShowQuantitySelector(false);
  };

  const toggleQuantitySelector = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowQuantitySelector(!showQuantitySelector);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
      <button 
        onClick={() => onViewDetails(product)}
        className="w-full"
      >
        <div className="aspect-square overflow-hidden bg-gray-100">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </button>
      
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <button 
            onClick={() => onViewDetails(product)}
            className="flex-1 text-left hover:opacity-80 transition-opacity"
          >
            <h3 className="text-gray-900">{product.name}</h3>
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <RarityBadge rarity={product.rarity} />
        </div>
        
        <div className="text-sm text-gray-600">
          {product.collection}
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <span className="text-gray-900">${product.price} MXN</span>
          
          {!showQuantitySelector ? (
            <button
              onClick={toggleQuantitySelector}
              className="px-4 py-2 rounded-lg text-white transition-all hover:shadow-md flex items-center gap-2"
              style={{ backgroundColor: '#50C878' }}
            >
              <ShoppingCart className="w-4 h-4" />
              Añadir
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg px-2 py-1">
                <button
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                  className="text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-gray-900 w-8 text-center text-sm">{quantity}</span>
                <button
                  onClick={handleIncrement}
                  disabled={quantity >= maxStock}
                  className="text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="px-3 py-2 rounded-lg text-white transition-all hover:shadow-md"
                style={{ backgroundColor: '#50C878' }}
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {showQuantitySelector && quantity > 1 && (
          <div className="text-xs text-gray-600">
            Subtotal: ${(product.price * quantity).toFixed(2)} MXN
          </div>
        )}

        {isOutOfStock && (
          <div className="text-xs text-red-500 flex items-center gap-1">
            <AlertTriangle className="w-4 h-4" />
            Agotado
          </div>
        )}

        {isLowStock && (
          <div className="text-xs text-orange-500 flex items-center gap-1">
            <AlertTriangle className="w-4 h-4" />
            Poco stock
          </div>
        )}
      </div>
    </div>
  );
}