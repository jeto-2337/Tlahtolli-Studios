import React from 'react';
import { TrendingUp, Mail, AlertCircle, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { EmailMetrics, getEventTypeText, getEventTypeIcon } from '../../../types/email';

interface EmailMetricsPanelProps {
  metrics: EmailMetrics;
}

export function EmailMetricsPanel({ metrics }: EmailMetricsPanelProps) {
  const formatPercentage = (value: number): string => {
    return value.toFixed(1) + '%';
  };

  const formatTime = (ms: number): string => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const totalEmails = metrics.totalSent + metrics.totalFailed + metrics.totalRetrying + metrics.totalPending;

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Enviados</p>
            <CheckCircle className="w-5 h-5" style={{ color: '#7B4FA6' }} />
          </div>
          <p className="text-2xl text-gray-900 mb-1">{metrics.totalSent}</p>
          <p className="text-xs text-gray-500">
            {totalEmails > 0 ? formatPercentage((metrics.totalSent / totalEmails) * 100) : '0%'} del total
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Fallidos</p>
            <AlertCircle className="w-5 h-5" style={{ color: '#FF4C4C' }} />
          </div>
          <p className="text-2xl text-gray-900 mb-1">{metrics.totalFailed}</p>
          <p className="text-xs text-gray-500">
            {totalEmails > 0 ? formatPercentage((metrics.totalFailed / totalEmails) * 100) : '0%'} del total
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Reintentando</p>
            <RefreshCw className="w-5 h-5" style={{ color: '#C9A84C' }} />
          </div>
          <p className="text-2xl text-gray-900 mb-1">{metrics.totalRetrying}</p>
          <p className="text-xs text-gray-500">
            {totalEmails > 0 ? formatPercentage((metrics.totalRetrying / totalEmails) * 100) : '0%'} del total
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Pendientes</p>
            <Clock className="w-5 h-5" style={{ color: '#73C2FB' }} />
          </div>
          <p className="text-2xl text-gray-900 mb-1">{metrics.totalPending}</p>
          <p className="text-xs text-gray-500">
            {totalEmails > 0 ? formatPercentage((metrics.totalPending / totalEmails) * 100) : '0%'} del total
          </p>
        </div>
      </div>

      {/* Tasa de éxito y tiempo promedio */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5" style={{ color: '#7B4FA6' }} />
            <h3 className="text-gray-900">Tasa de Éxito</h3>
          </div>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span 
                  className="text-3xl inline-block"
                  style={{ color: metrics.successRate >= 90 ? '#7B4FA6' : metrics.successRate >= 70 ? '#C9A84C' : '#FF4C4C' }}
                >
                  {formatPercentage(metrics.successRate)}
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-3 mb-4 text-xs flex rounded" style={{ backgroundColor: '#E5E7EB' }}>
              <div
                style={{
                  width: `${metrics.successRate}%`,
                  backgroundColor: metrics.successRate >= 90 ? '#7B4FA6' : metrics.successRate >= 70 ? '#C9A84C' : '#FF4C4C'
                }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500"
              />
            </div>
            <p className="text-sm text-gray-600">
              {metrics.successRate >= 90 ? '✨ Excelente rendimiento' : 
               metrics.successRate >= 70 ? '⚠️ Rendimiento aceptable' : 
               '❌ Requiere atención'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5" style={{ color: '#73C2FB' }} />
            <h3 className="text-gray-900">Tiempo Promedio de Entrega</h3>
          </div>
          <div>
            <span className="text-3xl text-gray-900 inline-block mb-2">
              {formatTime(metrics.averageDeliveryTime)}
            </span>
            <p className="text-sm text-gray-600">
              {metrics.averageDeliveryTime < 1000 ? '⚡ Muy rápido' :
               metrics.averageDeliveryTime < 2000 ? '✅ Rápido' :
               '⏱️ Normal'}
            </p>
          </div>
        </div>
      </div>

      {/* Envíos por tipo */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Mail className="w-5 h-5" style={{ color: '#73C2FB' }} />
          <h3 className="text-gray-900">Envíos por Tipo de Evento</h3>
        </div>
        <div className="space-y-3">
          {(Object.entries(metrics.sentByType) as Array<[keyof typeof metrics.sentByType, number]>).map(([eventType, count]) => {
            const failures = metrics.failuresByType[eventType] || 0;
            const total = count + failures;
            const successRate = total > 0 ? (count / total) * 100 : 0;

            if (total === 0) return null;

            return (
              <div key={eventType}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getEventTypeIcon(eventType)}</span>
                    <span className="text-sm text-gray-900">{getEventTypeText(eventType)}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600">
                      <span style={{ color: '#7B4FA6' }}>{count}</span> / {total}
                    </span>
                    <span className="text-gray-500">{formatPercentage(successRate)}</span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 rounded" style={{ backgroundColor: '#E5E7EB' }}>
                  <div
                    style={{
                      width: `${successRate}%`,
                      backgroundColor: '#7B4FA6'
                    }}
                    className="h-full transition-all duration-500"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Resumen total */}
      <div 
        className="p-4 rounded-lg border"
        style={{ backgroundColor: '#73C2FB' + '20', borderColor: '#73C2FB' }}
      >
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#73C2FB' }} />
          <div>
            <p className="text-sm mb-1" style={{ color: '#73C2FB' }}>
              <strong>Cristal de Estado del Sistema</strong>
            </p>
            <p className="text-xs text-gray-600">
              Total de {totalEmails} pergaminos procesados • 
              Tasa de éxito: {formatPercentage(metrics.successRate)} • 
              Tiempo promedio: {formatTime(metrics.averageDeliveryTime)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
