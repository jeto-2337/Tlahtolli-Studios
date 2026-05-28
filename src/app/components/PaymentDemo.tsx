import React from 'react';
import { 
  CreditCard, 
  MapPin, 
  Shield, 
  Zap, 
  Crown, 
  Clock,
  Lock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

export function PaymentDemo() {
  return (
    <div className="min-h-screen py-12 px-4" style={{ backgroundColor: '#FFFDD0' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-gray-900 mb-4">Sistema de Pagos - TONALLI-006</h1>
          <p className="text-gray-600">
            Métodos de Pago Contextualizados por Región
          </p>
        </div>

        {/* Características principales */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: '#50C878' }}
            >
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-gray-900 mb-2">Detección Automática</h3>
            <p className="text-sm text-gray-600 mb-4">
              El sistema detecta automáticamente la región del usuario
            </p>
            <ul className="space-y-2 text-xs text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" style={{ color: '#50C878' }} />
                <span>9 regiones soportadas</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" style={{ color: '#50C878' }} />
                <span>Métodos por país/zona</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" style={{ color: '#50C878' }} />
                <span>Moneda localizada</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: '#73C2FB' }}
            >
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-gray-900 mb-2">Múltiples Métodos</h3>
            <p className="text-sm text-gray-600 mb-4">
              10 métodos de pago disponibles según región
            </p>
            <ul className="space-y-2 text-xs text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" style={{ color: '#50C878' }} />
                <span>Tarjetas de crédito/débito</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" style={{ color: '#50C878' }} />
                <span>PayPal, Stripe, Mercado Pago</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" style={{ color: '#50C878' }} />
                <span>OXXO, SPEI, transferencias</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: '#F0E68C' }}
            >
              <Shield className="w-6 h-6 text-gray-700" />
            </div>
            <h3 className="text-gray-900 mb-2">Seguridad PCI DSS</h3>
            <p className="text-sm text-gray-600 mb-4">
              Cumplimiento total de estándares de seguridad
            </p>
            <ul className="space-y-2 text-xs text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" style={{ color: '#50C878' }} />
                <span>Encriptación SSL 256-bit</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" style={{ color: '#50C878' }} />
                <span>Certificación PCI DSS</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" style={{ color: '#50C878' }} />
                <span>Sin almacenamiento de datos</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Badges de métodos */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h3 className="text-gray-900 mb-6">Etiquetas de Método</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-gray-900 mb-4 text-sm">Badges Disponibles</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="px-4 py-2 rounded-full flex items-center gap-2"
                    style={{ backgroundColor: '#F0E68C' + '40', color: '#B8860B' }}
                  >
                    <Crown className="w-4 h-4" />
                    <span className="text-sm">Recomendado</span>
                  </div>
                  <p className="text-xs text-gray-600">Método sugerido para la región</p>
                </div>
                <div className="flex items-center gap-3">
                  <div 
                    className="px-4 py-2 rounded-full flex items-center gap-2"
                    style={{ backgroundColor: '#73C2FB' + '40', color: '#73C2FB' }}
                  >
                    <Zap className="w-4 h-4" />
                    <span className="text-sm">Rápido</span>
                  </div>
                  <p className="text-xs text-gray-600">Procesamiento inmediato</p>
                </div>
                <div className="flex items-center gap-3">
                  <div 
                    className="px-4 py-2 rounded-full flex items-center gap-2"
                    style={{ backgroundColor: '#50C878' + '40', color: '#50C878' }}
                  >
                    <Shield className="w-4 h-4" />
                    <span className="text-sm">Seguro</span>
                  </div>
                  <p className="text-xs text-gray-600">Máxima protección</p>
                </div>
                <div className="flex items-center gap-3">
                  <div 
                    className="px-4 py-2 rounded-full flex items-center gap-2"
                    style={{ backgroundColor: '#FF9F40' + '40', color: '#FF9F40' }}
                  >
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Manual</span>
                  </div>
                  <p className="text-xs text-gray-600">Requiere confirmación manual</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-gray-900 mb-4 text-sm">Estados de Método</h4>
              <div className="space-y-3">
                <div className="p-4 rounded-lg border-2 border-green-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="text-2xl">💳</div>
                      <span className="text-sm text-gray-900">Método Disponible</span>
                    </div>
                    <CheckCircle className="w-5 h-5" style={{ color: '#50C878' }} />
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-gray-50 border-2 border-gray-200 opacity-60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="text-2xl grayscale">🍎</div>
                      <span className="text-sm text-gray-600">No Disponible</span>
                    </div>
                    <div 
                      className="px-2 py-1 rounded text-xs text-white"
                      style={{ backgroundColor: '#FF4C4C' }}
                    >
                      Temporalmente
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estados de transacción */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h3 className="text-gray-900 mb-6">Estados de Transacción</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="text-gray-900 text-sm">Pago Exitoso</h4>
              <div 
                className="p-4 rounded-lg"
                style={{ backgroundColor: '#50C878' }}
              >
                <div className="flex items-center gap-3 text-white mb-2">
                  <CheckCircle className="w-6 h-6" />
                  <p className="text-sm">¡Pago Exitoso!</p>
                </div>
                <p className="text-xs text-white opacity-90">
                  Tu tesoro ha sido asegurado
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-gray-900 text-sm">Pago Rechazado</h4>
              <div 
                className="p-4 rounded-lg"
                style={{ backgroundColor: '#FF4C4C' }}
              >
                <div className="flex items-center gap-3 text-white mb-2">
                  <XCircle className="w-6 h-6" />
                  <p className="text-sm">Pago Rechazado</p>
                </div>
                <p className="text-xs text-white opacity-90">
                  El portal encontró un obstáculo
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-gray-900 text-sm">Procesando</h4>
              <div 
                className="p-4 rounded-lg border"
                style={{ backgroundColor: '#F0F9FF', borderColor: '#73C2FB' }}
              >
                <div className="flex items-center gap-3 mb-2" style={{ color: '#73C2FB' }}>
                  <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm">Procesando...</p>
                </div>
                <p className="text-xs text-gray-600">
                  Conectando con el portal seguro
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Regiones soportadas */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h3 className="text-gray-900 mb-6">Regiones Soportadas</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { code: 'MX', name: 'México', currency: 'MXN', methods: 7 },
              { code: 'US', name: 'Estados Unidos', currency: 'USD', methods: 6 },
              { code: 'CA', name: 'Canadá', currency: 'CAD', methods: 6 },
              { code: 'ES', name: 'España', currency: 'EUR', methods: 5 },
              { code: 'AR', name: 'Argentina', currency: 'ARS', methods: 5 },
              { code: 'CO', name: 'Colombia', currency: 'COP', methods: 5 },
              { code: 'CL', name: 'Chile', currency: 'CLP', methods: 5 },
              { code: 'PE', name: 'Perú', currency: 'PEN', methods: 5 },
              { code: 'BR', name: 'Brasil', currency: 'BRL', methods: 4 }
            ].map((region) => (
              <div 
                key={region.code}
                className="p-4 rounded-lg border"
                style={{ borderColor: '#73C2FB', backgroundColor: '#F0F9FF' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4" style={{ color: '#73C2FB' }} />
                  <p className="text-sm">{region.name}</p>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>{region.currency}</span>
                  <span>{region.methods} métodos</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Narrativa simbólica */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h3 className="text-gray-900 mb-6">Narrativa Simbólica</h3>
          <div className="space-y-4 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🏦</span>
              <div>
                <p className="mb-1"><strong>Cofre de Métodos de Pago:</strong></p>
                <p className="text-xs">La selección de métodos se presenta como un cofre de tesoros mágicos</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🌀</span>
              <div>
                <p className="mb-1"><strong>Portal de Pago:</strong></p>
                <p className="text-xs">El procesamiento de pago es un portal mágico que conecta mundos</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🛡️</span>
              <div>
                <p className="mb-1"><strong>Protección Mágica:</strong></p>
                <p className="text-xs">La seguridad PCI DSS se representa como un escudo protector</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🗝️</span>
              <div>
                <p className="mb-1"><strong>Llaves de Pago:</strong></p>
                <p className="text-xs">Cada método es una llave única que abre el cofre del comercio</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
