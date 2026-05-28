import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Download, 
  Search, 
  Filter, 
  Calendar,
  User,
  Activity,
  TrendingUp,
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  AuditLog, 
  AuditAction,
  getAuditActionText, 
  getAuditActionIcon,
  getAuditActionColor 
} from '../../types/admin';
import { getAuditLogs, getAuditStats, downloadAuditLogsCSV } from '../../utils/auditLog';

interface AuditLogPanelProps {
  onBack: () => void;
}

export function AuditLogPanel({ onBack }: AuditLogPanelProps) {
  const [logs, setLogs] = useState<AuditLog[]>(getAuditLogs());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState<AuditAction | 'ALL'>('ALL');
  const [selectedAdmin, setSelectedAdmin] = useState<string>('ALL');
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<'24h' | '7d' | '30d' | 'all'>('all');

  const stats = useMemo(() => getAuditStats(), [logs]);
  const adminEmails = useMemo(() => {
    const emails = new Set(logs.map(log => log.adminEmail));
    return Array.from(emails);
  }, [logs]);

  // Filtrar logs
  const filteredLogs = useMemo(() => {
    let filtered = [...logs];

    // Filtrar por búsqueda
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(log => 
        log.adminName.toLowerCase().includes(search) ||
        log.adminEmail.toLowerCase().includes(search) ||
        log.details.productName?.toLowerCase().includes(search) ||
        log.details.productSku?.toLowerCase().includes(search)
      );
    }

    // Filtrar por acción
    if (selectedAction !== 'ALL') {
      filtered = filtered.filter(log => log.action === selectedAction);
    }

    // Filtrar por administrador
    if (selectedAdmin !== 'ALL') {
      filtered = filtered.filter(log => log.adminEmail === selectedAdmin);
    }

    // Filtrar por rango de fecha
    if (dateRange !== 'all') {
      const now = new Date();
      const ranges = {
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000
      };
      const rangeMs = ranges[dateRange];
      filtered = filtered.filter(log => {
        const logDate = new Date(log.timestamp);
        return now.getTime() - logDate.getTime() <= rangeMs;
      });
    }

    return filtered;
  }, [logs, searchTerm, selectedAction, selectedAdmin, dateRange]);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Hace un momento';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleExpand = (logId: string) => {
    setExpandedLog(expandedLog === logId ? null : logId);
  };

  const renderLogDetails = (log: AuditLog) => {
    const { details } = log;

    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
        {/* Información del Producto */}
        {details.productId && (
          <div>
            <p className="text-xs text-gray-500 mb-1">Producto</p>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-white rounded text-xs font-mono border border-gray-200">
                {details.productSku}
              </span>
              <span className="text-sm text-gray-700">{details.productName}</span>
            </div>
          </div>
        )}

        {/* Cambios de Stock */}
        {details.stockChange && (
          <div>
            <p className="text-xs text-gray-500 mb-1">Cambio de Inventario</p>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-gray-600">
                Stock anterior: <strong>{details.stockChange.before}</strong>
              </span>
              <span className="text-gray-400">→</span>
              <span className="text-gray-600">
                Stock nuevo: <strong>{details.stockChange.after}</strong>
              </span>
              <span 
                className="px-2 py-1 rounded"
                style={{
                  backgroundColor: details.stockChange.adjustment > 0 ? '#E8F5E9' : '#FFEBEE',
                  color: details.stockChange.adjustment > 0 ? '#2E7D32' : '#C62828'
                }}
              >
                {details.stockChange.adjustment > 0 ? '+' : ''}{details.stockChange.adjustment}
              </span>
            </div>
            {details.stockChange.reason && (
              <p className="text-xs text-gray-500 mt-1">
                Motivo: {details.stockChange.reason}
              </p>
            )}
          </div>
        )}

        {/* Cambios en Campos */}
        {details.changes && Object.keys(details.changes).length > 0 && (
          <div>
            <p className="text-xs text-gray-500 mb-2">Campos Modificados</p>
            <div className="space-y-2">
              {Object.entries(details.changes).map(([field, change]) => (
                <div key={field} className="flex items-start gap-2 text-xs">
                  <span className="text-gray-600 font-medium min-w-[100px]">
                    {field}:
                  </span>
                  <div className="flex-1">
                    <div className="text-red-600 line-through">
                      {JSON.stringify(change.before)}
                    </div>
                    <div className="text-green-600">
                      {JSON.stringify(change.after)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Importación Masiva */}
        {details.bulkImport && (
          <div>
            <p className="text-xs text-gray-500 mb-1">Resultado de Importación</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-green-50 border border-green-200 rounded p-2 text-center">
                <p className="text-xs text-gray-600">Creados</p>
                <p className="text-lg text-green-600">{details.bulkImport.created}</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded p-2 text-center">
                <p className="text-xs text-gray-600">Actualizados</p>
                <p className="text-lg text-blue-600">{details.bulkImport.updated}</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded p-2 text-center">
                <p className="text-xs text-gray-600">Errores</p>
                <p className="text-lg text-red-600">{details.bulkImport.errors}</p>
              </div>
            </div>
          </div>
        )}

        {/* Metadata Adicional */}
        {details.metadata && Object.keys(details.metadata).length > 0 && (
          <div>
            <p className="text-xs text-gray-500 mb-1">Información Adicional</p>
            <pre className="text-xs bg-white p-2 rounded border border-gray-200 overflow-x-auto">
              {JSON.stringify(details.metadata, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al Dashboard
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 mb-2">📜 Historial de Auditoría</h1>
            <p className="text-gray-600">
              Registro completo de todas las acciones realizadas en el sistema
            </p>
          </div>
          <button
            onClick={downloadAuditLogsCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-5 h-5" />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-5 h-5 text-gray-400" />
            <p className="text-sm text-gray-600">Total de Acciones</p>
          </div>
          <p className="text-3xl text-gray-900">{stats.totalLogs}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-blue-500" />
            <p className="text-sm text-gray-600">Últimas 24h</p>
          </div>
          <p className="text-3xl text-gray-900">{stats.last24Hours}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-green-500" />
            <p className="text-sm text-gray-600">Últimos 7 días</p>
          </div>
          <p className="text-3xl text-gray-900">{stats.last7Days}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <p className="text-sm text-gray-600">Últimos 30 días</p>
          </div>
          <p className="text-3xl text-gray-900">{stats.last30Days}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="grid md:grid-cols-4 gap-4">
          {/* Búsqueda */}
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-700 mb-2">
              <Search className="w-4 h-4 inline mr-2" />
              Buscar
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Administrador, producto, SKU..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Filtro por Acción */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              <Filter className="w-4 h-4 inline mr-2" />
              Acción
            </label>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value as AuditAction | 'ALL')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="ALL">Todas las acciones</option>
              <option value="PRODUCT_CREATED">Productos Creados</option>
              <option value="PRODUCT_UPDATED">Productos Actualizados</option>
              <option value="PRODUCT_DELETED">Productos Eliminados</option>
              <option value="INVENTORY_ADJUSTED">Inventario Ajustado</option>
              <option value="BULK_IMPORT">Importaciones</option>
              <option value="INVENTORY_RESET">Reinicios</option>
            </select>
          </div>

          {/* Filtro por Administrador */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Administrador
            </label>
            <select
              value={selectedAdmin}
              onChange={(e) => setSelectedAdmin(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="ALL">Todos los admins</option>
              {adminEmails.map(email => (
                <option key={email} value={email}>{email}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filtro por Tiempo */}
        <div className="mt-4 flex gap-2">
          {[
            { value: 'all', label: 'Todo el tiempo' },
            { value: '24h', label: 'Últimas 24h' },
            { value: '7d', label: 'Últimos 7 días' },
            { value: '30d', label: 'Últimos 30 días' }
          ].map(option => (
            <button
              key={option.value}
              onClick={() => setDateRange(option.value as any)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                dateRange === option.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Logs */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">No se encontraron registros</p>
            <p className="text-sm mt-2">Intenta ajustar los filtros de búsqueda</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredLogs.map((log) => (
              <div key={log.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span 
                        className="px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        style={{ 
                          backgroundColor: `${getAuditActionColor(log.action)}20`,
                          color: getAuditActionColor(log.action)
                        }}
                      >
                        <span>{getAuditActionIcon(log.action)}</span>
                        <span className="font-medium">{getAuditActionText(log.action)}</span>
                      </span>
                      <span className="text-sm text-gray-500">{formatDate(log.timestamp)}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{log.adminName}</span>
                      <span className="text-sm text-gray-500">({log.adminEmail})</span>
                    </div>

                    {log.details.productName && (
                      <p className="text-sm text-gray-600">
                        Producto: <strong>{log.details.productName}</strong>
                        {log.details.productSku && (
                          <span className="ml-2 text-xs text-gray-500 font-mono">
                            [{log.details.productSku}]
                          </span>
                        )}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => toggleExpand(log.id)}
                    className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    {expandedLog === log.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                </div>

                {expandedLog === log.id && renderLogDetails(log)}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resumen de filtros */}
      {filteredLogs.length > 0 && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Mostrando {filteredLogs.length} de {logs.length} registros
        </div>
      )}
    </div>
  );
}
