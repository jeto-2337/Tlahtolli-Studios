import React, { useState } from 'react';
import { Package, Save, X, TrendingUp, TrendingDown, CheckCircle, Clock } from 'lucide-react';
import { Product } from '../../types';
import { AdjustmentReason, getAdjustmentReasonText, getAdjustmentReasonIcon } from '../../types/admin';
import { getProductAdjustments } from '../../utils/adminStorage';

interface InventoryAdjustmentPanelProps {
  product: Product;
  onSave: (newStock: number, reason: string) => void;
  onCancel: () => void;
}

export function InventoryAdjustmentPanel({ product, onSave, onCancel }: InventoryAdjustmentPanelProps) {
  const [newStock, setNewStock] = useState(product.stock ?? 0);
  const [reason, setReason] = useState<AdjustmentReason>('manual');
  const [customReason, setCustomReason] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  
  const currentStock = product.stock ?? 0;
  const adjustment = newStock - currentStock;
  const history = getProductAdjustments(product.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalReason = customReason.trim() || getAdjustmentReasonText(reason);
    onSave(newStock, finalReason);
    
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onCancel();
    }, 1500);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-900 mb-2">Ajustar Inventario</h2>
          <p className="text-sm text-gray-600">
            Modifica el stock del tesoro: {product.name}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Stock actual y nuevo */}
        <div className="grid md:grid-cols-3 gap-6">
          <div 
            className="p-4 rounded-lg border"
            style={{ backgroundColor: '#73C2FB' + '20', borderColor: '#73C2FB' }}
          >
            <p className="text-sm text-gray-600 mb-1">Stock Actual</p>
            <p className="text-2xl text-gray-900">{currentStock}</p>
            <p className="text-xs text-gray-500 mt-1">unidades</p>
          </div>

          <div 
            className="p-4 rounded-lg border"
            style={{ 
              backgroundColor: adjustment === 0 ? '#F3F4F6' : adjustment > 0 ? '#50C878' + '20' : '#FF4C4C' + '20',
              borderColor: adjustment === 0 ? '#E5E7EB' : adjustment > 0 ? '#50C878' : '#FF4C4C'
            }}
          >
            <p className="text-sm text-gray-600 mb-1">Ajuste</p>
            <div className="flex items-center gap-2">
              {adjustment > 0 ? (
                <TrendingUp className="w-6 h-6" style={{ color: '#50C878' }} />
              ) : adjustment < 0 ? (
                <TrendingDown className="w-6 h-6" style={{ color: '#FF4C4C' }} />
              ) : null}
              <p className="text-2xl" style={{ 
                color: adjustment === 0 ? '#6B7280' : adjustment > 0 ? '#50C878' : '#FF4C4C' 
              }}>
                {adjustment > 0 ? '+' : ''}{adjustment}
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-1">unidades</p>
          </div>

          <div 
            className="p-4 rounded-lg border"
            style={{ backgroundColor: '#F0E68C' + '20', borderColor: '#F0E68C' }}
          >
            <p className="text-sm text-gray-600 mb-1">Stock Nuevo</p>
            <p className="text-2xl text-gray-900">{newStock}</p>
            <p className="text-xs text-gray-500 mt-1">unidades</p>
          </div>
        </div>

        {/* Control de stock */}
        <div>
          <label htmlFor="newStock" className="block text-sm text-gray-700 mb-2">
            Nuevo Stock *
          </label>
          <input
            type="number"
            id="newStock"
            value={newStock}
            onChange={(e) => setNewStock(parseInt(e.target.value) || 0)}
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 outline-none transition-all"
            required
          />
        </div>

        {/* Motivo predefinido */}
        <div>
          <label htmlFor="reason" className="block text-sm text-gray-700 mb-2">
            Motivo del Ajuste *
          </label>
          <select
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value as AdjustmentReason)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 outline-none transition-all"
          >
            <option value="manual">{getAdjustmentReasonIcon('manual')} {getAdjustmentReasonText('manual')}</option>
            <option value="correction">{getAdjustmentReasonIcon('correction')} {getAdjustmentReasonText('correction')}</option>
            <option value="restock">{getAdjustmentReasonIcon('restock')} {getAdjustmentReasonText('restock')}</option>
            <option value="damage">{getAdjustmentReasonIcon('damage')} {getAdjustmentReasonText('damage')}</option>
            <option value="sale">{getAdjustmentReasonIcon('sale')} {getAdjustmentReasonText('sale')}</option>
            <option value="return">{getAdjustmentReasonIcon('return')} {getAdjustmentReasonText('return')}</option>
          </select>
        </div>

        {/* Motivo personalizado */}
        <div>
          <label htmlFor="customReason" className="block text-sm text-gray-700 mb-2">
            Motivo Personalizado (opcional)
          </label>
          <textarea
            id="customReason"
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            placeholder="Escribe un motivo personalizado..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 outline-none transition-all resize-none"
          />
          <p className="text-xs text-gray-500 mt-2">
            Si dejas esto vacío, se usará el motivo predefinido seleccionado
          </p>
        </div>

        {/* Historial reciente */}
        {history.length > 0 && (
          <div>
            <h3 className="text-sm text-gray-700 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Historial Reciente (últimos 5 ajustes)
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {history.slice(-5).reverse().map((adj) => (
                <div 
                  key={adj.id}
                  className="p-3 rounded-lg border bg-gray-50 text-sm"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {adj.adjustment > 0 ? (
                        <TrendingUp className="w-4 h-4" style={{ color: '#50C878' }} />
                      ) : (
                        <TrendingDown className="w-4 h-4" style={{ color: '#FF4C4C' }} />
                      )}
                      <span className="text-gray-900">
                        {adj.previousStock} → {adj.newStock} ({adj.adjustment > 0 ? '+' : ''}{adj.adjustment})
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(adj.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {adj.reason} • {adj.adjustedBy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mensaje de éxito */}
        {showSuccess && (
          <div 
            className="p-4 rounded-lg flex items-center gap-3"
            style={{ backgroundColor: '#50C878' }}
          >
            <CheckCircle className="w-5 h-5 text-white" />
            <p className="text-white">
              ¡Inventario ajustado exitosamente!
            </p>
          </div>
        )}

        {/* Botones */}
        <div className="flex items-center gap-4 pt-4 border-t">
          <button
            type="submit"
            disabled={adjustment === 0}
            className="flex-1 px-6 py-3 rounded-lg text-white transition-all hover:shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#50C878' }}
          >
            <Save className="w-5 h-5" />
            Confirmar Ajuste
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}