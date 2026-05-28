import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface ProductsGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export function ProductsGrid({ products, onAddToCart, onViewDetails }: ProductsGridProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Colección Oficial</h1>
        <p className="text-gray-600">
          Descubre la mercancía oficial del universo épico. Cada producto es una pieza única de la aventura.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>
    </div>
  );
}
