import React from 'react';
import { CheckCircle, X, Package } from 'lucide-react';
import { Product } from '../types';

interface AddToCartModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onBuyNow: () => void;
  onContinueShopping: () => void;
}

export function AddToCartModal({ 
  isOpen, 
  product, 
  onClose, 
  onBuyNow, 
  onContinueShopping 
}: AddToCartModalProps) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4 animate-scale-in" style={{ backgroundColor: '#F4F0F8' }}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Package className="w-10 h-10" style={{ color: '#7B4FA6' }} />
              <CheckCircle className="w-5 h-5 absolute -bottom-1 -right-1" style={{ color: '#7B4FA6' }} />
            </div>
            <div>
              <h3 className="text-gray-900">¡Tesoro añadido!</h3>
              <p className="text-sm text-gray-600 mt-1">
                {product.name} se ha agregado a tu bolsa de tesoros
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="border-t pt-4 space-y-3">
          <button
            onClick={onBuyNow}
            className="w-full px-4 py-3 rounded-lg text-white transition-all hover:shadow-md flex items-center justify-center gap-2"
            style={{ backgroundColor: '#7B4FA6' }}
          >
            <span>✦</span>
            Iniciar aventura de compra
          </button>
          <button
            onClick={onContinueShopping}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Seguir explorando
          </button>
        </div>
      </div>
    </div>
  );
}