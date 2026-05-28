import React from 'react';
import { ShoppingCart, Menu, User, LogOut, Shield, Truck } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import logo from 'figma:asset/be661e8251bd4a685dcda726669280963e85c443.png';

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
  onLogoClick: () => void;
  isAuthenticated?: boolean;
  userName?: string;
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
  onAdminClick?: () => void;
  onTrackOrderClick?: () => void;
  isAdmin?: boolean;
}

export function Header({ cartItemsCount, onCartClick, onLogoClick, isAuthenticated, userName, onLoginClick, onLogoutClick, onAdminClick, onTrackOrderClick, isAdmin }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button 
            onClick={onLogoClick}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <ImageWithFallback 
              src={logo}
              alt="Tlahtolli Studio Logo"
              className="w-12 h-12 object-contain"
            />
            <span className="text-gray-900">Tlahtolli Studio</span>
          </button>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Productos</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Colecciones</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Sobre nosotros</a>
          </nav>
          
          <div className="flex items-center gap-4">
            {isAuthenticated && userName ? (
              <div className="hidden md:flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ backgroundColor: '#F0E68C' }}>
                  <User className="w-4 h-4 text-gray-700" />
                  <span className="text-sm text-gray-700">{userName}</span>
                </div>
                {onLogoutClick && (
                  <button
                    onClick={onLogoutClick}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title="Cerrar sesión"
                  >
                    <LogOut className="w-5 h-5 text-gray-700" />
                  </button>
                )}
                {isAdmin && onAdminClick && (
                  <button
                    onClick={onAdminClick}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title="Panel de administración"
                  >
                    <Shield className="w-5 h-5 text-gray-700" />
                  </button>
                )}
                {onTrackOrderClick && (
                  <button
                    onClick={onTrackOrderClick}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title="Rastrear pedido"
                  >
                    <Truck className="w-5 h-5 text-gray-700" />
                  </button>
                )}
              </div>
            ) : (
              onLoginClick && (
                <button
                  onClick={onLoginClick}
                  className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-all hover:shadow-md"
                  style={{ backgroundColor: '#50C878' }}
                >
                  <User className="w-4 h-4" />
                  <span>Ingresar</span>
                </button>
              )
            )}
            
            <button 
              onClick={onCartClick}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Carrito de compras"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {cartItemsCount > 0 && (
                <span 
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center"
                  style={{ backgroundColor: '#50C878' }}
                >
                  {cartItemsCount}
                </span>
              )}
            </button>
            <button className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}