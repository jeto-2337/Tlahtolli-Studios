import React, { useState } from 'react';
import { Edit2, Trash2, Package, AlertCircle, CheckCircle } from 'lucide-react';
import { Product } from '../../types';
import { canDeleteProduct } from '../../utils/adminStorage';

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onAdjustStock: (product: Product) => void;
}

export function ProductsTable({ products, onEdit, onDelete, onAdjustStock }: ProductsTableProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDeleteClick = (product: Product) => {
    if (!canDeleteProduct(product)) {
      return;
    }
    
    if (deleteConfirm === product.id) {
      onDelete(product);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(product.id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const getStockStatus = (stock?: number) => {
    const actualStock = stock ?? 0;
    if (actualStock === 0) return { color: '#FF4C4C', text: 'Agotado', icon: AlertCircle };
    if (actualStock <= 5) return { color: '#C9A84C', text: 'Bajo', icon: AlertCircle };
    return { color: '#7B4FA6', text: 'Disponible', icon: CheckCircle };
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      taza: '☕',
      playera: '👕',
      peluche: '🧸',
      figura: '🎮'
    };
    return icons[category] || '📦';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: '#73C2FB' + '20' }}>
            <tr>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">
                Código de producto
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">
                Rareza
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs uppercase tracking-wider text-gray-700">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => {
              const stockStatus = getStockStatus(product.stock);
              const StatusIcon = stockStatus.icon;
              const isDeletable = canDeleteProduct(product);

              return (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 font-mono">
                      {product.sku || '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div>
                        <p className="text-sm text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.collection}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getCategoryIcon(product.category)}</span>
                      <span className="text-sm text-gray-900 capitalize">{product.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{product.rarity}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">${product.price}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => onAdjustStock(product)}
                      className="text-sm text-gray-900 hover:underline cursor-pointer"
                    >
                      {product.stock ?? 0} unidades
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <StatusIcon className="w-4 h-4" style={{ color: stockStatus.color }} />
                      <span className="text-sm" style={{ color: stockStatus.color }}>
                        {stockStatus.text}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(product)}
                        className="p-2 rounded-lg transition-colors hover:bg-gray-100"
                        title="Editar producto"
                      >
                        <Edit2 className="w-4 h-4" style={{ color: '#73C2FB' }} />
                      </button>
                      <button
                        onClick={() => onAdjustStock(product)}
                        className="p-2 rounded-lg transition-colors hover:bg-gray-100"
                        title="Ajustar stock"
                      >
                        <Package className="w-4 h-4" style={{ color: '#7B4FA6' }} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(product)}
                        disabled={!isDeletable}
                        className={`p-2 rounded-lg transition-colors ${
                          isDeletable 
                            ? 'hover:bg-red-50' 
                            : 'opacity-50 cursor-not-allowed'
                        }`}
                        title={
                          isDeletable 
                            ? deleteConfirm === product.id 
                              ? 'Confirmar eliminación' 
                              : 'Eliminar producto'
                            : 'No se puede eliminar: tiene SKU o ventas'
                        }
                      >
                        <Trash2 
                          className="w-4 h-4" 
                          style={{ color: deleteConfirm === product.id ? '#FF4C4C' : '#6B7280' }} 
                        />
                      </button>
                    </div>
                    {!isDeletable && (
                      <p className="text-xs text-gray-500 mt-1">No eliminable</p>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {products.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 mb-2">No hay productos en el catálogo</p>
          <p className="text-sm text-gray-500">Comienza creando tu primer producto</p>
        </div>
      )}
    </div>
  );
}