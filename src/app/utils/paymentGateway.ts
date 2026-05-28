import { PaymentErrorType } from '../components/PaymentErrorModal';

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  errorType?: PaymentErrorType;
  message?: string;
}

/**
 * Simula el procesamiento de un pago con una pasarela
 * En producción, aquí se integraría con Stripe, PayPal, MercadoPago, etc.
 */
export async function processPayment(
  paymentMethod: string,
  amount: number,
  orderId: string
): Promise<PaymentResult> {
  // Simular tiempo de procesamiento de la pasarela (1.5 a 3 segundos)
  const processingTime = 1500 + Math.random() * 1500;
  await new Promise(resolve => setTimeout(resolve, processingTime));

  // === SIMULACIÓN DE DIFERENTES ESCENARIOS ===
  
  // 1. Métodos de pago exitosos por defecto (90% de éxito)
  const successRate = 0.9;
  
  // 2. Simular diferentes tipos de errores aleatorios (10% de probabilidad total)
  const random = Math.random();
  
  if (random > successRate) {
    // Distribuir los errores entre diferentes tipos
    const errorRandom = Math.random();
    
    if (errorRandom < 0.25) {
      return {
        success: false,
        errorType: 'insufficient_funds',
        message: 'Fondos insuficientes'
      };
    } else if (errorRandom < 0.5) {
      return {
        success: false,
        errorType: 'card_declined',
        message: 'Tarjeta declinada por el banco'
      };
    } else if (errorRandom < 0.65) {
      return {
        success: false,
        errorType: 'network_error',
        message: 'Error de conexión con la pasarela de pago'
      };
    } else if (errorRandom < 0.8) {
      return {
        success: false,
        errorType: 'timeout',
        message: 'Tiempo de espera agotado'
      };
    } else {
      return {
        success: false,
        errorType: 'generic_error',
        message: 'Error al procesar el pago'
      };
    }
  }

  // 3. Éxito - generar transacción
  return {
    success: true,
    transactionId: generateTransactionId(),
    message: 'Pago procesado exitosamente'
  };
}

/**
 * Genera un ID de transacción único
 */
function generateTransactionId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `TXN-${timestamp}-${random}`;
}

/**
 * Valida el algoritmo de Luhn (usado para validar números de tarjeta)
 */
export function validateCardNumber(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\s/g, '');
  
  if (!/^\d+$/.test(cleaned)) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i));

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}