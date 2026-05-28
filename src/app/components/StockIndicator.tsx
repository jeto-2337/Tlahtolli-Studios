import React from 'react';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface StockIndicatorProps {
  stock: number;
  size?: 'sm' | 'md';
}

export function StockIndicator({ stock, size = 'md' }: StockIndicatorProps) {
  const getStockStatus = () => {
    if (stock === 0) {
      return {
        icon: XCircle,
        text: 'Agotado',
        color: '#EF4444',
        bgColor: '#FEE2E2',
        textColor: '#DC2626'
      };
    } else if (stock <= 5) {
      return {
        icon: AlertCircle,
        text: `Últimas ${stock} unidades`,
        color: '#F59E0B',
        bgColor: '#FEF3C7',
        textColor: '#D97706'
      };
    } else {
      return {
        icon: CheckCircle,
        text: 'En stock',
        color: '#50C878',
        bgColor: '#D1FAE5',
        textColor: '#059669'
      };
    }
  };

  const status = getStockStatus();
  const Icon = status.icon;
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  const padding = size === 'sm' ? 'px-2 py-1' : 'px-3 py-1.5';

  return (
    <div 
      className={`inline-flex items-center gap-1.5 rounded-full ${padding} ${textSize}`}
      style={{ 
        backgroundColor: status.bgColor,
        color: status.textColor
      }}
    >
      <Icon className={iconSize} />
      <span>{status.text}</span>
    </div>
  );
}
