import { RestockSubscription } from '../types/suggestions';

const SUBSCRIPTIONS_KEY = 'tlahtolli_restock_subscriptions';

export const saveSubscription = (subscription: RestockSubscription): void => {
  const subscriptions = getSubscriptions();
  subscriptions.push(subscription);
  localStorage.setItem(SUBSCRIPTIONS_KEY, JSON.stringify(subscriptions));
  
  console.log(`
    ═══════════════════════════════════════
    🔔 SUSCRIPCIÓN DE RESTOCK
    ═══════════════════════════════════════
    Producto: ${subscription.productName}
    Email: ${subscription.email}
    Fecha: ${new Date(subscription.subscribedAt).toLocaleString()}
    ═══════════════════════════════════════
  `);
};

export const getSubscriptions = (): RestockSubscription[] => {
  const data = localStorage.getItem(SUBSCRIPTIONS_KEY);
  return data ? JSON.parse(data) : [];
};

export const getSubscriptionsByProduct = (productId: string): RestockSubscription[] => {
  const subscriptions = getSubscriptions();
  return subscriptions.filter(s => s.productId === productId && !s.notified);
};

export const getSubscriptionsByEmail = (email: string): RestockSubscription[] => {
  const subscriptions = getSubscriptions();
  return subscriptions.filter(s => s.email.toLowerCase() === email.toLowerCase());
};

export const isAlreadySubscribed = (productId: string, email: string): boolean => {
  const subscriptions = getSubscriptions();
  return subscriptions.some(
    s => s.productId === productId && 
         s.email.toLowerCase() === email.toLowerCase() &&
         !s.notified
  );
};

export const unsubscribe = (subscriptionId: string): boolean => {
  const subscriptions = getSubscriptions();
  const filtered = subscriptions.filter(s => s.id !== subscriptionId);
  
  if (filtered.length < subscriptions.length) {
    localStorage.setItem(SUBSCRIPTIONS_KEY, JSON.stringify(filtered));
    console.log(`✅ Suscripción ${subscriptionId} cancelada`);
    return true;
  }
  
  return false;
};

export const markAsNotified = (subscriptionId: string): void => {
  const subscriptions = getSubscriptions();
  const updated = subscriptions.map(s => 
    s.id === subscriptionId ? { ...s, notified: true } : s
  );
  localStorage.setItem(SUBSCRIPTIONS_KEY, JSON.stringify(updated));
};

export const clearSubscriptions = (): void => {
  localStorage.removeItem(SUBSCRIPTIONS_KEY);
};

// Simular envío de notificación de restock
export const sendRestockNotification = (subscription: RestockSubscription): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`
        ═══════════════════════════════════════
        📧 NOTIFICACIÓN DE RESTOCK ENVIADA
        ═══════════════════════════════════════
        Para: ${subscription.email}
        Producto: ${subscription.productName}
        Estado: Enviado correctamente
        ═══════════════════════════════════════
      `);
      markAsNotified(subscription.id);
      resolve();
    }, 1000);
  });
};
