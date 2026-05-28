import React, { useState } from 'react';
import { Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../../types';
import { ProductSuggestion } from '../../types/suggestions';
import { SuggestionCard } from './SuggestionCard';
import { RestockNotificationModal } from './RestockNotificationModal';

interface SuggestionsSectionProps {
  suggestions: ProductSuggestion[];
  onAddToCart: (product: Product) => void;
  onNotificationSuccess?: () => void;
}

export function SuggestionsSection({ suggestions, onAddToCart, onNotificationSuccess }: SuggestionsSectionProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const itemsPerPage = 3;
  const totalPages = Math.ceil(suggestions.length / itemsPerPage);
  const startIndex = currentIndex * itemsPerPage;
  const visibleSuggestions = suggestions.slice(startIndex, startIndex + itemsPerPage);

  const handleNext = () => {
    if (currentIndex < totalPages - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNotifyMe = (product: Product) => {
    setSelectedProduct(product);
    setShowNotificationModal(true);
  };

  const handleCloseModal = () => {
    setShowNotificationModal(false);
    setSelectedProduct(null);
  };

  const handleSuccess = () => {
    if (onNotificationSuccess) {
      onNotificationSuccess();
    }
  };

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      {/* Header */}
      <div 
        className="p-4 rounded-lg border mb-6"
        style={{ backgroundColor: '#73C2FB' + '20', borderColor: '#73C2FB' }}
      >
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#73C2FB' }} />
          <div>
            <p className="text-sm mb-1" style={{ color: '#73C2FB' }}>
              <strong>Tesoros Alternativos Disponibles</strong>
            </p>
            <p className="text-sm text-gray-600">
              Este artículo está agotado, pero encontramos alternativas similares que podrían interesarte
            </p>
          </div>
        </div>
      </div>

      {/* Carrusel de sugerencias */}
      <div className="relative">
        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {visibleSuggestions.map((suggestion) => (
            <SuggestionCard
              key={suggestion.product.id}
              product={suggestion.product}
              reason={suggestion.reason}
              onAddToCart={onAddToCart}
              onNotifyMe={handleNotifyMe}
            />
          ))}
        </div>

        {/* Controles de navegación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-2 rounded-lg border-2 transition-all hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ borderColor: '#73C2FB', color: '#73C2FB' }}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? 'w-8' : ''
                  }`}
                  style={{ 
                    backgroundColor: index === currentIndex ? '#73C2FB' : '#E5E7EB'
                  }}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={currentIndex === totalPages - 1}
              className="p-2 rounded-lg border-2 transition-all hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ borderColor: '#73C2FB', color: '#73C2FB' }}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Contador */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Mostrando {visibleSuggestions.length} de {suggestions.length} alternativas
        </p>
      </div>

      {/* Modal de notificación */}
      {showNotificationModal && selectedProduct && (
        <RestockNotificationModal
          product={selectedProduct}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
