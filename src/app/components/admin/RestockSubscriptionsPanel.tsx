import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, Mail, Calendar, Package, AlertCircle } from 'lucide-react';
import { RestockSubscription } from '../../types/suggestions';
import { getSubscriptions, unsubscribe, sendRestockNotification } from '../../utils/subscriptionStorage';

interface RestockSubscriptionsPanelProps {
  onBack: () => void;
}

export function RestockSubscriptionsPanel({ onBack }: RestockSubscriptionsPanelProps) {
  const [subscriptions, setSubscriptions] = useState<RestockSubscription[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'notified'>('all');
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  const loadSubscriptions = () => {
    setSubscriptions(getSubscriptions());
  };

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const handleUnsubscribe = (subscriptionId: string) => {
    if (confirm('¿Estás seguro de que deseas cancelar esta suscripción?')) {
      unsubscribe(subscriptionId);
      loadSubscriptions();
    }
  };

  const handleNotify = async (subscription: RestockSubscription) => {
    setProcessingIds(new Set(processingIds).add(subscription.id));
    await sendRestockNotification(subscription);
    setProcessingIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(subscription.id);
      return newSet;
    });
    loadSubscriptions();
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    if (filter === 'active') return !sub.notified;
    if (filter === 'notified') return sub.notified;
    return true;
  });

  const activeCount = subscriptions.filter(s => !s.notified).length;
  const notifiedCount = subscriptions.filter(s => s.notified).length;

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5" style={{ color: '#73C2FB' }} />
            <h2 className="text-gray-900">Suscripciones de Restock</h2>
          </div>
          <button
            onClick={loadSubscriptions}
            className="text-sm px-4 py-2 rounded-lg border-2 transition-all hover:shadow-sm"
            style={{ borderColor: '#73C2FB', color: '#73C2FB' }}
          >
            Actualizar
          </button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div 
            className="p-4 rounded-lg"
            style={{ backgroundColor: '#73C2FB' + '20' }}
          >
            <p className="text-sm text-gray-600 mb-1">Total</p>
            <p className="text-2xl text-gray-900">{subscriptions.length}</p>
          </div>
          <div 
            className="p-4 rounded-lg"
            style={{ backgroundColor: '#7B4FA6' + '20' }}
          >
            <p className="text-sm text-gray-600 mb-1">Activas</p>
            <p className="text-2xl" style={{ color: '#7B4FA6' }}>{activeCount}</p>
          </div>
          <div 
            className="p-4 rounded-lg"
            style={{ backgroundColor: '#C9A84C' + '20' }}
          >
            <p className="text-sm text-gray-600 mb-1">Notificadas</p>
            <p className="text-2xl" style={{ color: '#C9A84C' }}>{notifiedCount}</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              filter === 'all' 
                ? 'text-white' 
                : 'border-2 text-gray-700'
            }`}
            style={filter === 'all' ? { backgroundColor: '#73C2FB' } : { borderColor: '#E5E7EB' }}
          >
            Todas ({subscriptions.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              filter === 'active' 
                ? 'text-white' 
                : 'border-2 text-gray-700'
            }`}
            style={filter === 'active' ? { backgroundColor: '#7B4FA6' } : { borderColor: '#E5E7EB' }}
          >
            Activas ({activeCount})
          </button>
          <button
            onClick={() => setFilter('notified')}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              filter === 'notified' 
                ? 'text-white' 
                : 'border-2 text-gray-700'
            }`}
            style={filter === 'notified' ? { backgroundColor: '#C9A84C' } : { borderColor: '#E5E7EB' }}
          >
            Notificadas ({notifiedCount})
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: '#73C2FB' + '20' }}>
            <tr>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">
                Fecha de Suscripción
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs uppercase tracking-wider text-gray-700">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredSubscriptions.map((subscription) => {
              const isProcessing = processingIds.has(subscription.id);

              return (
                <tr key={subscription.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{subscription.productName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{subscription.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{formatDate(subscription.subscribedAt)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {subscription.notified ? (
                      <span 
                        className="px-3 py-1 rounded-full text-xs flex items-center gap-1 w-fit"
                        style={{ backgroundColor: '#C9A84C' + '40', color: '#B8860B' }}
                      >
                        <CheckCircle className="w-3 h-3" />
                        Notificada
                      </span>
                    ) : (
                      <span 
                        className="px-3 py-1 rounded-full text-xs flex items-center gap-1 w-fit"
                        style={{ backgroundColor: '#7B4FA6' + '20', color: '#7B4FA6' }}
                      >
                        <Bell className="w-3 h-3" />
                        Activa
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {!subscription.notified && (
                        <button
                          onClick={() => handleNotify(subscription)}
                          disabled={isProcessing}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                          title="Enviar notificación ahora"
                        >
                          <Mail 
                            className={`w-4 h-4 ${isProcessing ? 'animate-pulse' : ''}`}
                            style={{ color: '#73C2FB' }} 
                          />
                        </button>
                      )}
                      <button
                        onClick={() => handleUnsubscribe(subscription.id)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Cancelar suscripción"
                      >
                        <X className="w-4 h-4" style={{ color: '#FF4C4C' }} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredSubscriptions.length === 0 && (
        <div className="text-center py-12">
          <div 
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{ backgroundColor: '#73C2FB' + '20' }}
          >
            <Bell className="w-8 h-8" style={{ color: '#73C2FB' }} />
          </div>
          <p className="text-gray-600 mb-2">No hay suscripciones</p>
          <p className="text-sm text-gray-500">
            {filter !== 'all' 
              ? 'Intenta cambiar el filtro' 
              : 'Las suscripciones de restock aparecerán aquí'}
          </p>
        </div>
      )}

      {/* Info */}
      <div className="p-6 border-t">
        <div 
          className="p-4 rounded-lg border"
          style={{ backgroundColor: '#73C2FB' + '20', borderColor: '#73C2FB' }}
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#73C2FB' }} />
            <div>
              <p className="text-sm mb-2" style={{ color: '#73C2FB' }}>
                <strong>Gestión de Notificaciones de Restock</strong>
              </p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Las suscripciones se crean cuando un cliente solicita ser notificado de un producto agotado</li>
                <li>• Puedes enviar notificaciones manualmente haciendo clic en el icono de correo</li>
                <li>• Las suscripciones marcadas como "Notificadas" ya recibieron el aviso de restock</li>
                <li>• Puedes cancelar suscripciones individuales con el botón X</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
