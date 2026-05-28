export interface Product {
  id: string;
  sku?: string;
  name: string;
  price: number;
  image: string;
  category: 'taza' | 'playera' | 'peluche' | 'figura';
  rarity: 'Común' | 'Raro' | 'Épico' | 'Legendario';
  collection: string;
  description: string;
  stock?: number;
  isAvailable?: boolean;
  hasSales?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem extends Product {
  quantity: number;
  status: 'Pendiente de envío';
}

export interface CheckoutStep {
  id: number;
  name: string;
  completed: boolean;
}

export interface OrderData {
  guestEmail?: string;
  customerInfo?: {
    firstName: string;
    paternalLastName: string;
    maternalLastName: string;
    email: string;
    phone: string;
  };
  shippingAddress?: {
    street: string;
    number: string;
    colony: string;
    municipality: string;
    state: string;
    zipCode: string;
  };
  shippingMethod?: {
    method: string;
    price: number;
  };
  paymentInfo?: {
    cardHolder: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    antibot_insufficient_funds?: boolean;
    antibot_invalid_method?: boolean;
    antibot_bank_rejected?: boolean;
  };
  isGuest?: boolean;
}