import React from 'react';
import { ArrowLeft, Package } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import logo from 'figma:asset/be661e8251bd4a685dcda726669280963e85c443.png';

interface CartHeaderProps {
  onBackToShop: () => void;
}

export function CartHeader({ onBackToShop }: CartHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button 
            onClick={onBackToShop}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <ImageWithFallback
              src={logo}
              alt="Tlahtolli Studio Logo"
              className="w-12 h-12 object-contain"
            />
            <span className="text-gray-900">Tlahtolli Studio</span>
          </button>
          
          <button
            onClick={onBackToShop}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Volver a la tienda</span>
          </button>
        </div>
      </div>
    </header>
  );
}