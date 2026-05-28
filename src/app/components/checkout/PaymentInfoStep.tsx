import React, { useState } from 'react';
import { CreditCard, Lock, Sparkles } from 'lucide-react';

interface PaymentInfoData {
  cardHolder: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  antibot_insufficient_funds?: boolean;
  antibot_invalid_method?: boolean;
  antibot_bank_rejected?: boolean;
}

interface PaymentInfoStepProps {
  onComplete: (data: PaymentInfoData) => void;
  initialData?: Partial<PaymentInfoData>;
}

export function PaymentInfoStep({ onComplete, initialData = {} }: PaymentInfoStepProps) {
  const [formData, setFormData] = useState<PaymentInfoData>({
    cardHolder: initialData.cardHolder || '',
    cardNumber: initialData.cardNumber || '',
    expiryDate: initialData.expiryDate || '',
    cvv: initialData.cvv || ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof PaymentInfoData, string>>>({});
  
  // Estados secretos anti-bot
  const [antibotFlags, setAntibotFlags] = useState({
    insufficient_funds: false,
    invalid_method: false,
    bank_rejected: false
  });
  
  // Estado para mostrar/ocultar botones de prueba
  const [showTestButtons, setShowTestButtons] = useState(false);

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(' ') : cleaned;
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      const cleaned = value.replace(/\s/g, '');
      if (cleaned.length <= 16) {
        formattedValue = formatCardNumber(cleaned);
      } else {
        return;
      }
    } else if (name === 'expiryDate') {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length <= 4) {
        formattedValue = formatExpiryDate(cleaned);
      } else {
        return;
      }
    } else if (name === 'cvv') {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length <= 4) {
        formattedValue = cleaned;
      } else {
        return;
      }
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
    
    if (errors[name as keyof PaymentInfoData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PaymentInfoData, string>> = {};

    if (formData.cardHolder.trim().length < 3) {
      newErrors.cardHolder = 'Ingresa el nombre completo del titular';
    }

    const cardNumberCleaned = formData.cardNumber.replace(/\s/g, '');
    if (cardNumberCleaned.length !== 16) {
      newErrors.cardNumber = 'El número de tarjeta debe tener 16 dígitos';
    }

    const expiryParts = formData.expiryDate.split('/');
    if (expiryParts.length !== 2 || expiryParts[0].length !== 2 || expiryParts[1].length !== 2) {
      newErrors.expiryDate = 'Formato inválido (MM/AA)';
    } else {
      const month = parseInt(expiryParts[0]);
      const year = parseInt(expiryParts[1]);
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;

      if (month < 1 || month > 12) {
        newErrors.expiryDate = 'Mes inválido';
      } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
        newErrors.expiryDate = 'La tarjeta está vencida';
      }
    }

    if (formData.cvv.length < 3 || formData.cvv.length > 4) {
      newErrors.cvv = 'CVV inválido (3-4 dígitos)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onComplete({
        ...formData,
        antibot_insufficient_funds: antibotFlags.insufficient_funds,
        antibot_invalid_method: antibotFlags.invalid_method,
        antibot_bank_rejected: antibotFlags.bank_rejected
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="text-center mb-6">
          <div 
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 cursor-pointer transition-transform hover:scale-110" 
            style={{ backgroundColor: '#73C2FB' }}
            onClick={() => setShowTestButtons(!showTestButtons)}
            title="Haz clic para mostrar/ocultar botones de prueba"
          >
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-gray-900 mb-2">Método de pago</h2>
          <p className="text-gray-600 text-sm flex items-center justify-center gap-2">
            <span>✦</span>
            Ingresa los datos de tu tarjeta de forma segura
            <span>✦</span>
          </p>
        </div>

        <div className="mb-6 p-4 rounded-lg flex items-center gap-3" style={{ backgroundColor: '#F0E68C' }}>
          <Lock className="w-5 h-5 text-gray-700" />
          <p className="text-sm text-gray-700">
            Tus datos están protegidos con encriptación de nivel bancario
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="cardHolder" className="block text-sm text-gray-700 mb-2">
              Nombre del titular *
            </label>
            <input
              type="text"
              id="cardHolder"
              name="cardHolder"
              value={formData.cardHolder}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                errors.cardHolder ? 'border-red-500 focus:ring-red-200' : 'border-gray-300'
              }`}
              style={!errors.cardHolder ? { '--tw-ring-color': '#73C2FB' } as React.CSSProperties : {}}
              placeholder="Como aparece en la tarjeta"
              required
            />
            {errors.cardHolder && (
              <p className="mt-1 text-sm" style={{ color: '#FF4C4C' }}>{errors.cardHolder}</p>
            )}
          </div>

          <div>
            <label htmlFor="cardNumber" className="block text-sm text-gray-700 mb-2">
              Número de tarjeta *
            </label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                errors.cardNumber ? 'border-red-500 focus:ring-red-200' : 'border-gray-300'
              }`}
              style={!errors.cardNumber ? { '--tw-ring-color': '#73C2FB' } as React.CSSProperties : {}}
              placeholder="1234 5678 9012 3456"
              required
            />
            {errors.cardNumber && (
              <p className="mt-1 text-sm" style={{ color: '#FF4C4C' }}>{errors.cardNumber}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiryDate" className="block text-sm text-gray-700 mb-2">
                Fecha de expiración *
              </label>
              <input
                type="text"
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.expiryDate ? 'border-red-500 focus:ring-red-200' : 'border-gray-300'
                }`}
                style={!errors.expiryDate ? { '--tw-ring-color': '#73C2FB' } as React.CSSProperties : {}}
                placeholder="MM/AA"
                required
              />
              {errors.expiryDate && (
                <p className="mt-1 text-sm" style={{ color: '#FF4C4C' }}>{errors.expiryDate}</p>
              )}
            </div>

            <div>
              <label htmlFor="cvv" className="block text-sm text-gray-700 mb-2">
                Código de seguridad (CVV) *
              </label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.cvv ? 'border-red-500 focus:ring-red-200' : 'border-gray-300'
                }`}
                style={!errors.cvv ? { '--tw-ring-color': '#73C2FB' } as React.CSSProperties : {}}
                placeholder="123"
                required
              />
              {errors.cvv && (
                <p className="mt-1 text-sm" style={{ color: '#FF4C4C' }}>{errors.cvv}</p>
              )}
            </div>
          </div>

          <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFFDD0' }}>
            <p className="text-xs text-gray-600">
              💡 Tip: El CVV son los 3 o 4 dígitos en el reverso de tu tarjeta
            </p>
          </div>

          {/* Botones secretos anti-bot - TEMPORALMENTE VISIBLES PARA PRUEBAS */}
          {showTestButtons && (
            <div className="p-4 rounded-lg border-2 border-dashed border-purple-400 bg-purple-50">
              <p className="text-xs text-purple-700 mb-3 font-semibold">
                🔧 MODO PRUEBA - Botones Anti-Bot (remover en producción)
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setAntibotFlags(prev => ({ ...prev, insufficient_funds: !prev.insufficient_funds }))}
                  className={`px-3 py-2 rounded text-xs transition-all ${
                    antibotFlags.insufficient_funds 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white text-purple-700 border border-purple-300 hover:bg-purple-100'
                  }`}
                >
                  {antibotFlags.insufficient_funds ? '✓ ' : ''}Simular: Fondos Insuficientes
                </button>
                <button
                  type="button"
                  onClick={() => setAntibotFlags(prev => ({ ...prev, invalid_method: !prev.invalid_method }))}
                  className={`px-3 py-2 rounded text-xs transition-all ${
                    antibotFlags.invalid_method 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white text-purple-700 border border-purple-300 hover:bg-purple-100'
                  }`}
                >
                  {antibotFlags.invalid_method ? '✓ ' : ''}Simular: Método Inválido
                </button>
                <button
                  type="button"
                  onClick={() => setAntibotFlags(prev => ({ ...prev, bank_rejected: !prev.bank_rejected }))}
                  className={`px-3 py-2 rounded text-xs transition-all ${
                    antibotFlags.bank_rejected 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white text-purple-700 border border-purple-300 hover:bg-purple-100'
                  }`}
                >
                  {antibotFlags.bank_rejected ? '✓ ' : ''}Simular: Rechazo Bancario
                </button>
              </div>
              <p className="text-xs text-purple-600 mt-2">
                Presiona un botón para activar/desactivar el error. Luego completa el pago para ver el error.
              </p>
            </div>
          )}

          <button
            type="submit"
            className="w-full px-6 py-4 rounded-lg text-white transition-all hover:shadow-md flex items-center justify-center gap-2"
            style={{ backgroundColor: '#50C878' }}
          >
            <Sparkles className="w-5 h-5" />
            Continuar a confirmación
          </button>
        </form>
      </div>
    </div>
  );
}