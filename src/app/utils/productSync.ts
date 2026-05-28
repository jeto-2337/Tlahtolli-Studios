import { Product } from '../types';

// Evento personalizado para sincronizar productos entre componentes
export const PRODUCTS_UPDATED_EVENT = 'tlahtolli_products_updated';

export const notifyProductsUpdated = () => {
  // Disparar evento personalizado
  window.dispatchEvent(new CustomEvent(PRODUCTS_UPDATED_EVENT));
  console.log('📢 Evento de actualización de productos disparado');
};

export const saveAndNotifyProducts = (products: Product[], saveFunction: (products: Product[]) => void) => {
  saveFunction(products);
  notifyProductsUpdated();
};
