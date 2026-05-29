import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning';
  isVisible?: boolean;
  onClose: () => void;
}

export function Toast({ message, type = 'error', isVisible = true, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible && message) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, message, onClose]);

  if (!isVisible || !message) return null;

  const getConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          bg: '#7B4FA6',
          iconColor: '#fff'
        };
      case 'error':
        return {
          icon: XCircle,
          bg: '#EF4444',
          iconColor: '#fff'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          bg: '#F59E0B',
          iconColor: '#fff'
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white min-w-[320px]"
        style={{ backgroundColor: config.bg }}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span className="flex-1">{message}</span>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}