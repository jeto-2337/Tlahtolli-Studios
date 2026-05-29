import React, { useState, useEffect } from 'react';
import { ProductsGrid } from './components/ProductsGrid';
import { ProductDetail } from './components/ProductDetail';
import { AddToCartModal } from './components/AddToCartModal';
import { Cart } from './components/Cart';
import { CartPage } from './components/CartPage';
import { Checkout } from './components/Checkout';
import { OrderConfirmation } from './components/OrderConfirmation';
import { EmailPreview } from './components/EmailPreview';
import { Header } from './components/Header';
import { Toast } from './components/Toast';
import { Product, CartItem, OrderData } from './types';
import { checkStock } from './components/StockManager';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { ReactivateAccountPage } from './components/ReactivateAccountPage';
import { ForgotPasswordPage } from './components/ForgotPasswordPage';
import { ResetPasswordPage } from './components/ResetPasswordPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { TrackOrderPage } from './components/tracking/TrackOrderPage';
import { OrderTrackingPage } from './components/tracking/OrderTrackingPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import CreateAdminForm from './components/CreateAdminForm';
import { products as initialProducts } from './data/products';
import { useCartPersistence } from './hooks/useCartPersistence';
import { CartSyncIndicator } from './components/CartSyncIndicator';
import { DatabaseStatusIndicator } from './components/DatabaseStatusIndicator';
import { syncStockWithProducts } from './components/StockManager';
import { PRODUCTS_UPDATED_EVENT } from './utils/productSync';
import { productsApi } from './utils/api';
import { checkDatabaseConnection } from './utils/initDatabase';
import { showConsoleBanner } from './utils/consoleBanner';

type View = 'products' | 'detail' | 'cart' | 'checkout' | 'confirmation' | 'login' | 'register' | 'reactivate' | 'forgot-password' | 'reset-password' | 'admin' | 'track-order' | 'order-tracking' | 'create-admin';

function AppContent() {
  const { user, isAuthenticated, logout } = useAuth();
  const [currentView, setCurrentView] = useState<View>('products');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastAddedProduct, setLastAddedProduct] = useState<Product | null>(null);
  const [isCheckoutAsGuest, setIsCheckoutAsGuest] = useState(false);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [orderNumber, setOrderNumber] = useState('');
  const [isEmailPreviewOpen, setIsEmailPreviewOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [returnToCartAfterLogin, setReturnToCartAfterLogin] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [resetPasswordToken, setResetPasswordToken] = useState<string>('demo-token');

  // Mostrar banner de bienvenida en consola
  useEffect(() => {
    showConsoleBanner();
  }, []);

  // Hook para persistencia del carrito
  const { clearCart, clearCartOnLogout } = useCartPersistence(
    cartItems,
    setCartItems,
    user?.id || null
  );

  // Manejar token de reset password desde URL
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('#reset-password')) {
      const urlParams = new URLSearchParams(hash.split('?')[1]);
      const tokenFromUrl = urlParams.get('token');
      if (tokenFromUrl) {
        console.log('Token detectado en URL:', tokenFromUrl);
        setResetPasswordToken(tokenFromUrl);
        setCurrentView('reset-password');
      }
    }
  }, []);

  // Cargar productos desde la API
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoadingProducts(true);
      
      const result = await productsApi.getAll();
      
      if (result.error) {
        // Modo local - comportamiento esperado, no es un error
        setProducts(initialProducts);
      } else {
        setProducts(result.data || []);
      }
      
      setIsLoadingProducts(false);
    };

    loadProducts();

    // Listener para evento personalizado de actualización de productos
    const handleProductsUpdated = () => {
      loadProducts();
    };

    window.addEventListener(PRODUCTS_UPDATED_EVENT, handleProductsUpdated);
    
    return () => {
      window.removeEventListener(PRODUCTS_UPDATED_EVENT, handleProductsUpdated);
    };
  }, []);

  // Recargar productos cuando volvamos de admin
  useEffect(() => {
    if (currentView === 'products') {
      const reloadProducts = async () => {
        const result = await productsApi.getAll();
        if (result.data) {
          console.log('🔄 Actualizando productos desde la base de datos');
          setProducts(result.data);
        }
      };
      reloadProducts();
    }
  }, [currentView]);

  // Sincronizar stock cuando cambien los productos
  useEffect(() => {
    if (products.length > 0) {
      syncStockWithProducts(products);
    }
  }, [products]);

  // Protección: redirigir si un no-admin intenta acceder a admin
  useEffect(() => {
    if (currentView === 'admin' && !user?.isAdmin) {
      setCurrentView('products');
      setToastMessage('⚠️ No tienes permisos para acceder al panel de administración');
    }
  }, [currentView, user]);

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    const currentQuantityInCart = existingItem ? existingItem.quantity : 0;
    const totalQuantity = currentQuantityInCart + quantity;
    
    // Validar stock antes de agregar
    const stockCheck = checkStock(product.id, totalQuantity);
    
    if (!stockCheck.available) {
      setToastMessage(stockCheck.message || 'Stock insuficiente');
      return;
    }
    
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.id === product.id 
          ? { ...item, quantity: totalQuantity }
          : item
      ));
    } else {
      setCartItems([...cartItems, { 
        ...product, 
        quantity, 
        status: 'Pendiente de envío' 
      }]);
    }
    
    setLastAddedProduct(product);
    setIsModalOpen(true);
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('detail');
  };

  const handleProductClick = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setCurrentView('detail');
    }
  };

  const handleBackToProducts = () => {
    setCurrentView('products');
    setSelectedProduct(null);
  };

  const handleBuyNow = () => {
    setIsModalOpen(false);
    setCurrentView('cart');
  };

  const handleContinueShopping = () => {
    setIsModalOpen(false);
  };

  const handleViewCart = () => {
    setIsCartOpen(false);
    setCurrentView('cart');
  };

  const handleBackToShop = () => {
    setCurrentView('products');
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCartItems(cartItems.map(item =>
      item.id === productId ? { ...item, quantity } : item
    ));
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutAsGuest(false);
    setCurrentView('checkout');
  };

  const handleGuestCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutAsGuest(true);
    setCurrentView('checkout');
  };

  const handleBuyAsGuest = (product: Product) => {
    // Añadir el producto al carrito si no existe
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (!existingItem) {
      setCartItems([...cartItems, { 
        ...product, 
        quantity: 1, 
        status: 'Pendiente de envío' 
      }]);
    }
    
    // Ir directamente al checkout como invitado
    setIsCheckoutAsGuest(true);
    setCurrentView('checkout');
  };

  const handleCartPageCheckout = () => {
    setIsCheckoutAsGuest(false);
    setCurrentView('checkout');
  };

  const handleCartPageGuestCheckout = () => {
    setIsCheckoutAsGuest(true);
    setCurrentView('checkout');
  };

  const handleCheckoutComplete = (data: OrderData) => {
    setOrderData(data);
    setOrderNumber(Math.random().toString(36).substr(2, 9).toUpperCase());
    setCurrentView('confirmation');
  };

  const handleBackToHome = () => {
    setCurrentView('products');
    setCartItems([]);
    setOrderData(null);
    setOrderNumber('');
    clearCart();
  };

  const handleLoginClick = () => {
    setCurrentView('login');
  };

  const handleLoginFromCart = () => {
    setReturnToCartAfterLogin(true);
    setCurrentView('login');
  };

  const handleLogout = () => {
    // Vaciar el carrito en memoria antes de hacer logout
    clearCartOnLogout();
    logout();
    setCurrentView('products');
  };

  const handleAuthSuccess = () => {
    if (returnToCartAfterLogin) {
      setReturnToCartAfterLogin(false);
      setIsCheckoutAsGuest(false);
      setCurrentView('checkout');
    } else {
      setCurrentView('products');
    }
  };

  const handleSwitchToLogin = () => {
    setCurrentView('login');
  };

  const handleSwitchToRegister = () => {
    setCurrentView('register');
  };

  const handleSwitchToReactivate = () => {
    setCurrentView('reactivate');
  };

  const handleForgotPassword = () => {
    setCurrentView('forgot-password');
  };

  const handleResetPassword = (token?: string) => {
    console.log('📍 handleResetPassword llamado con token:', token);
    setCurrentView('reset-password');
    // Aquí podrías guardar el token en un estado si lo necesitas
    if (token) {
      // El token será usado por ResetPasswordPage
      console.log('✅ Token guardado en estado:', token);
      setResetPasswordToken(token);
    } else {
      console.log('⚠️ No se recibió token');
    }
  };

  const handleAdminDashboard = () => {
    // Solo permitir acceso si el usuario es admin
    if (user?.isAdmin) {
      setCurrentView('admin');
    } else {
      setToastMessage('⚠️ No tienes permisos para acceder al panel de administración');
    }
  };

  const handleAdminLogin = () => {
    // Solo permitir acceso si el usuario es admin
    if (user?.isAdmin) {
      setCurrentView('admin');
    } else {
      setToastMessage('⚠️ No tienes permisos para acceder al panel de administración');
    }
  };

  const handleTrackOrder = () => {
    setCurrentView('track-order');
  };

  const handleOrderTracking = (orderNumber: string) => {
    setCurrentView('order-tracking');
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = orderData?.shippingMethod?.price || (subtotal > 500 ? 0 : 99);
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen">
      {currentView !== 'cart' && currentView !== 'login' && currentView !== 'register' && currentView !== 'reactivate' && currentView !== 'admin' && (
        <Header 
          cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          onCartClick={handleViewCart}
          onLogoClick={handleBackToHome}
          isAuthenticated={isAuthenticated}
          userName={user ? `${user.firstName} ${user.paternalLastName}` : undefined}
          onLoginClick={handleLoginClick}
          onLogoutClick={handleLogout}
          onAdminClick={handleAdminDashboard}
          onTrackOrderClick={handleTrackOrder}
          isAdmin={user?.isAdmin || false}
        />
      )}
      
      {currentView === 'login' && (
        <LoginPage
          onSuccess={handleAuthSuccess}
          onSwitchToRegister={handleSwitchToRegister}
          onSwitchToReactivate={handleSwitchToReactivate}
          onSwitchToForgotPassword={handleForgotPassword}
          onAdminLogin={handleAdminLogin}
          onBackToHome={handleBackToHome}
        />
      )}
      
      {currentView === 'register' && (
        <RegisterPage
          onSuccess={handleAuthSuccess}
          onSwitchToLogin={handleSwitchToLogin}
          onBackToHome={handleBackToHome}
        />
      )}
      
      {currentView === 'reactivate' && (
        <ReactivateAccountPage
          onSuccess={handleAuthSuccess}
          onBackToLogin={handleSwitchToLogin}
        />
      )}
      
      {currentView === 'forgot-password' && (
        <ForgotPasswordPage
          onBackToLogin={handleSwitchToLogin}
          onSuccess={handleAuthSuccess}
          onResetPassword={handleResetPassword}
        />
      )}
      
      {currentView === 'reset-password' && (
        <ResetPasswordPage
          token={resetPasswordToken}
          onSuccess={handleSwitchToLogin}
          onTokenExpired={handleForgotPassword}
        />
      )}
      
      {currentView === 'products' && (
        <>
          {isLoadingProducts ? (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F4F0F8' }}>
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 mx-auto mb-4" style={{ borderColor: '#7B4FA6' }}></div>
                <h2 className="text-gray-900 mb-2">Cargando tesoros...</h2>
                <p className="text-gray-600">✦ Preparando el catálogo de aventuras ✦</p>
              </div>
            </div>
          ) : (
            <ProductsGrid
              products={products}
              onAddToCart={handleAddToCart}
              onViewDetails={handleViewDetails}
            />
          )}
        </>
      )}
      
      {currentView === 'detail' && selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          allProducts={products}
          onBack={handleBackToProducts}
          onAddToCart={handleAddToCart}
          onBuyAsGuest={handleBuyAsGuest}
          onViewProduct={handleProductClick}
        />
      )}
      
      {currentView === 'cart' && (
        <CartPage
          items={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onBackToShop={handleBackToShop}
          onCheckout={handleCartPageCheckout}
          onGuestCheckout={handleCartPageGuestCheckout}
          onLoginClick={handleLoginFromCart}
        />
      )}
      
      {currentView === 'checkout' && (
        <Checkout
          isGuest={isCheckoutAsGuest}
          items={cartItems}
          onComplete={handleCheckoutComplete}
        />
      )}
      
      {currentView === 'confirmation' && orderData && (
        <OrderConfirmation
          orderNumber={orderNumber}
          items={cartItems}
          orderData={orderData}
          total={total}
          onViewEmailPreview={() => setIsEmailPreviewOpen(true)}
          onBackToHome={handleBackToHome}
          onTrackOrder={handleOrderTracking}
        />
      )}
      
      {currentView === 'admin' && (
        <AdminDashboard
          onBack={handleBackToHome}
          adminName={user?.isAdmin ? 'Administrador del Sistema' : undefined}
        />
      )}
      
      {currentView === 'track-order' && (
        <TrackOrderPage
          onBack={handleBackToHome}
          onTrackOrder={handleOrderTracking}
        />
      )}
      
      {currentView === 'order-tracking' && orderData && (
        <OrderTrackingPage
          orderNumber={orderNumber}
          items={cartItems}
          orderData={orderData}
          onBack={handleBackToHome}
          status="in_transit"
        />
      )}
      
      {currentView === 'create-admin' && (
        <CreateAdminForm
          onBack={handleBackToHome}
        />
      )}
      
      <AddToCartModal
        isOpen={isModalOpen}
        product={lastAddedProduct}
        onClose={() => setIsModalOpen(false)}
        onBuyNow={handleBuyNow}
        onContinueShopping={handleContinueShopping}
      />
      
      <Cart
        isOpen={isCartOpen}
        items={cartItems}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckout}
        onGuestCheckout={handleGuestCheckout}
        onViewFullCart={handleViewCart}
        onRemoveItem={handleRemoveItem}
        onUpdateQuantity={handleUpdateQuantity}
      />
      
      {orderData && (
        <EmailPreview
          isOpen={isEmailPreviewOpen}
          onClose={() => setIsEmailPreviewOpen(false)}
          orderNumber={orderNumber}
          items={cartItems}
          orderData={orderData}
          total={total}
        />
      )}
      
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage('')}
        />
      )}
      
      <CartSyncIndicator 
        itemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        userId={user?.id || null}
      />
      
      <DatabaseStatusIndicator />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}