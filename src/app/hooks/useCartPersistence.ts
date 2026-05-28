import { useEffect, useCallback } from 'react';
import { CartItem } from '../types';

const CART_STORAGE_KEY = 'tlahtolli_cart';
const GUEST_CART_KEY = 'tlahtolli_guest_cart';

export interface StoredCart {
  items: CartItem[];
  lastUpdated: string;
  userId?: string;
}

export function useCartPersistence(
  cartItems: CartItem[],
  setCartItems: (items: CartItem[]) => void,
  userId: string | null
) {
  // Obtener la clave correcta según el usuario
  const getStorageKey = useCallback((currentUserId: string | null) => {
    return currentUserId ? `${CART_STORAGE_KEY}_${currentUserId}` : GUEST_CART_KEY;
  }, []);

  // Guardar carrito en localStorage
  const saveCart = useCallback((items: CartItem[], currentUserId: string | null) => {
    const storageKey = getStorageKey(currentUserId);
    const cartData: StoredCart = {
      items,
      lastUpdated: new Date().toISOString(),
      userId: currentUserId || undefined
    };
    
    try {
      localStorage.setItem(storageKey, JSON.stringify(cartData));
    } catch (error) {
      console.error('Error al guardar el carrito:', error);
    }
  }, [getStorageKey]);

  // Cargar carrito desde localStorage
  const loadCart = useCallback((currentUserId: string | null): CartItem[] => {
    const storageKey = getStorageKey(currentUserId);
    
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const cartData: StoredCart = JSON.parse(stored);
        return cartData.items || [];
      }
    } catch (error) {
      console.error('Error al cargar el carrito:', error);
    }
    
    return [];
  }, [getStorageKey]);

  // Fusionar carrito de invitado con carrito de usuario al iniciar sesión
  const mergeGuestCart = useCallback((userCart: CartItem[], guestCart: CartItem[]): CartItem[] => {
    if (guestCart.length === 0) return userCart;
    if (userCart.length === 0) return guestCart;

    const merged = [...userCart];
    
    guestCart.forEach(guestItem => {
      const existingIndex = merged.findIndex(item => item.id === guestItem.id);
      
      if (existingIndex >= 0) {
        // Si el producto ya existe, sumar las cantidades
        merged[existingIndex] = {
          ...merged[existingIndex],
          quantity: merged[existingIndex].quantity + guestItem.quantity
        };
      } else {
        // Si no existe, agregar el producto
        merged.push(guestItem);
      }
    });
    
    return merged;
  }, []);

  // Limpiar carrito de invitado
  const clearGuestCart = useCallback(() => {
    try {
      localStorage.removeItem(GUEST_CART_KEY);
    } catch (error) {
      console.error('Error al limpiar carrito de invitado:', error);
    }
  }, []);

  // Efecto para cargar carrito al montar o cuando cambia el usuario
  useEffect(() => {
    const currentCart = loadCart(userId);
    
    // Si hay un usuario y existe un carrito de invitado, fusionar
    if (userId) {
      const guestCart = loadCart(null);
      if (guestCart.length > 0) {
        const mergedCart = mergeGuestCart(currentCart, guestCart);
        setCartItems(mergedCart);
        saveCart(mergedCart, userId);
        clearGuestCart();
        return;
      }
    }
    
    // Si solo hay carrito (usuario o invitado), cargarlo
    if (currentCart.length > 0) {
      setCartItems(currentCart);
    }
  }, [userId]); // Solo ejecutar cuando cambia el userId

  // Efecto para guardar carrito cuando cambian los items
  useEffect(() => {
    if (cartItems.length >= 0) {
      saveCart(cartItems, userId);
    }
  }, [cartItems, userId, saveCart]);

  // Función para limpiar completamente el carrito
  const clearCart = useCallback(() => {
    const storageKey = getStorageKey(userId);
    try {
      localStorage.removeItem(storageKey);
      setCartItems([]);
      
      // Log para debugging
      if (userId) {
        console.log(`✅ Carrito de usuario ${userId} limpiado después de compra`);
      } else {
        console.log('✅ Carrito de invitado limpiado después de compra');
      }
    } catch (error) {
      console.error('Error al limpiar el carrito:', error);
    }
  }, [userId, getStorageKey, setCartItems]);

  // Función para vaciar el carrito en memoria al cerrar sesión (sin borrar localStorage)
  const clearCartOnLogout = useCallback(() => {
    try {
      setCartItems([]);
      console.log('✅ Carrito vaciado en memoria al cerrar sesión');
    } catch (error) {
      console.error('Error al vaciar el carrito:', error);
    }
  }, [setCartItems]);

  return {
    clearCart,
    clearCartOnLogout,
    saveCart: () => saveCart(cartItems, userId),
    loadCart: () => loadCart(userId)
  };
}

// Helper para obtener el total de items en el carrito desde localStorage
export function getCartItemCount(userId: string | null): number {
  const storageKey = userId ? `${CART_STORAGE_KEY}_${userId}` : GUEST_CART_KEY;
  
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const cartData: StoredCart = JSON.parse(stored);
      return cartData.items.reduce((total, item) => total + item.quantity, 0);
    }
  } catch (error) {
    console.error('Error al contar items del carrito:', error);
  }
  
  return 0;
}