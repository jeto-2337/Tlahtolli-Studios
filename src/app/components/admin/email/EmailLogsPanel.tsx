import React, { useState } from 'react';
import { ArrowLeft, Search, Filter, CheckCircle, XCircle, Clock, ChevronDown, Mail, AlertTriangle } from 'lucide-react';

interface EmailLog {
  id: string;
  date: string;
  order: string;
  type: 'confirmation' | 'status_change' | 'error';
  status: 'sent' | 'retrying' | 'failed';
  attempts: number;
  error?: string;
  recipient: string;
}

interface EmailLogsPanelProps {
  onBack: () => void;
}

export function EmailLogsPanel({ onBack }: EmailLogsPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedLog, setSelectedLog] = useState<EmailLog | null>(null);

  const mockLogs: EmailLog[] = [
    {
      id: '1',
      date: '2025-12-04 14:35:22',
      order: '#TN89F2',
      type: 'confirmation',
      status: 'sent',
      attempts: 1,
      recipient: 'cliente1@email.com'
    },
    {
      id: '2',
      date: '2025-12-04 14:23:15',
      order: '#TN89E1',
      type: 'status_change',
      status: 'sent',
      attempts: 1,
      recipient: 'cliente2@email.com'
    },
    {
      id: '3',
      date: '2025-12-04 14:17:42',
      order: '#TN89D4',
      type: 'confirmation',
      status: 'retrying',
      attempts: 2,
      error: 'Connection timeout',
      recipient: 'cliente3@email.com'
    },
    {
      id: '4',
      date: '2025-12-04 14:10:33',
      order: '#TN89C7',
      type: 'confirmation',
      status: 'sent',
      attempts: 1,
      recipient: 'cliente4@email.com'
    },
    {
      id: '5',
      date: '2025-12-04 13:53:18',
      order: '#TN89B3',
      type: 'error',
      status: 'failed',
      attempts: 3,
      error: 'Invalid recipient address',
      recipient: 'invalid@'
    }
  ];

  const getTypeLabel = (type: string) => {
    const labels = {
      confirmation: 'Confirmación de pedido',
      status_change: 'Cambio de estado',
      error: 'Notificación de error'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="w-5 h-5" style={{ color: '#50C878' }} />;
      case 'retrying':
        return <Clock className="w-5 h-5" style={{ color: '#F0E68C' }} />;
      case 'failed':
        return <XCircle className="w-5 h-5" style={{ color: '#FF4C4C' }} />;
      default:
        return <Mail className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      sent: 'Enviado',
      retrying: 'Reintentando',
      failed: 'Fallido'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const filteredLogs = mockLogs.filter(log => {
    const matchesSearch = log.order.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.recipient.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || log.type === filterType;
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFDD0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <div>
              <h1 className="text-gray-900">Historial de Envíos</h1>
              <p className="text-sm text-gray-600 mt-1">
                Registro completo de notificaciones y errores
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por pedido o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Type Filter */}
            <div className="relative">
              <Filter className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">Todos los tipos</option>
                <option value="confirmation">Confirmación</option>
                <option value="status_change">Cambio de estado</option>
                <option value="error">Error</option>
              </select>
              <ChevronDown className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">Todos los estados</option>
                <option value="sent">Enviado</option>
                <option value="retrying">Reintentando</option>
                <option value="failed">Fallido</option>
              </select>
              <ChevronDown className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                    Pedido
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                    Destinatario
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                    Intentos
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {log.recipient}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {getTypeLabel(log.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(log.status)}
                        <span className="text-sm text-gray-900">{getStatusLabel(log.status)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.attempts}
                      {log.error && (
                        <AlertTriangle className="w-4 h-4 inline ml-2" style={{ color: '#F0E68C' }} />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Ver detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No se encontraron registros</p>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {selectedLog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-gray-900">Detalles del Envío</h2>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Pedido</p>
                    <p className="text-gray-900">{selectedLog.order}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Fecha</p>
                    <p className="text-gray-900">{selectedLog.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Destinatario</p>
                    <p className="text-gray-900">{selectedLog.recipient}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tipo</p>
                    <p className="text-gray-900">{getTypeLabel(selectedLog.type)}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-sm text-gray-600 mb-3">Historial de Intentos</h3>
                  <div className="space-y-2">
                    {Array.from({ length: selectedLog.attempts }).map((_, index) => (
                      <div key={index} className="flex items-center gap-3 py-2 px-3 bg-gray-50 rounded">
                        {index === selectedLog.attempts - 1 && selectedLog.status === 'sent' ? (
                          <CheckCircle className="w-5 h-5" style={{ color: '#50C878' }} />
                        ) : index === selectedLog.attempts - 1 && selectedLog.status === 'failed' ? (
                          <XCircle className="w-5 h-5" style={{ color: '#FF4C4C' }} />
                        ) : (
                          <Clock className="w-5 h-5" style={{ color: '#F0E68C' }} />
                        )}
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">Intento {index + 1}</p>
                          {index === selectedLog.attempts - 1 && selectedLog.error && (
                            <p className="text-xs text-red-600 mt-1">{selectedLog.error}</p>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(Date.now() - (selectedLog.attempts - index - 1) * 300000).toLocaleTimeString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedLog.error && (
                  <div className="border-t pt-4">
                    <h3 className="text-sm text-gray-600 mb-2">Error Técnico</h3>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-800">{selectedLog.error}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedLog(null)}
                  className="px-4 py-2 rounded-lg text-white transition-all hover:shadow-md"
                  style={{ backgroundColor: '#50C878' }}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}