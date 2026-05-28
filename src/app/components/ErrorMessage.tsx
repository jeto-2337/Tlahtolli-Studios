import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export function ErrorMessage({ message, onRetry, showRetry = true }: ErrorMessageProps) {
  return (
    <div 
      className="rounded-lg p-6 flex flex-col items-center text-center space-y-4"
      style={{ backgroundColor: '#FF4C4C' }}
    >
      <div className="flex items-center gap-3 text-white">
        <AlertCircle className="w-6 h-6" />
        <h3 className="text-white">Obstáculo en el camino</h3>
      </div>
      <p className="text-white text-sm max-w-md">
        {message}
      </p>
      {showRetry && onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
        >
          <RefreshCw className="w-4 h-4" />
          Reintentar hechizo
        </button>
      )}
    </div>
  );
}
