export type PaymentMethodType = 
  | 'credit_card'
  | 'debit_card'
  | 'paypal'
  | 'oxxo'
  | 'spei'
  | 'mercado_pago'
  | 'stripe'
  | 'bank_transfer'
  | 'cash_on_delivery'
  | 'apple_pay'
  | 'google_pay';

export type Region = 
  | 'MX' // México
  | 'US' // Estados Unidos
  | 'CA' // Canadá
  | 'ES' // España
  | 'AR' // Argentina
  | 'CO' // Colombia
  | 'CL' // Chile
  | 'PE' // Perú
  | 'BR'; // Brasil

export interface PaymentMethod {
  id: PaymentMethodType;
  name: string;
  description: string;
  icon: string;
  available: boolean;
  regions: Region[];
  processingTime: string;
  badge?: 'fast' | 'secure' | 'recommended' | 'manual';
  fee?: string;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  method: PaymentMethodType;
  amount: number;
  status: 'pending' | 'success' | 'failed' | 'manual';
  timestamp: string;
  errorMessage?: string;
  retryCount?: number;
}

export interface PaymentState {
  selectedMethod: PaymentMethod | null;
  currentRegion: Region;
  availableMethods: PaymentMethod[];
  transaction: PaymentTransaction | null;
  isProcessing: boolean;
}
