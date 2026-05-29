import React, { useEffect, useState } from 'react';
import { Database, DatabaseZap, AlertCircle, CheckCircle2 } from 'lucide-react';
import { checkDatabaseConnection } from '../utils/initDatabase';

type ConnectionStatus = 'checking' | 'connected' | 'disconnected' | 'error';

interface DatabaseStatusProps {
  onStatusChange?: (status: ConnectionStatus) => void;
}

export function DatabaseStatusIndicator({ onStatusChange }: DatabaseStatusProps) {
  const [status, setStatus] = useState<ConnectionStatus>('checking');
  const [productCount, setProductCount] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    checkConnection();
    
    // Verificar cada 30 segundos
    const interval = setInterval(checkConnection, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const checkConnection = async () => {
    setStatus('checking');
    
    const result = await checkDatabaseConnection();
    
    if (result.connected) {
      setStatus('connected');
      setProductCount(result.productCount);
      setErrorMessage('');
      onStatusChange?.('connected');
    } else {
      setStatus('disconnected');
      // Mensaje más amigable para modo local
      setErrorMessage('Modo local - API no desplegada');
      onStatusChange?.('disconnected');
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return '#7B4FA6'; // Verde esmeralda
      case 'disconnected':
      case 'error':
        return '#FF4C4C'; // Rojo
      case 'checking':
        return '#73C2FB'; // Azul maya
      default:
        return '#C9A84C'; // Caqui
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'disconnected':
      case 'error':
        return <AlertCircle className="w-4 h-4" />;
      case 'checking':
        return <DatabaseZap className="w-4 h-4 animate-pulse" />;
      default:
        return <Database className="w-4 h-4" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return `BD Conectada (${productCount} productos)`;
      case 'disconnected':
        return 'Sin conexión a BD';
      case 'error':
        return 'Error de conexión';
      case 'checking':
        return 'Verificando...';
      default:
        return 'Desconocido';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg cursor-pointer transition-all duration-200 hover:shadow-xl"
        style={{ 
          backgroundColor: '#F4F0F8',
          border: `2px solid ${getStatusColor()}`
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div style={{ color: getStatusColor() }}>
          {getStatusIcon()}
        </div>
        <span className="text-sm" style={{ color: '#1a1a1a' }}>
          {getStatusText()}
        </span>
      </div>

      {isExpanded && (
        <div
          className="absolute bottom-16 right-0 p-4 rounded-lg shadow-xl max-w-sm"
          style={{ backgroundColor: '#F4F0F8', border: '2px solid #C9A84C' }}
        >
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Estado de Base de Datos</h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(false);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <div style={{ color: getStatusColor() }}>
                {getStatusIcon()}
              </div>
              <span className="text-gray-700">{getStatusText()}</span>
            </div>

            {status === 'connected' && (
              <div className="p-3 rounded-md" style={{ backgroundColor: '#7B4FA620' }}>
                <p className="text-gray-700 font-medium mb-1">✅ API Activa</p>
                <p className="text-gray-600 text-xs">
                  Los productos se cargan desde la base de datos de Supabase.
                </p>
              </div>
            )}

            {status === 'disconnected' && (
              <div className="space-y-2">
                <div className="p-3 rounded-md" style={{ backgroundColor: '#FF4C4C20' }}>
                  <p className="text-gray-700 font-medium mb-1">⚠️ API No Disponible</p>
                  <p className="text-gray-600 text-xs mb-2">
                    {errorMessage}
                  </p>
                  <p className="text-gray-600 text-xs">
                    Usando productos en modo local. Los cambios no se guardarán en la base de datos.
                  </p>
                </div>

                <div className="p-3 rounded-md border border-gray-300">
                  <p className="text-gray-700 font-medium text-xs mb-2">📝 Para activar la API:</p>
                  <ol className="text-gray-600 text-xs space-y-1 list-decimal list-inside">
                    <li>Verifica que la función de Supabase esté desplegada</li>
                    <li>Abre la consola del navegador (F12)</li>
                    <li>Ejecuta: <code className="bg-gray-200 px-1 rounded">tlahtolli.checkConnection()</code></li>
                    <li>Si conecta, ejecuta: <code className="bg-gray-200 px-1 rounded">tlahtolli.initDatabase()</code></li>
                  </ol>
                </div>
              </div>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                checkConnection();
              }}
              className="w-full py-2 px-3 rounded-md transition-colors text-white text-xs font-medium"
              style={{ backgroundColor: '#7B4FA6' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#45B069';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#7B4FA6';
              }}
            >
              🔄 Verificar Conexión
            </button>

            <div className="pt-2 border-t border-gray-300">
              <p className="text-gray-500 text-xs">
                <strong>Utilidades disponibles en consola:</strong><br />
                • <code className="bg-gray-200 px-1 rounded text-xs">tlahtolli.checkConnection()</code><br />
                • <code className="bg-gray-200 px-1 rounded text-xs">tlahtolli.initDatabase()</code><br />
                • <code className="bg-gray-200 px-1 rounded text-xs">tlahtolli.syncProducts()</code><br />
                • <code className="bg-gray-200 px-1 rounded text-xs">tlahtolli.resetDatabase()</code>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}