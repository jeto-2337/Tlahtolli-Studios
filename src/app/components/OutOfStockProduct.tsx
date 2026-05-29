import React, { useState, useEffect } from 'react';
import { 
  PackageX, 
  Bell, 
  CheckCircle, 
  Sparkles,
  AlertCircle,
  ShoppingCart,
  Info
} from 'lucide-react';
import { Product } from '../types';
import { ProductSuggestion, generateSuggestions } from '../types/suggestions';
import { SuggestionsSection } from './suggestions/SuggestionsSection';
import { RestockNotificationModal } from './suggestions/RestockNotificationModal';
import { isAlreadySubscribed } from '../utils/subscriptionStorage';

interface OutOfStockProductProps {
  product: Product;
  allProducts: Product[];
  onAddToCart: (product: Product) => void;
  onViewProduct: (productId: string) => void;
}

export function OutOfStockProduct({ 
  product, 
  allProducts,
  onAddToCart,
  onViewProduct 
}: OutOfStockProductProps) {
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showNotificationSuccess, setShowNotificationSuccess] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const generatedSuggestions = generateSuggestions(product, allProducts, 6);
    setSuggestions(generatedSuggestions);
  }, [product, allProducts]);

  const handleNotifyMe = () => {
    setShowNotificationModal(true);
  };

  const handleCloseModal = () => {
    setShowNotificationModal(false);
  };

  const handleNotificationSuccess = () => {
    setShowNotificationSuccess(true);
    setTimeout(() => {
      setShowNotificationSuccess(false);
    }, 3000);
  };

  const handleAddSuggestionToCart = (suggestedProduct: Product) => {
    onAddToCart(suggestedProduct);
    setAddedToCart(true);
    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Legendario':
        return '#FFD700';
      case 'Épico':
        return '#9333EA';
      case 'Raro':
        return '#3B82F6';
      case 'Común':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: '#F4F0F8' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Producto agotado */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 p-8">
              {/* Imagen */}
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-80 object-cover rounded-lg opacity-60 grayscale"
                />
                <div 
                  className="absolute inset-0 flex items-center justify-center rounded-lg"
                  style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                >
                  <div 
                    className="px-6 py-3 rounded-lg flex items-center gap-3 shadow-lg"
                    style={{ backgroundColor: '#FF4C4C' }}
                  >
                    <PackageX className="w-6 h-6 text-white" />
                    <span className="text-white">Tesoro Agotado</span>
                  </div>
                </div>
              </div>

              {/* Información */}
              <div className="flex flex-col justify-between">
                <div>
                  <div 
                    className="inline-block px-3 py-1.5 rounded-full text-xs mb-3"
                    style={{ 
                      backgroundColor: getRarityColor(product.rarity) + '20',
                      color: getRarityColor(product.rarity)
                    }}
                  >
                    {product.rarity}
                  </div>
                  <h1 className="text-gray-900 mb-2">{product.name}</h1>
                  <p className="text-sm text-gray-600 mb-4">{product.collection}</p>
                  <p className="text-xl text-gray-900 mb-6">${product.price} MXN</p>
                  <p className="text-gray-700 mb-6">{product.description}</p>

                  {/* Alerta de agotado */}
                  <div 
                    className="p-4 rounded-lg border mb-6"
                    style={{ backgroundColor: '#FF4C4C' + '20', borderColor: '#FF4C4C' }}
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#FF4C4C' }} />
                      <div>
                        <p className="text-sm mb-1" style={{ color: '#FF4C4C' }}>
                          <strong>Producto Agotado</strong>
                        </p>
                        <p className="text-xs text-gray-600">
                          Este tesoro ha sido reclamado por otros aventureros. 
                          Regístrate para recibir una notificación cuando vuelva a estar disponible.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Mensaje de éxito */}
                  {showNotificationSuccess && (
                    <div 
                      className="p-4 rounded-lg mb-6 flex items-center gap-3 animate-fade-in"
                      style={{ backgroundColor: '#7B4FA6' }}
                    >
                      <CheckCircle className="w-5 h-5 text-white" />
                      <p className="text-white text-sm">
                        ¡Solicitud registrada! Te notificaremos cuando esté disponible.
                      </p>
                    </div>
                  )}

                  {/* Mensaje si ya agregó al carrito */}
                  {addedToCart && (
                    <div 
                      className="p-4 rounded-lg mb-6 flex items-center gap-3 animate-fade-in"
                      style={{ backgroundColor: '#7B4FA6' }}
                    >
                      <CheckCircle className="w-5 h-5 text-white" />
                      <p className="text-white text-sm">
                        ¡Producto añadido correctamente al carrito!
                      </p>
                    </div>
                  )}
                </div>

                {/* Botón de notificación */}
                <button
                  onClick={handleNotifyMe}
                  className="w-full px-6 py-3 rounded-lg text-white transition-all hover:shadow-md flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#73C2FB' }}
                >
                  <Bell className="w-5 h-5" />
                  Notificarme cuando esté disponible
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mensaje informativo de sugerencias */}
        {suggestions.length > 0 && (
          <div className="max-w-4xl mx-auto mb-8">
            <div 
              className="p-4 rounded-lg border"
              style={{ backgroundColor: '#73C2FB' + '20', borderColor: '#73C2FB' }}
            >
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#73C2FB' }} />
                <div>
                  <p className="text-sm mb-1" style={{ color: '#73C2FB' }}>
                    <strong>Encontramos {suggestions.length} alternativa{suggestions.length > 1 ? 's' : ''} para ti</strong>
                  </p>
                  <p className="text-xs text-gray-600">
                    Hemos seleccionado productos similares que podrían interesarte según categoría, etiquetas y precio.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sección de sugerencias */}
        <div className="max-w-7xl mx-auto">
          {suggestions.length > 0 ? (
            <>
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Sparkles className="w-6 h-6" style={{ color: '#7B4FA6' }} />
                  <h2 className="text-gray-900">Tesoros Alternativos</h2>
                  <Sparkles className="w-6 h-6" style={{ color: '#7B4FA6' }} />
                </div>
                <p className="text-gray-600 flex items-center justify-center gap-2">
                  <span>✦</span>
                  Continúa tu aventura con estas opciones
                  <span>✦</span>
                </p>
              </div>

              <SuggestionsSection
                suggestions={suggestions}
                onAddToCart={handleAddSuggestionToCart}
                onNotificationSuccess={handleNotificationSuccess}
              />
            </>
          ) : (
            <div className="text-center py-12">
              <div 
                className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                style={{ backgroundColor: '#73C2FB' + '20' }}
              >
                <PackageX className="w-8 h-8" style={{ color: '#73C2FB' }} />
              </div>
              <h3 className="text-gray-900 mb-2">No hay alternativas disponibles</h3>
              <p className="text-gray-600">
                Por el momento no tenemos productos similares disponibles.
              </p>
            </div>
          )}
        </div>

        {/* Información de por qué estas sugerencias */}
        {suggestions.length > 0 && (
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6 border" style={{ borderColor: '#73C2FB' }}>
              <h3 className="text-gray-900 mb-4">¿Por qué recibo estas sugerencias?</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📦</span>
                  <div>
                    <p className="text-sm mb-1"><strong>Similar por categoría</strong></p>
                    <p className="text-xs text-gray-600">
                      Productos del mismo tipo que buscabas
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🏷️</span>
                  <div>
                    <p className="text-sm mb-1"><strong>Similar por etiquetas</strong></p>
                    <p className="text-xs text-gray-600">
                      Items con características similares
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💰</span>
                  <div>
                    <p className="text-sm mb-1"><strong>Precio cercano</strong></p>
                    <p className="text-xs text-gray-600">
                      Tesoros dentro de tu rango de inversión
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de notificación */}
      {showNotificationModal && (
        <RestockNotificationModal
          product={product}
          onClose={handleCloseModal}
          onSuccess={handleNotificationSuccess}
        />
      )}
    </div>
  );
}
