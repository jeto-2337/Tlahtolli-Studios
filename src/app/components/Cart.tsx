import React from 'react';
import { X, ShoppingBag, Trash2 } from 'lucide-react';
import { CartItem } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { checkStock } from './StockManager';

interface CartProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onCheckout: () => void;
  onGuestCheckout: () => void;
  onViewFullCart: () => void;
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

export function Cart({ 
  isOpen, 
  items, 
  onClose, 
  onCheckout, 
  onGuestCheckout,
  onViewFullCart,
  onRemoveItem,
  onUpdateQuantity
}: CartProps) {
  if (!isOpen) return null;

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const stockCheck = checkStock(productId, newQuantity);
    
    if (stockCheck.available) {
      onUpdateQuantity(productId, newQuantity);
    }
    // Si no hay stock, simplemente no actualiza (silencioso en el carrito lateral)
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 500 ? 0 : 99;
  const total = subtotal + shipping;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full max-w-md h-full flex flex-col shadow-xl">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-gray-700" />
            <h2 className="text-gray-900">Carrito de compras</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-gray-900 mb-2">Tu carrito está vacío</h3>
              <p className="text-gray-600 mb-6">
                Añade productos para comenzar tu aventura
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-lg text-white"
                style={{ backgroundColor: '#50C878' }}
              >
                Explorar productos
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-white">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-gray-900 mb-1 truncate">{item.name}</h3>
                    <div className="text-sm text-gray-600 mb-2">${item.price} MXN</div>
                    <div className="flex items-center gap-2">
                      <div className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#F0E68C' }}>
                        {item.status}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1 hover:bg-white rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-gray-500" />
                    </button>
                    <div className="flex items-center gap-2 bg-white rounded px-2 py-1">
                      <button
                        onClick={() => handleQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                        className="text-gray-600 hover:text-gray-900"
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <span className="text-gray-900 w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {items.length > 0 && (
          <div className="border-t p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal} MXN</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>Envío</span>
                <span>{shipping === 0 ? 'Gratis' : `$${shipping} MXN`}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">${total} MXN</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={onViewFullCart}
                className="w-full px-6 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                Ver carrito completo
              </button>
              <button
                onClick={onCheckout}
                className="w-full px-6 py-3 text-white rounded-lg hover:opacity-90 transition-all"
                style={{ backgroundColor: '#50C878' }}
              >
                Continuar con el método de pago
              </button>
              <button
                onClick={onGuestCheckout}
                className="w-full px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Comprar como invitado
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}