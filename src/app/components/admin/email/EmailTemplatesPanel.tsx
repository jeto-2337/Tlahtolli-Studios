import React, { useState } from 'react';
import { ArrowLeft, Mail, Save, RotateCcw, Eye } from 'lucide-react';
import { OrderConfirmationTemplate } from './templates/OrderConfirmationTemplate';
import { StatusChangeTemplate } from './templates/StatusChangeTemplate';
import { ErrorNotificationTemplate } from './templates/ErrorNotificationTemplate';

type TemplateType = 'order_confirmation' | 'status_change' | 'error_notification';

interface EmailTemplatesPanelProps {
  onBack: () => void;
}

export function EmailTemplatesPanel({ onBack }: EmailTemplatesPanelProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('order_confirmation');
  const [showPreview, setShowPreview] = useState(true);

  const templates = [
    { id: 'order_confirmation' as TemplateType, name: 'Confirmación de Pedido', icon: Mail },
    { id: 'status_change' as TemplateType, name: 'Cambio de Estado', icon: Mail },
    { id: 'error_notification' as TemplateType, name: 'Notificación de Error', icon: Mail }
  ];

  const variables = [
    '{{numero_pedido}}',
    '{{resumen_productos}}',
    '{{totales}}',
    '{{estado}}',
    '{{tracking}}',
    '{{direccion_envio}}',
    '{{soporte}}'
  ];

  const handleSave = () => {
    alert('Plantilla guardada exitosamente');
  };

  const handleRestore = () => {
    if (confirm('¿Estás seguro de restaurar los valores por defecto?')) {
      alert('Plantilla restaurada');
    }
  };

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
              <h1 className="text-gray-900">Editor de Plantillas</h1>
              <p className="text-sm text-gray-600 mt-1">
                Personaliza el contenido de los correos enviados
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-4 py-2 rounded-lg text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              {showPreview ? 'Ocultar' : 'Mostrar'} Vista Previa
            </button>
            <button
              onClick={handleRestore}
              className="px-4 py-2 rounded-lg text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Restaurar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg text-white transition-all hover:shadow-md flex items-center gap-2"
              style={{ backgroundColor: '#50C878' }}
            >
              <Save className="w-4 h-4" />
              Guardar
            </button>
          </div>
        </div>

        {/* Template Selector */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-gray-900 mb-4">Seleccionar Plantilla</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates.map((template) => {
              const Icon = template.icon;
              return (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedTemplate === template.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: selectedTemplate === template.id ? '#50C878' : '#F0F0F0'
                      }}
                    >
                      <Icon className={`w-5 h-5 ${selectedTemplate === template.id ? 'text-white' : 'text-gray-600'}`} />
                    </div>
                    <span className="text-sm text-gray-900">{template.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Editor Layout */}
        <div className={`grid ${showPreview ? 'grid-cols-2' : 'grid-cols-1'} gap-6`}>
          {/* Preview */}
          {showPreview && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-gray-900 mb-4">Vista Previa</h2>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {selectedTemplate === 'order_confirmation' && <OrderConfirmationTemplate />}
                {selectedTemplate === 'status_change' && <StatusChangeTemplate />}
                {selectedTemplate === 'error_notification' && <ErrorNotificationTemplate />}
              </div>
            </div>
          )}

          {/* Editor */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-gray-900 mb-4">Editor de Contenido</h2>
            
            {/* Variables */}
            <div className="mb-6">
              <h3 className="text-sm text-gray-600 mb-3">Variables Disponibles</h3>
              <div className="flex flex-wrap gap-2">
                {variables.map((variable) => (
                  <button
                    key={variable}
                    onClick={() => {
                      navigator.clipboard.writeText(variable);
                      alert(`Copiado: ${variable}`);
                    }}
                    className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    {variable}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Editor */}
            <div>
              <label className="text-sm text-gray-600 mb-2 block">Asunto del Correo</label>
              <input
                type="text"
                defaultValue={
                  selectedTemplate === 'order_confirmation'
                    ? 'Tu pedido {{numero_pedido}} ha sido recibido'
                    : selectedTemplate === 'status_change'
                    ? 'Actualización de tu pedido {{numero_pedido}}'
                    : 'Problema con el envío del correo - Pedido {{numero_pedido}}'
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              />

              <label className="text-sm text-gray-600 mb-2 block">Contenido del Correo</label>
              <textarea
                rows={15}
                defaultValue={
                  selectedTemplate === 'order_confirmation'
                    ? `¡Gracias por tu compra!

Tu pedido {{numero_pedido}} ha sido recibido y está siendo procesado.

Resumen de tu pedido:
{{resumen_productos}}

{{totales}}

Dirección de envío:
{{direccion_envio}}

Podrás rastrear tu pedido en: {{tracking}}

Si tienes alguna pregunta, contáctanos en: {{soporte}}`
                    : selectedTemplate === 'status_change'
                    ? `Tu pedido ha sido actualizado

Pedido: {{numero_pedido}}
Nuevo estado: {{estado}}

{{tracking}}

Gracias por tu preferencia.
{{soporte}}`
                    : `Notificación Interna - Error en Envío

No se pudo entregar el correo al cliente.

Pedido: {{numero_pedido}}
Intentos realizados: {{intentos}}
Último error: {{error}}

Revisa el panel de administración para más detalles.`
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
