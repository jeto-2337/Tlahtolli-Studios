import React, { useState } from 'react';
import { Mail, CheckCircle, AlertCircle, Clock, Send, FileText, ArrowLeft, Activity, TrendingUp, AlertTriangle } from 'lucide-react';
import { EmailLogsPanel } from './EmailLogsPanel';
import { EmailTemplatesPanel } from './EmailTemplatesPanel';

type EmailView = 'dashboard' | 'logs' | 'templates';

interface EmailNotificationsDashboardProps {
  onBack: () => void;
}

export function EmailNotificationsDashboard({ onBack }: EmailNotificationsDashboardProps) {
  const [currentView, setCurrentView] = useState<EmailView>('dashboard');
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleTestEmail = () => {
    setTestResult('Correo de prueba enviado exitosamente');
    setTimeout(() => setTestResult(null), 3000);
  };

  if (currentView === 'logs') {
    return <EmailLogsPanel onBack={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'templates') {
    return <EmailTemplatesPanel onBack={() => setCurrentView('dashboard')} />;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F4F0F8' }}>
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
              <h1 className="text-gray-900 flex items-center gap-2">
                <Mail className="w-8 h-8" style={{ color: '#7B4FA6' }} />
                Notificaciones por Correo
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Gestión y monitoreo del sistema de notificaciones
              </p>
            </div>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* SMTP Status */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-6 h-6 text-gray-400" />
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: '#7B4FA6' }}></div>
                <span className="text-xs text-gray-600">Activo</span>
              </div>
            </div>
            <h3 className="text-sm text-gray-600 mb-1">Estado SMTP</h3>
            <p className="text-gray-900">Operativo</p>
          </div>

          {/* Last Sent */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <Send className="w-6 h-6 text-gray-400" />
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="text-sm text-gray-600 mb-1">Último Envío</h3>
            <p className="text-gray-900">Hace 5 minutos</p>
            <p className="text-xs text-gray-500 mt-1">Confirmación de pedido</p>
          </div>

          {/* Emails Today */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <Mail className="w-6 h-6 text-gray-400" />
              <TrendingUp className="w-5 h-5" style={{ color: '#7B4FA6' }} />
            </div>
            <h3 className="text-sm text-gray-600 mb-1">Enviados Hoy</h3>
            <p className="text-gray-900">247</p>
            <p className="text-xs" style={{ color: '#7B4FA6' }}>+12% vs ayer</p>
          </div>

          {/* Failed Emails */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <AlertCircle className="w-6 h-6 text-gray-400" />
              <AlertTriangle className="w-5 h-5" style={{ color: '#C9A84C' }} />
            </div>
            <h3 className="text-sm text-gray-600 mb-1">Fallidos</h3>
            <p className="text-gray-900">3</p>
            <p className="text-xs text-gray-500 mt-1">2 reintentando</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Actividad Reciente
          </h2>
          <div className="space-y-3">
            {[
              { type: 'Confirmación', order: '#TN89F2', status: 'success', time: 'Hace 5 min' },
              { type: 'Cambio de estado', order: '#TN89E1', status: 'success', time: 'Hace 12 min' },
              { type: 'Confirmación', order: '#TN89D4', status: 'retrying', time: 'Hace 18 min' },
              { type: 'Confirmación', order: '#TN89C7', status: 'success', time: 'Hace 25 min' },
              { type: 'Cambio de estado', order: '#TN89B3', status: 'success', time: 'Hace 32 min' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  {activity.status === 'success' ? (
                    <CheckCircle className="w-5 h-5" style={{ color: '#7B4FA6' }} />
                  ) : (
                    <Clock className="w-5 h-5" style={{ color: '#C9A84C' }} />
                  )}
                  <div>
                    <p className="text-sm text-gray-900">{activity.type}</p>
                    <p className="text-xs text-gray-500">Pedido {activity.order}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600">{activity.time}</p>
                  {activity.status === 'retrying' && (
                    <p className="text-xs" style={{ color: '#C9A84C' }}>Reintentando...</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handleTestEmail}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#7B4FA6' }}>
                <Send className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-gray-900">Probar Envío</h3>
            </div>
            <p className="text-sm text-gray-600">
              Enviar un correo de prueba para verificar la configuración SMTP
            </p>
          </button>

          <button
            onClick={() => setCurrentView('logs')}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#73C2FB' }}>
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-gray-900">Historial Completo</h3>
            </div>
            <p className="text-sm text-gray-600">
              Ver todos los envíos, reintentos y errores del sistema
            </p>
          </button>

          <button
            onClick={() => setCurrentView('templates')}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#C9A84C' }}>
                <Mail className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-gray-900">Editar Plantillas</h3>
            </div>
            <p className="text-sm text-gray-600">
              Personalizar el contenido de los correos enviados
            </p>
          </button>
        </div>

        {/* Test Result Toast */}
        {testResult && (
          <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 flex items-center gap-3 animate-fade-in">
            <CheckCircle className="w-5 h-5" style={{ color: '#7B4FA6' }} />
            <p className="text-sm text-gray-900">{testResult}</p>
          </div>
        )}
      </div>
    </div>
  );
}
