import React, { useState, useEffect } from 'react';
import { Trash2, Minus, Plus } from 'lucide-react';
import { CartItem } from '../types';
import { RarityBadge } from './RarityBadge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { checkStock, stockInventory } from './StockManager';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { StockIndicator } from './StockIndicator';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onStockError: (message: string) => void;
}

export function CartItemRow({ item, onUpdateQuantity, onRemove, onStockError }: CartItemRowProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const stockCheck = checkStock(item.id, newQuantity);
    
    if (!stockCheck.available) {
      onStockError(stockCheck.message || 'Stock insuficiente');
      return;
    }
    
    // Mostrar animación de actualización
    setIsUpdating(true);
    
    // Actualizar inmediatamente sin necesidad de botón
    onUpdateQuantity(item.id, newQuantity);
    
    // Quitar animación después de un breve momento
    setTimeout(() => {
      setIsUpdating(false);
    }, 300);
  };

  const handleConfirmDelete = () => {
    onRemove(item.id);
    setShowDeleteModal(false);
  };

  const subtotal = item.price * item.quantity;

  return (
    <>
      <div className={`bg-white rounded-lg shadow-sm p-6 space-y-4 transition-all duration-300 ${isUpdating ? 'animate-pulse-update' : ''}`}>
      <div className="flex gap-6">
        <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
          <ImageWithFallback
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-gray-900 mb-2">{item.name}</h3>
              <div className="flex items-center gap-2 mb-2">
                <RarityBadge rarity={item.rarity} />
              </div>
              <div className="text-sm text-gray-600">{item.collection}</div>
            </div>
            
            <button
              onClick={() => setShowDeleteModal(true)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              aria-label="Eliminar producto"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <div 
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm"
              style={{ backgroundColor: '#F0E68C' }}
            >
              <span>{item.status}</span>
            </div>
            <StockIndicator stock={stockInventory[item.id] || 0} size="sm" />
          </div>
        </div>
      </div>
      
      <div className="border-t pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div>
            <div className="text-sm text-gray-600 mb-1">Precio unitario</div>
            <div className="text-gray-900">${item.price} MXN</div>
          </div>
          
          <div>
            <div className="text-sm text-gray-600 mb-1">Cantidad</div>
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => handleQuantityChange(item.quantity - 1)}
                className="p-2 hover:bg-white rounded transition-colors"
                disabled={item.quantity <= 1}
              >
                <Minus className="w-4 h-4 text-gray-600" />
              </button>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                className="w-16 text-center bg-transparent border-none outline-none text-gray-900"
                min="1"
              />
              <button
                onClick={() => handleQuantityChange(item.quantity + 1)}
                className="p-2 hover:bg-white rounded transition-colors"
              >
                <Plus className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
          
          <div>
            <div className="text-sm text-gray-600 mb-1">Subtotal</div>
            <div className="text-gray-900">${subtotal} MXN</div>
          </div>
        </div>
      </div>
      </div>
      
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        productName={item.name}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  );
}