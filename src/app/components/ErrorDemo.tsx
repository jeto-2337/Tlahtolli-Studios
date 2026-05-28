import React, { useState } from 'react';
import { ErrorMessage } from './ErrorMessage';

export function ErrorDemo() {
  const [showError, setShowError] = useState(false);

  const handleTriggerError = () => {
    setShowError(true);
  };

  const handleRetry = () => {
    setShowError(false);
    // Aquí simularíamos un reintento de la acción
    console.log('Reintentando acción...');
  };

  return (
    <div className="min-h-screen py-12 px-4" style={{ backgroundColor: '#FFFDD0' }}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-center text-gray-900 mb-8">Demo de Manejo de Errores</h1>
        
        {!showError ? (
          <div className="text-center">
            <button
              onClick={handleTriggerError}
              className="px-6 py-3 rounded-lg text-white"
              style={{ backgroundColor: '#50C878' }}
            >
              Simular Error
            </button>
          </div>
        ) : (
          <ErrorMessage
            message="No pudimos procesar tu solicitud. El servidor de la tienda está experimentando dificultades temporales. Por favor, intenta nuevamente en unos momentos."
            onRetry={handleRetry}
          />
        )}

        <div className="mt-12 space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-gray-900 mb-4">Escenarios de Error Implementados</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span>✦</span>
                <span>Error al agregar producto al carrito</span>
              </li>
              <li className="flex items-center gap-2">
                <span>✦</span>
                <span>Error al continuar compra como invitado</span>
              </li>
              <li className="flex items-center gap-2">
                <span>✦</span>
                <span>Error al generar orden</span>
              </li>
              <li className="flex items-center gap-2">
                <span>✦</span>
                <span>Error al procesar información de envío</span>
              </li>
              <li className="flex items-center gap-2">
                <span>✦</span>
                <span>Error al procesar pago</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-gray-900 mb-4">Narrativa Simbólica</h3>
            <p className="text-sm text-gray-600 mb-3">
              Los errores se presentan como "obstáculos en el camino" o "interrupciones mágicas", 
              manteniendo la narrativa del universo del videojuego.
            </p>
            <p className="text-sm text-gray-600">
              El botón "Reintentar hechizo" invita al usuario a intentar nuevamente de una manera 
              lúdica y acorde con la temática de la tienda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
