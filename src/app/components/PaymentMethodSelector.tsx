import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Zap, 
  Shield, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  MapPin,
  Sparkles,
  Crown,
  Lock
} from 'lucide-react';
import { PaymentMethod, Region } from '../types/payment';
import { 
  getAvailablePaymentMethods, 
  getUnavailablePaymentMethods,
  detectUserRegion,
  getRegionName,
  getCurrencyByRegion
} from '../data/paymentMethods';

interface PaymentMethodSelectorProps {
  onMethodSelect: (method: PaymentMethod) => void;
  selectedMethod: PaymentMethod | null;
  onContinue: () => void;
}

export function PaymentMethodSelector({ 
  onMethodSelect, 
  selectedMethod,
  onContinue 
}: PaymentMethodSelectorProps) {
  const [currentRegion, setCurrentRegion] = useState<Region>('MX');
  const [availableMethods, setAvailableMethods] = useState<PaymentMethod[]>([]);
  const [unavailableMethods, setUnavailableMethods] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    const region = detectUserRegion();
    setCurrentRegion(region);
    setAvailableMethods(getAvailablePaymentMethods(region));
    setUnavailableMethods(getUnavailablePaymentMethods(region));
  }, []);

  const getBadgeColor = (badge?: 'fast' | 'secure' | 'recommended' | 'manual') => {
    switch (badge) {
      case 'fast':
        return '#73C2FB';
      case 'secure':
        return '#7B4FA6';
      case 'recommended':
        return '#C9A84C';
      case 'manual':
        return '#FF9F40';
      default:
        return '#E5E7EB';
    }
  };

  const getBadgeIcon = (badge?: 'fast' | 'secure' | 'recommended' | 'manual') => {
    switch (badge) {
      case 'fast':
        return <Zap className="w-3 h-3" />;
      case 'secure':
        return <Shield className="w-3 h-3" />;
      case 'recommended':
        return <Crown className="w-3 h-3" />;
      case 'manual':
        return <Clock className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getBadgeText = (badge?: 'fast' | 'secure' | 'recommended' | 'manual') => {
    switch (badge) {
      case 'fast':
        return 'Rápido';
      case 'secure':
        return 'Seguro';
      case 'recommended':
        return 'Recomendado';
      case 'manual':
        return 'Manual';
      default:
        return '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-gray-900 mb-2">Cofre de Métodos de Pago</h2>
            <p className="text-gray-600 flex items-center gap-2">
              <span>✦</span>
              Elige tu portal de pago
              <span>✦</span>
            </p>
          </div>
          <div 
            className="px-4 py-2 rounded-lg flex items-center gap-2 border"
            style={{ backgroundColor: '#F0F9FF', borderColor: '#73C2FB' }}
          >
            <MapPin className="w-4 h-4" style={{ color: '#73C2FB' }} />
            <div className="text-sm">
              <p className="text-gray-600">Región detectada:</p>
              <p style={{ color: '#73C2FB' }}>{getRegionName(currentRegion)} ({getCurrencyByRegion(currentRegion)})</p>
            </div>
          </div>
        </div>

        <div 
          className="p-4 rounded-lg border flex items-center gap-3"
          style={{ backgroundColor: '#F0F9FF', borderColor: '#73C2FB' }}
        >
          <Lock className="w-5 h-5" style={{ color: '#73C2FB' }} />
          <div className="text-sm text-gray-700">
            <strong>Protección Mágica Activada:</strong> Todos los pagos están protegidos con encriptación PCI DSS de nivel empresarial
          </div>
        </div>
      </div>

      {/* Métodos disponibles */}
      <div className="mb-8">
        <h3 className="text-gray-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5" style={{ color: '#7B4FA6' }} />
          Métodos Disponibles
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {availableMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => onMethodSelect(method)}
              className={`bg-white rounded-lg p-6 border-2 transition-all hover:shadow-md text-left ${
                selectedMethod?.id === method.id
                  ? 'border-green-500 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{method.icon}</div>
                  <div>
                    <h4 className="text-gray-900">{method.name}</h4>
                    <p className="text-xs text-gray-500">{method.description}</p>
                  </div>
                </div>
                {selectedMethod?.id === method.id && (
                  <CheckCircle className="w-6 h-6" style={{ color: '#7B4FA6' }} />
                )}
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {method.badge && (
                  <div 
                    className="px-3 py-1 rounded-full text-xs flex items-center gap-1"
                    style={{ 
                      backgroundColor: getBadgeColor(method.badge) + '20',
                      color: getBadgeColor(method.badge)
                    }}
                  >
                    {getBadgeIcon(method.badge)}
                    <span>{getBadgeText(method.badge)}</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <Clock className="w-3 h-3" />
                  <span>{method.processingTime}</span>
                </div>
                <div className="text-xs text-gray-600">
                  Comisión: <strong>{method.fee}</strong>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Métodos no disponibles */}
      {unavailableMethods.length > 0 && (
        <div className="mb-8">
          <h3 className="text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-gray-400" />
            No Disponibles Temporalmente
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {unavailableMethods.map((method) => (
              <div
                key={method.id}
                className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200 opacity-60"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl grayscale">{method.icon}</div>
                    <div>
                      <h4 className="text-gray-600">{method.name}</h4>
                      <p className="text-xs text-gray-400">{method.description}</p>
                    </div>
                  </div>
                  <div 
                    className="px-3 py-1 rounded-full text-xs"
                    style={{ backgroundColor: '#FF4C4C', color: 'white' }}
                  >
                    No disponible
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Este método estará disponible próximamente en tu región
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botón de continuar */}
      {selectedMethod && (
        <div className="sticky bottom-0 bg-white border-t border-gray-200 pt-6 pb-6">
          <div 
            className="p-4 rounded-lg mb-4 flex items-center gap-3"
            style={{ backgroundColor: '#7B4FA6' + '20', borderColor: '#7B4FA6' }}
          >
            <CheckCircle className="w-5 h-5" style={{ color: '#7B4FA6' }} />
            <div className="text-sm">
              <p style={{ color: '#7B4FA6' }}>
                <strong>Método seleccionado:</strong> {selectedMethod.name}
              </p>
              <p className="text-xs text-gray-600">
                Tiempo de procesamiento: {selectedMethod.processingTime}
              </p>
            </div>
          </div>
          
          <button
            onClick={onContinue}
            className="w-full px-6 py-4 rounded-lg text-white transition-all hover:shadow-md flex items-center justify-center gap-2"
            style={{ backgroundColor: '#7B4FA6' }}
          >
            <CreditCard className="w-5 h-5" />
            Continuar al Portal de Pago
          </button>
        </div>
      )}

      {/* Información de seguridad */}
      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4" style={{ color: '#7B4FA6' }} />
            <p className="text-sm">Pago Seguro</p>
          </div>
          <p className="text-xs text-gray-600">
            Encriptación SSL de 256 bits
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-4 h-4" style={{ color: '#73C2FB' }} />
            <p className="text-sm">PCI DSS Certificado</p>
          </div>
          <p className="text-xs text-gray-600">
            Cumplimiento total de estándares
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4" style={{ color: '#C9A84C' }} />
            <p className="text-sm">Cofre Protegido</p>
          </div>
          <p className="text-xs text-gray-600">
            Tus datos nunca se almacenan
          </p>
        </div>
      </div>
    </div>
  );
}
