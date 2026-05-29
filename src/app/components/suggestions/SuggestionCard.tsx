import React, { useState } from 'react';
import { ShoppingCart, Bell } from 'lucide-react';
import { Product } from '../../types';
import { SuggestionReason, getReasonText, getReasonIcon } from '../../types/suggestions';

interface SuggestionCardProps {
  product: Product;
  reason: SuggestionReason;
  onAddToCart: (product: Product) => void;
  onNotifyMe: (product: Product) => void;
}

export function SuggestionCard({ product, reason, onAddToCart, onNotifyMe }: SuggestionCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isAvailable = product.isAvailable && (product.stock || 0) > 0;

  return (
    <div
      className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagen */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-300 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
        {/* Motivo de recomendación */}
        <div
          className="absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 shadow-sm"
          style={{ backgroundColor: '#C9A84C', color: '#666' }}
        >
          <span>{getReasonIcon(reason)}</span>
          <span className="font-medium">{getReasonText(reason)}</span>
        </div>
        {/* Etiqueta de rareza */}
        <div
          className="absolute top-3 right-3 px-2 py-1 rounded text-xs"
          style={{ backgroundColor: '#73C2FB' + '40', color: '#1e40af' }}
        >
          {product.rarity}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4">
        <h3 className="text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mb-3">
          <p className="text-xl text-gray-900">${product.price} MXN</p>
          {isAvailable ? (
            <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#7B4FA6' + '20', color: '#7B4FA6' }}>
              Disponible
            </span>
          ) : (
            <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#FF4C4C' + '20', color: '#FF4C4C' }}>
              Agotado
            </span>
          )}
        </div>

        {/* Stock */}
        {isAvailable && (
          <p className="text-xs text-gray-600 mb-3">
            {product.stock} {product.stock === 1 ? 'unidad disponible' : 'unidades disponibles'}
          </p>
        )}

        {/* Botón */}
        {isAvailable ? (
          <button
            onClick={() => onAddToCart(product)}
            className="w-full px-4 py-3 rounded-lg text-white transition-all hover:shadow-md flex items-center justify-center gap-2"
            style={{ backgroundColor: '#7B4FA6' }}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Añadir al carrito</span>
          </button>
        ) : (
          <button
            onClick={() => onNotifyMe(product)}
            className="w-full px-4 py-3 rounded-lg border-2 transition-all hover:shadow-sm flex items-center justify-center gap-2"
            style={{ borderColor: '#73C2FB', color: '#73C2FB' }}
          >
            <Bell className="w-4 h-4" />
            <span>Notificarme</span>
          </button>
        )}
      </div>
    </div>
  );
}
