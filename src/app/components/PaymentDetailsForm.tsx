import React, { useState } from 'react';
import { CreditCard, Lock, AlertCircle, Sparkles, ExternalLink } from 'lucide-react';
import { PaymentMethod } from '../types/payment';

interface PaymentDetailsData {
  cardHolder: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

interface PaymentDetailsFormProps {
  selectedMethod: PaymentMethod;
  onComplete: (data: PaymentDetailsData) => void;
  onBack: () => void;
}

export function PaymentDetailsForm({ selectedMethod, onComplete, onBack }: PaymentDetailsFormProps) {
  // Métodos externos que no requieren captura de tarjeta
  const externalMethods = ['paypal', 'stripe', 'mercadopago'];
  const isExternalMethod = externalMethods.includes(selectedMethod.id);

  const [formData, setFormData] = useState<PaymentDetailsData>({
    cardHolder: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof PaymentDetailsData, string>>>({});

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
    
    if (errors[name as keyof PaymentDetailsData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PaymentDetailsData, string>> = {};

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
    
    if (isExternalMethod) {
      // Para métodos externos, pasar directamente
      onComplete({
        cardHolder: 'External Payment',
        cardNumber: '0000 0000 0000 0000',
        expiryDate: '12/99',
        cvv: '000'
      });
    } else {
      // Para métodos directos, validar y pasar datos
      if (validateForm()) {
        onComplete(formData);
      }
    }
  };

  // Si es método externo, mostrar interfaz diferente
  if (isExternalMethod) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{selectedMethod.icon}</div>
            <h2 className="text-gray-900 mb-2">Pago con {selectedMethod.name}</h2>
            <p className="text-gray-600 text-sm">
              Serás redirigido al portal seguro de {selectedMethod.name}
            </p>
          </div>

          <div 
            className="p-6 rounded-lg border mb-6"
            style={{ backgroundColor: '#F0F9FF', borderColor: '#73C2FB' }}
          >
            <div className="flex items-start gap-3">
              <ExternalLink className="w-5 h-5 flex-shrink-0" style={{ color: '#73C2FB' }} />
              <div>
                <p className="text-sm mb-2" style={{ color: '#73C2FB' }}>
                  <strong>Pago externo seguro</strong>
                </p>
                <p className="text-xs text-gray-600">
                  Al continuar, serás redirigido a {selectedMethod.name} para completar el pago de forma segura. 
                  No almacenamos ninguna información de tu tarjeta.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleSubmit}
              className="w-full px-6 py-4 rounded-lg text-white transition-all hover:shadow-md flex items-center justify-center gap-2"
              style={{ backgroundColor: '#50C878' }}
            >
              <ExternalLink className="w-5 h-5" />
              Continuar a confirmación
            </button>
            <button
              onClick={onBack}
              className="w-full px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cambiar método de pago
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Interfaz para métodos directos (tarjeta)
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#73C2FB' }}>
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-gray-900 mb-2">Datos de Pago</h2>
          <p className="text-gray-600 text-sm flex items-center justify-center gap-2">
            <span>✦</span>
            Ingresa los datos de tu tarjeta
            <span>✦</span>
          </p>
        </div>

        <div className="mb-6 p-4 rounded-lg flex items-center gap-3" style={{ backgroundColor: '#F0E68C' }}>
          <Lock className="w-5 h-5 text-gray-700" />
          <p className="text-sm text-gray-700">
            Tus datos están protegidos con encriptación de nivel bancario
          </p>
        </div>

        <div className="mb-6 p-4 rounded-lg border" style={{ backgroundColor: '#F0F9FF', borderColor: '#73C2FB' }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl">{selectedMethod.icon}</div>
            <div>
              <p className="text-sm" style={{ color: '#73C2FB' }}>
                <strong>Método seleccionado:</strong>
              </p>
              <p className="text-sm text-gray-700">{selectedMethod.name}</p>
            </div>
          </div>
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
              <p className="mt-1 text-sm flex items-center gap-1" style={{ color: '#FF4C4C' }}>
                <AlertCircle className="w-4 h-4" />
                {errors.cardHolder}
              </p>
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
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all font-mono ${
                errors.cardNumber ? 'border-red-500 focus:ring-red-200' : 'border-gray-300'
              }`}
              style={!errors.cardNumber ? { '--tw-ring-color': '#73C2FB' } as React.CSSProperties : {}}
              placeholder="1234 5678 9012 3456"
              required
            />
            {errors.cardNumber && (
              <p className="mt-1 text-sm flex items-center gap-1" style={{ color: '#FF4C4C' }}>
                <AlertCircle className="w-4 h-4" />
                {errors.cardNumber}
              </p>
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
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all font-mono ${
                  errors.expiryDate ? 'border-red-500 focus:ring-red-200' : 'border-gray-300'
                }`}
                style={!errors.expiryDate ? { '--tw-ring-color': '#73C2FB' } as React.CSSProperties : {}}
                placeholder="MM/AA"
                required
              />
              {errors.expiryDate && (
                <p className="mt-1 text-sm flex items-center gap-1" style={{ color: '#FF4C4C' }}>
                  <AlertCircle className="w-4 h-4" />
                  {errors.expiryDate}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="cvv" className="block text-sm text-gray-700 mb-2">
                CVV *
              </label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all font-mono ${
                  errors.cvv ? 'border-red-500 focus:ring-red-200' : 'border-gray-300'
                }`}
                style={!errors.cvv ? { '--tw-ring-color': '#73C2FB' } as React.CSSProperties : {}}
                placeholder="123"
                required
              />
              {errors.cvv && (
                <p className="mt-1 text-sm flex items-center gap-1" style={{ color: '#FF4C4C' }}>
                  <AlertCircle className="w-4 h-4" />
                  {errors.cvv}
                </p>
              )}
            </div>
          </div>

          <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFFDD0' }}>
            <p className="text-xs text-gray-600 flex items-center gap-2">
              💡 <strong>Tip:</strong> El CVV son los 3 o 4 dígitos en el reverso de tu tarjeta
            </p>
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              className="w-full px-6 py-4 rounded-lg text-white transition-all hover:shadow-md flex items-center justify-center gap-2"
              style={{ backgroundColor: '#50C878' }}
            >
              <Sparkles className="w-5 h-5" />
              Continuar a confirmación
            </button>
            <button
              type="button"
              onClick={onBack}
              className="w-full px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cambiar método de pago
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
