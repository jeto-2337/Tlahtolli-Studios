import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mail, BarChart3, FileText, Send, Zap, AlertTriangle } from 'lucide-react';
import { EmailLogsPanel } from './EmailLogsPanel';
import { EmailMetricsPanel } from './EmailMetricsPanel';
import { EmailTemplatesPanel } from './EmailTemplatesPanel';
import { EmailLog, DEFAULT_RETRY_POLICY } from '../../../types/email';
import { 
  getEmailLogs, 
  getEmailTemplates, 
  calculateMetrics,
  retryEmail,
  simulateBulkSend,
  sendEmail
} from '../../../utils/emailStorage';

type EmailView = 'logs' | 'metrics' | 'templates';

interface EmailDashboardProps {
  onBack: () => void;
}

export function EmailDashboard({ onBack }: EmailDashboardProps) {
  const [currentView, setCurrentView] = useState<EmailView>('logs');
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [templates, setTemplates] = useState<EmailLog[]>([]);
  const [isSendingBulk, setIsSendingBulk] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);

  const loadData = () => {
    setLogs(getEmailLogs());
    setTemplates(getEmailTemplates());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    loadData();
  };

  const handleRetry = async (log: EmailLog) => {
    await retryEmail(log);
    loadData();
  };

  const handleBulkSend = async () => {
    if (confirm('¿Deseas simular el envío de 1000 correos para prueba de carga?')) {
      setIsSendingBulk(true);
      await simulateBulkSend(1000);
      setIsSendingBulk(false);
      loadData();
    }
  };

  const handleTestEmail = async () => {
    setIsSendingTest(true);
    await sendEmail(
      'order_confirmation',
      'test@example.com',
      'Correo de Prueba',
      'template-order-confirmation',
      { test: true }
    );
    setIsSendingTest(false);
    loadData();
  };

  const metrics = calculateMetrics();
  const emailTemplates = getEmailTemplates();

  const activeRetries = logs.filter(l => l.status === 'retrying').length;
  const recentFailures = logs.filter(l => {
    const isRecent = Date.now() - new Date(l.timestamp).getTime() < 3600000; // última hora
    return l.status === 'failed' && isRecent;
  }).length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F4F0F8' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al panel de administración
          </button>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Mail className="w-8 h-8" style={{ color: '#73C2FB' }} />
                <h1 className="text-gray-900">Observatorio de Mensajes del Gremio</h1>
              </div>
              <p className="text-gray-600 flex items-center gap-2">
                <span>✦</span>
                Sistema de monitoreo de correos automáticos
                <span>✦</span>
              </p>
            </div>
          </div>
        </div>

        {/* Alertas */}
        {(activeRetries > 0 || recentFailures > 0) && (
          <div className="mb-6 space-y-3">
            {activeRetries > 0 && (
              <div 
                className="p-4 rounded-lg border flex items-start gap-3"
                style={{ backgroundColor: '#C9A84C' + '20', borderColor: '#C9A84C' }}
              >
                <Zap className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#C9A84C' }} />
                <div>
                  <p className="text-sm mb-1" style={{ color: '#666' }}>
                    <strong>Reinvocaciones en Curso</strong>
                  </p>
                  <p className="text-sm text-gray-600">
                    Hay {activeRetries} correo{activeRetries > 1 ? 's' : ''} siendo reintentado{activeRetries > 1 ? 's' : ''} automáticamente. 
                    Política: {DEFAULT_RETRY_POLICY.maxRetries} intentos cada {DEFAULT_RETRY_POLICY.retryIntervalMinutes} minutos.
                  </p>
                </div>
              </div>
            )}
            
            {recentFailures > 0 && (
              <div 
                className="p-4 rounded-lg border flex items-start gap-3"
                style={{ backgroundColor: '#FF4C4C' + '20', borderColor: '#FF4C4C' }}
              >
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#FF4C4C' }} />
                <div>
                  <p className="text-sm mb-1" style={{ color: '#FF4C4C' }}>
                    <strong>Interrupciones del Hechizo Detectadas</strong>
                  </p>
                  <p className="text-sm text-gray-600">
                    Se detectaron {recentFailures} fallo{recentFailures > 1 ? 's' : ''} en la última hora. 
                    Revisa los logs para más detalles.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navegación */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setCurrentView('logs')}
              className={`flex-1 px-6 py-4 flex items-center justify-center gap-2 transition-colors ${
                currentView === 'logs' 
                  ? 'border-b-2 text-gray-900' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              style={currentView === 'logs' ? { borderColor: '#73C2FB' } : {}}
            >
              <Mail className="w-5 h-5" />
              <span>Registro de Pergaminos</span>
              <span 
                className="px-2 py-1 rounded-full text-xs"
                style={{ backgroundColor: '#73C2FB' + '20', color: '#73C2FB' }}
              >
                {logs.length}
              </span>
            </button>
            <button
              onClick={() => setCurrentView('metrics')}
              className={`flex-1 px-6 py-4 flex items-center justify-center gap-2 transition-colors ${
                currentView === 'metrics' 
                  ? 'border-b-2 text-gray-900' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              style={currentView === 'metrics' ? { borderColor: '#73C2FB' } : {}}
            >
              <BarChart3 className="w-5 h-5" />
              <span>Cristales de Estado</span>
            </button>
            <button
              onClick={() => setCurrentView('templates')}
              className={`flex-1 px-6 py-4 flex items-center justify-center gap-2 transition-colors ${
                currentView === 'templates' 
                  ? 'border-b-2 text-gray-900' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              style={currentView === 'templates' ? { borderColor: '#73C2FB' } : {}}
            >
              <FileText className="w-5 h-5" />
              <span>Pergaminos de Invocación</span>
              <span 
                className="px-2 py-1 rounded-full text-xs"
                style={{ backgroundColor: '#73C2FB' + '20', color: '#73C2FB' }}
              >
                {emailTemplates.length}
              </span>
            </button>
          </div>
        </div>

        {/* Acciones rápidas */}
        {currentView === 'logs' && (
          <div className="flex gap-4 mb-6">
            <button
              onClick={handleTestEmail}
              disabled={isSendingTest}
              className="px-6 py-3 rounded-lg text-white transition-all hover:shadow-md flex items-center gap-2 disabled:opacity-50"
              style={{ backgroundColor: '#7B4FA6' }}
            >
              <Send className={`w-5 h-5 ${isSendingTest ? 'animate-pulse' : ''}`} />
              {isSendingTest ? 'Enviando...' : 'Enviar Correo de Prueba'}
            </button>
            <button
              onClick={handleBulkSend}
              disabled={isSendingBulk}
              className="px-6 py-3 rounded-lg border-2 transition-all hover:shadow-sm flex items-center gap-2 disabled:opacity-50"
              style={{ borderColor: '#73C2FB', color: '#73C2FB' }}
            >
              <Zap className={`w-5 h-5 ${isSendingBulk ? 'animate-pulse' : ''}`} />
              {isSendingBulk ? 'Enviando...' : 'Prueba de Carga (1000 correos)'}
            </button>
          </div>
        )}

        {/* Contenido */}
        {currentView === 'logs' && (
          <EmailLogsPanel
            logs={logs}
            onRefresh={handleRefresh}
            onRetry={handleRetry}
          />
        )}

        {currentView === 'metrics' && (
          <EmailMetricsPanel metrics={metrics} />
        )}

        {currentView === 'templates' && (
          <EmailTemplatesPanel templates={emailTemplates} />
        )}

        {/* Info de política de reintentos */}
        <div 
          className="mt-6 p-4 rounded-lg border"
          style={{ backgroundColor: '#73C2FB' + '20', borderColor: '#73C2FB' }}
        >
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#73C2FB' }} />
            <div>
              <p className="text-sm mb-2" style={{ color: '#73C2FB' }}>
                <strong>Política de Reinvocaciones Automáticas</strong>
              </p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Máximo de reintentos: <strong>{DEFAULT_RETRY_POLICY.maxRetries}</strong></li>
                <li>• Intervalo base: <strong>{DEFAULT_RETRY_POLICY.retryIntervalMinutes} minutos</strong></li>
                <li>• Multiplicador de retroceso: <strong>{DEFAULT_RETRY_POLICY.backoffMultiplier}x</strong></li>
                <li>• Los reintentos se programan automáticamente al detectar un fallo</li>
                <li>• Después de agotar reintentos, el correo se marca como fallido permanentemente</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
