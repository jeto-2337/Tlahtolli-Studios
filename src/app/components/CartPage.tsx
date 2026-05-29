import React, { useState } from 'react';
import { ShoppingBag, Sparkles, LogIn, UserPlus } from 'lucide-react';
import { CartItem } from '../types';
import { CartItemRow } from './CartItemRow';
import { CartProgressBar } from './CartProgressBar';
import { CartHeader } from './CartHeader';
import { Toast } from './Toast';
import { CartPersistenceInfo } from './CartPersistenceInfo';
import { useAuth } from '../contexts/AuthContext';

interface CartPageProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onBackToShop: () => void;
  onCheckout: () => void;
  onGuestCheckout: () => void;
  onLoginClick: () => void;
}

interface ToastState {
  isVisible: boolean;
  message: string;
  type: 'success' | 'error' | 'warning';
}

export function CartPage({ 
  items, 
  onUpdateQuantity, 
  onRemoveItem, 
  onBackToShop,
  onCheckout,
  onGuestCheckout,
  onLoginClick
}: CartPageProps) {
  const { isAuthenticated } = useAuth();
  const [toast, setToast] = useState<ToastState>({
    isVisible: false,
    message: '',
    type: 'success'
  });

  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    setToast({ isVisible: true, message, type });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    onUpdateQuantity(productId, quantity);
    // No mostrar toast en cada actualización automática para evitar spam
  };

  const handleRemoveItem = (productId: string) => {
    onRemoveItem(productId);
    showToast('Producto eliminado de tu inventario', 'success');
  };

  const handleStockError = (message: string) => {
    showToast(message, 'error');
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 500 ? 0 : 99;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen pb-12">
      <CartHeader onBackToShop={onBackToShop} />
      <CartProgressBar currentStep="cart" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingBag className="w-8 h-8" style={{ color: '#73C2FB' }} />
            <h1 className="text-gray-900">Inventario de Batalla</h1>
          </div>
          <p className="text-gray-600">
            {items.length === 0 
              ? 'Tu inventario está vacío. ¡Comienza tu aventura añadiendo productos!' 
              : `Tienes ${items.length} ${items.length === 1 ? 'objeto' : 'objetos'} en tu inventario`}
          </p>
        </div>
        
        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div 
              className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{ backgroundColor: '#F4F0F8' }}
            >
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-gray-900 mb-2">Tu inventario está vacío</h2>
            <p className="text-gray-600 mb-8">
              Explora nuestra colección de mercancía épica y comienza tu aventura
            </p>
            <button
              onClick={onBackToShop}
              className="px-8 py-3 rounded-lg text-white transition-all hover:shadow-md inline-flex items-center gap-2"
              style={{ backgroundColor: '#7B4FA6' }}
            >
              <Sparkles className="w-5 h-5" />
              Explorar productos
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <CartPersistenceInfo isAuthenticated={isAuthenticated} />
              
              {items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                  onStockError={handleStockError}
                />
              ))}
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24 space-y-6">
                <h3 className="text-gray-900">Resumen del pedido</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} objetos)</span>
                    <span>${subtotal} MXN</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Envío</span>
                    <span>{shipping === 0 ? 'Gratis' : `$${shipping} MXN`}</span>
                  </div>
                  
                  {subtotal > 500 && (
                    <div 
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
                      style={{ backgroundColor: '#C9A84C' }}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>¡Envío gratis desbloqueado!</span>
                    </div>
                  )}
                  
                  {subtotal > 0 && subtotal <= 500 && (
                    <div 
                      className="px-3 py-2 rounded-lg text-sm border"
                      style={{ borderColor: '#73C2FB', backgroundColor: '#F0F9FF' }}
                    >
                      <span style={{ color: '#73C2FB' }}>
                        Añade ${500 - subtotal} MXN más para envío gratis
                      </span>
                    </div>
                  )}
                  
                  <div className="border-t pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">${total} MXN</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {isAuthenticated ? (
                    /* Usuario autenticado - Botón único de continuar */
                    <button
                      onClick={onCheckout}
                      className="w-full px-8 py-4 text-white rounded-lg hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2"
                      style={{ backgroundColor: '#7B4FA6' }}
                    >
                      <Sparkles className="w-5 h-5" />
                      Continuar con el proceso de pago
                    </button>
                  ) : (
                    /* Usuario NO autenticado - Mostrar opciones de login o invitado */
                    <>
                      <div className="border-b pb-4 mb-4">
                        <p className="text-sm text-gray-600 text-center mb-3">
                          Para continuar con tu compra, elige una opción:
                        </p>
                      </div>
                      
                      <button
                        onClick={onLoginClick}
                        className="w-full px-6 py-4 rounded-lg text-white transition-all hover:shadow-md flex items-center justify-center gap-2"
                        style={{ backgroundColor: '#73C2FB' }}
                      >
                        <LogIn className="w-5 h-5" />
                        Iniciar sesión
                      </button>
                      
                      <button
                        onClick={onGuestCheckout}
                        className="w-full px-6 py-3 rounded-lg border-2 transition-all hover:bg-gray-50 flex items-center justify-center gap-2"
                        style={{ borderColor: '#7B4FA6', color: '#7B4FA6' }}
                      >
                        <UserPlus className="w-5 h-5" />
                        Continuar como invitado
                      </button>
                      
                      <div className="pt-3 border-t">
                        <p className="text-xs text-gray-500 text-center">
                          💡 Al iniciar sesión podrás guardar tu pedido y acceder a beneficios exclusivos
                        </p>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="pt-4 border-t space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span>✦</span>
                    <span>Pago seguro y protegido</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✦</span>
                    <span>Envío rastreable</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✦</span>
                    <span>Garantía de satisfacción</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
}