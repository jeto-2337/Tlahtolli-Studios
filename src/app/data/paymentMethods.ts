import { PaymentMethod, Region } from '../types/payment';

export const allPaymentMethods: PaymentMethod[] = [
  {
    id: 'credit_card',
    name: 'Tarjeta de Crédito',
    description: 'Visa, MasterCard, American Express',
    icon: '💳',
    available: true,
    regions: ['MX', 'US', 'CA', 'ES', 'AR', 'CO', 'CL', 'PE', 'BR'],
    processingTime: 'Inmediato',
    badge: 'recommended',
    fee: '0%'
  },
  {
    id: 'debit_card',
    name: 'Tarjeta de Débito',
    description: 'Procesa tu pago directamente desde tu cuenta',
    icon: '💳',
    available: true,
    regions: ['MX', 'US', 'CA', 'ES', 'AR', 'CO', 'CL', 'PE', 'BR'],
    processingTime: 'Inmediato',
    badge: 'fast',
    fee: '0%'
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Paga de forma segura con tu cuenta PayPal',
    icon: '🅿️',
    available: true,
    regions: ['US', 'CA', 'ES', 'MX'],
    processingTime: 'Inmediato',
    badge: 'secure',
    fee: '3.5%'
  },
  {
    id: 'oxxo',
    name: 'OXXO',
    description: 'Paga en efectivo en cualquier tienda OXXO',
    icon: '🏪',
    available: true,
    regions: ['MX'],
    processingTime: '24-48 horas',
    badge: 'manual',
    fee: '$10 MXN'
  },
  {
    id: 'spei',
    name: 'Transferencia SPEI',
    description: 'Transferencia bancaria interbancaria (México)',
    icon: '🏦',
    available: true,
    regions: ['MX'],
    processingTime: '1-3 horas',
    badge: 'fast',
    fee: '0%'
  },
  {
    id: 'mercado_pago',
    name: 'Mercado Pago',
    description: 'Paga con tu cuenta de Mercado Pago',
    icon: '💰',
    available: true,
    regions: ['MX', 'AR', 'CO', 'CL', 'PE', 'BR'],
    processingTime: 'Inmediato',
    badge: 'recommended',
    fee: '2.5%'
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Pago seguro con tecnología Stripe',
    icon: '⚡',
    available: true,
    regions: ['US', 'CA', 'ES'],
    processingTime: 'Inmediato',
    badge: 'secure',
    fee: '2.9% + $0.30'
  },
  {
    id: 'bank_transfer',
    name: 'Transferencia Bancaria',
    description: 'Transferencia directa a nuestra cuenta',
    icon: '🏦',
    available: true,
    regions: ['ES', 'AR', 'CO', 'CL', 'PE'],
    processingTime: '1-2 días hábiles',
    badge: 'manual',
    fee: '0%'
  },
  {
    id: 'apple_pay',
    name: 'Apple Pay',
    description: 'Paga rápido y seguro con Apple Pay',
    icon: '🍎',
    available: false,
    regions: ['US', 'CA', 'ES', 'MX'],
    processingTime: 'Inmediato',
    badge: 'fast',
    fee: '0%'
  },
  {
    id: 'google_pay',
    name: 'Google Pay',
    description: 'Paga con un toque usando Google Pay',
    icon: '🔵',
    available: false,
    regions: ['US', 'CA', 'ES', 'MX'],
    processingTime: 'Inmediato',
    badge: 'fast',
    fee: '0%'
  }
];

export const getPaymentMethodsByRegion = (region: Region): PaymentMethod[] => {
  return allPaymentMethods.filter(method => method.regions.includes(region));
};

export const getAvailablePaymentMethods = (region: Region): PaymentMethod[] => {
  return getPaymentMethodsByRegion(region).filter(method => method.available);
};

export const getUnavailablePaymentMethods = (region: Region): PaymentMethod[] => {
  return getPaymentMethodsByRegion(region).filter(method => !method.available);
};

// Simular detección de región basada en navegador o IP
export const detectUserRegion = (): Region => {
  // En producción, esto se haría con una API de geolocalización
  const browserLanguage = navigator.language.toLowerCase();
  
  if (browserLanguage.includes('es-mx')) return 'MX';
  if (browserLanguage.includes('es-es')) return 'ES';
  if (browserLanguage.includes('es-ar')) return 'AR';
  if (browserLanguage.includes('es-co')) return 'CO';
  if (browserLanguage.includes('es-cl')) return 'CL';
  if (browserLanguage.includes('es-pe')) return 'PE';
  if (browserLanguage.includes('pt-br')) return 'BR';
  if (browserLanguage.includes('en-ca')) return 'CA';
  if (browserLanguage.includes('en-us') || browserLanguage.includes('en')) return 'US';
  
  // Default
  return 'MX';
};

export const getRegionName = (region: Region): string => {
  const regionNames: Record<Region, string> = {
    MX: 'México',
    US: 'Estados Unidos',
    CA: 'Canadá',
    ES: 'España',
    AR: 'Argentina',
    CO: 'Colombia',
    CL: 'Chile',
    PE: 'Perú',
    BR: 'Brasil'
  };
  
  return regionNames[region];
};

export const getCurrencyByRegion = (region: Region): string => {
  const currencies: Record<Region, string> = {
    MX: 'MXN',
    US: 'USD',
    CA: 'CAD',
    ES: 'EUR',
    AR: 'ARS',
    CO: 'COP',
    CL: 'CLP',
    PE: 'PEN',
    BR: 'BRL'
  };
  
  return currencies[region];
};
