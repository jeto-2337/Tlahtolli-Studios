import React, { useState, useEffect } from 'react';
import { Plus, Upload, Package, ArrowLeft, Shield, TrendingUp, Mail, Bell, Download, ScrollText } from 'lucide-react';
import { Product } from '../../types';
import { ProductFormData } from '../../types/admin';
import { ProductsTable } from './ProductsTable';
import { ProductForm } from './ProductForm';
import { InventoryAdjustmentPanel } from './InventoryAdjustmentPanel';
import { ExcelImport } from './ExcelImport';
import { EmailNotificationsDashboard } from './email/EmailNotificationsDashboard';
import { RestockSubscriptionsPanel } from './RestockSubscriptionsPanel';
import { AuditLogPanel } from './AuditLogPanel';
import { saveAdjustment } from '../../utils/adminStorage';
import { downloadExampleCSV } from '../../utils/excelParser';
import { productsApi } from '../../utils/api';
import { saveAuditLog } from '../../utils/auditLog';
import { useAuth } from '../../contexts/AuthContext';

type AdminView = 'list' | 'create' | 'edit' | 'adjust' | 'import' | 'emails' | 'subscriptions' | 'audit';

interface AdminDashboardProps {
  onBack: () => void;
  adminName?: string;
}

export function AdminDashboard({ onBack, adminName = 'Administrador' }: AdminDashboardProps) {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [currentView, setCurrentView] = useState<AdminView>('list');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener información del admin
  const adminEmail = user?.email || 'admin@tonalli.com';
  const adminDisplayName = adminName || user?.name || 'Administrador';

  // Redirigir al admin de correos directamente a notificaciones
  useEffect(() => {
    if (adminName.includes('Notificaciones')) {
      setCurrentView('emails');
    }
  }, [adminName]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    setError(null);
    
    const result = await productsApi.getAll();
    
    if (result.error) {
      console.error('❌ Error cargando productos:', result.error);
      setError(result.error);
    } else {
      console.log('✅ Productos cargados desde la base de datos:', result.data?.length);
      setProducts(result.data || []);
    }
    
    setIsLoading(false);
  };

  const handleCreateProduct = async (formData: ProductFormData) => {
    console.log('🆕 CREANDO NUEVO PRODUCTO:', formData);
    
    const result = await productsApi.create({
      ...formData,
      isAvailable: formData.stock > 0,
      hasSales: false
    });

    if (result.error) {
      alert(` Error al crear producto: ${result.error}`);
      console.error('Error:', result.error);
      return;
    }
    
    // Registrar en audit log
    saveAuditLog(
      'PRODUCT_CREATED',
      adminDisplayName,
      adminEmail,
      {
        productId: result.data?.id,
        productSku: formData.sku,
        productName: formData.name,
        stockChange: {
          before: 0,
          after: formData.stock,
          adjustment: formData.stock
        },
        metadata: {
          category: formData.category,
          rarity: formData.rarity,
          price: formData.price,
          collection: formData.collection
        }
      }
    );
    
    console.log('✅ Producto creado exitosamente');
    await loadProducts();
    
    setTimeout(() => {
      setCurrentView('list');
    }, 1500);
  };

  const handleUpdateProduct = async (formData: ProductFormData) => {
    if (!selectedProduct) return;

    console.log('✏️ ACTUALIZANDO PRODUCTO:', selectedProduct.id, selectedProduct.name);
    console.log('📝 Nuevos datos:', formData);

    // Detectar cambios
    const changes: Record<string, { before: any; after: any }> = {};
    if (formData.name !== selectedProduct.name) {
      changes.name = { before: selectedProduct.name, after: formData.name };
    }
    if (formData.price !== selectedProduct.price) {
      changes.price = { before: selectedProduct.price, after: formData.price };
    }
    if (formData.stock !== selectedProduct.stock) {
      changes.stock = { before: selectedProduct.stock, after: formData.stock };
    }
    if (formData.category !== selectedProduct.category) {
      changes.category = { before: selectedProduct.category, after: formData.category };
    }
    if (formData.rarity !== selectedProduct.rarity) {
      changes.rarity = { before: selectedProduct.rarity, after: formData.rarity };
    }
    if (formData.collection !== selectedProduct.collection) {
      changes.collection = { before: selectedProduct.collection, after: formData.collection };
    }

    const result = await productsApi.update(selectedProduct.id, {
      ...formData,
      isAvailable: formData.stock > 0
    });

    if (result.error) {
      alert(`❌ Error al actualizar producto: ${result.error}`);
      console.error('Error:', result.error);
      return;
    }
    
    // Registrar en audit log
    saveAuditLog(
      'PRODUCT_UPDATED',
      adminDisplayName,
      adminEmail,
      {
        productId: selectedProduct.id,
        productSku: formData.sku,
        productName: formData.name,
        changes,
        ...(formData.stock !== selectedProduct.stock && {
          stockChange: {
            before: selectedProduct.stock || 0,
            after: formData.stock,
            adjustment: formData.stock - (selectedProduct.stock || 0)
          }
        })
      }
    );
    
    console.log('✅ Producto actualizado exitosamente');
    await loadProducts();

    setTimeout(() => {
      setCurrentView('list');
      setSelectedProduct(null);
    }, 1500);
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!window.confirm(`¿Eliminar \"${product.name}\"?`)) {
      return;
    }

    console.log('🗑️ ELIMINANDO PRODUCTO:', product.id, product.name);
    
    const result = await productsApi.delete(product.id);

    if (result.error) {
      alert(`❌ Error al eliminar producto: ${result.error}`);
      console.error('Error:', result.error);
      return;
    }
    
    // Registrar en audit log
    saveAuditLog(
      'PRODUCT_DELETED',
      adminDisplayName,
      adminEmail,
      {
        productId: product.id,
        productSku: product.sku,
        productName: product.name,
        metadata: {
          category: product.category,
          rarity: product.rarity,
          price: product.price,
          lastStock: product.stock
        }
      }
    );
    
    console.log('✅ Producto eliminado exitosamente');
    await loadProducts();
  };

  const handleAdjustStock = async (newStock: number, reason: string) => {
    if (!selectedProduct) return;

    const previousStock = selectedProduct.stock || 0;
    const adjustment = newStock - previousStock;

    // Registrar el ajuste en localStorage (para historial)
    saveAdjustment({
      id: `adj-${Date.now()}`,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      previousStock,
      newStock,
      adjustment,
      reason,
      adjustedBy: adminName,
      timestamp: new Date().toISOString()
    });

    // Actualizar el producto en la base de datos
    const result = await productsApi.update(selectedProduct.id, {
      stock: newStock,
      isAvailable: newStock > 0
    });

    if (result.error) {
      alert(`❌ Error al ajustar stock: ${result.error}`);
      console.error('Error:', result.error);
      return;
    }

    // Registrar en audit log
    saveAuditLog(
      'INVENTORY_ADJUSTED',
      adminDisplayName,
      adminEmail,
      {
        productId: selectedProduct.id,
        productSku: selectedProduct.sku,
        productName: selectedProduct.name,
        stockChange: {
          before: previousStock,
          after: newStock,
          adjustment,
          reason
        }
      }
    );

    console.log('✅ Stock ajustado exitosamente');
    await loadProducts();
    
    // IMPORTANTE: Actualizar el selectedProduct con los nuevos valores
    setSelectedProduct({
      ...selectedProduct,
      stock: newStock,
      isAvailable: newStock > 0,
      updatedAt: new Date().toISOString()
    });
  };

  const handleImportProducts = async (importedProducts: ProductFormData[]) => {
    console.log('📥 Importando productos...', importedProducts.length);
    
    let created = 0;
    let updated = 0;
    let errors = 0;

    for (const formData of importedProducts) {
      // Verificar si el SKU ya existe
      const existingProducts = products.filter(p => p.sku === formData.sku);
      
      if (existingProducts.length > 0) {
        // Actualizar producto existente
        const result = await productsApi.update(existingProducts[0].id, {
          ...formData,
          isAvailable: formData.stock > 0
        });
        
        if (result.error) {
          console.error(`Error actualizando ${formData.name}:`, result.error);
          errors++;
        } else {
          updated++;
        }
      } else {
        // Crear nuevo producto
        const result = await productsApi.create({
          ...formData,
          isAvailable: formData.stock > 0,
          hasSales: false
        });
        
        if (result.error) {
          console.error(`Error creando ${formData.name}:`, result.error);
          errors++;
        } else {
          created++;
        }
      }
    }

    await loadProducts();

    // Registrar en audit log
    saveAuditLog(
      'BULK_IMPORT',
      adminDisplayName,
      adminEmail,
      {
        bulkImport: {
          created,
          updated,
          errors
        },
        metadata: {
          totalProducts: importedProducts.length,
          timestamp: new Date().toISOString()
        }
      }
    );

    console.log(`
      ═══════════════════════════════════════
      📦 IMPORTACIÓN COMPLETADA
      ═══════════════════════════════════════
      Productos nuevos: ${created}
      Productos actualizados: ${updated}
      Errores: ${errors}
      Total en catálogo: ${products.length}
      ═══════════════════════════════════════
    `);

    alert(`✅ Importación completada:\n\n✨ Nuevos: ${created}\n✏️ Actualizados: ${updated}\n${errors > 0 ? `❌ Errores: ${errors}\n` : ''}Total: ${products.length} productos`);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('edit');
  };

  const handleAdjustStockClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('adjust');
  };

  const handleCancel = () => {
    setCurrentView('list');
    setSelectedProduct(null);
  };

  const handleResetProducts = async () => {
    if (window.confirm('⚠️ ¿Estás seguro de que quieres resetear todos los productos a los valores iniciales? Esta acción no se puede deshacer.')) {
      console.log('🔄 RESETEANDO PRODUCTOS A VALORES INICIALES...');
      
      const result = await productsApi.reset();
      
      if (result.error) {
        alert(`❌ Error al resetear productos: ${result.error}`);
        console.error('Error:', result.error);
        return;
      }
      
      console.log('✅ Productos reseteados exitosamente');
      await loadProducts();
      alert('✅ Productos reseteados a valores iniciales');
    }
  };

  const handleVerifyStorage = async () => {
    const result = await productsApi.getAll();
    
    console.log('═══════════════════════════════════════');
    console.log('📊 ESTADO DE LA BASE DE DATOS');
    console.log('═══════════════════════════════════════');
    console.log('Total productos en DB:', result.data?.length || 0);
    console.log('Productos en memoria:', products.length);
    console.log('Productos en DB:', result.data);
    console.log('═══════════════════════════════════════');
    
    alert(`📊 Base de Datos:\n\nProductos guardados: ${result.data?.length || 0}\nProductos en memoria: ${products.length}\n\nRevisa la consola para más detalles.`);
  };

  const handleClearAllProducts = async () => {
    if (window.confirm('🗑️ ¿ELIMINAR TODO EL CATÁLOGO?\n\nEsta acción borrará TODOS los productos del sistema.\nPodrás restaurar los productos iniciales después.\n\n¿Estás seguro?')) {
      console.log('🗑️ ELIMINANDO TODO EL CATÁLOGO...');
      
      const result = await productsApi.clearAll();
      
      if (result.error) {
        alert(`❌ Error al limpiar catálogo: ${result.error}`);
        console.error('Error:', result.error);
        return;
      }
      
      console.log('✅ Catálogo completamente limpio');
      await loadProducts();
      alert('✅ Catálogo limpio. Puedes empezar a agregar productos o resetear a los valores iniciales.');
    }
  };

  const handleAuditLog = () => {
    setCurrentView('audit');
  };

  const stats = {
    total: products.length,
    inStock: products.filter(p => (p.stock || 0) > 0).length,
    outOfStock: products.filter(p => (p.stock || 0) === 0).length,
    lowStock: products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= 5).length
  };

  // Mostrar loading o error
  if (isLoading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F7FA' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#50C878' }}></div>
          <p className="text-gray-600">Cargando productos desde la base de datos...</p>
        </div>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F7FA' }}>
        <div className="text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-gray-900 mb-2">Error al cargar productos</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadProducts}
            className="px-6 py-3 rounded-lg text-white transition-all"
            style={{ backgroundColor: '#50C878' }}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F7FA' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6 px-4 py-2 rounded-lg hover:bg-white"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver a la tienda
          </button>

          <div className="flex items-center justify-between bg-white rounded-lg p-6 shadow-sm">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#2563EB' }}>
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-gray-900">Panel de Administración</h1>
                  <p className="text-sm text-gray-500">
                    Sistema de gestión de inventario TONALLI
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right bg-blue-50 px-6 py-3 rounded-lg">
              <p className="text-xs text-gray-600 uppercase tracking-wide">Administrador</p>
              <p className="text-gray-900 font-medium">{adminDisplayName}</p>
            </div>
          </div>
        </div>

        {currentView === 'list' && (
          <>
            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-600 uppercase tracking-wide">Total Productos</p>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E5E7EB' }}>
                    <Package className="w-5 h-5 text-gray-600" />
                  </div>
                </div>
                <p className="text-3xl text-gray-900">{stats.total}</p>
                <p className="text-xs text-gray-500 mt-1">Productos totales en catálogo</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-600 uppercase tracking-wide">En Stock</p>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#D1FAE5' }}>
                    <TrendingUp className="w-5 h-5" style={{ color: '#10B981' }} />
                  </div>
                </div>
                <p className="text-3xl" style={{ color: '#10B981' }}>{stats.inStock}</p>
                <p className="text-xs text-gray-500 mt-1">Productos disponibles</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-yellow-200">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-600 uppercase tracking-wide">Stock Bajo</p>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FEF3C7' }}>
                    <TrendingUp className="w-5 h-5" style={{ color: '#F59E0B' }} />
                  </div>
                </div>
                <p className="text-3xl" style={{ color: '#F59E0B' }}>{stats.lowStock}</p>
                <p className="text-xs text-gray-500 mt-1">Requieren reabastecimiento</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-red-200">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-600 uppercase tracking-wide">Agotados</p>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FEE2E2' }}>
                    <TrendingUp className="w-5 h-5" style={{ color: '#EF4444' }} />
                  </div>
                </div>
                <p className="text-3xl" style={{ color: '#EF4444' }}>{stats.outOfStock}</p>
                <p className="text-xs text-gray-500 mt-1">Sin existencias disponibles</p>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center gap-4 flex-wrap">
                <button
                  onClick={() => setCurrentView('create')}
                  className="px-6 py-3 rounded-lg text-white transition-all hover:shadow-md flex items-center gap-2"
                  style={{ backgroundColor: '#10B981' }}
                >
                  <Plus className="w-5 h-5" />
                  Nuevo Producto
                </button>
                <button
                  onClick={() => setCurrentView('import')}
                  className="px-6 py-3 rounded-lg bg-white border-2 transition-all hover:shadow-sm flex items-center gap-2"
                  style={{ borderColor: '#2563EB', color: '#2563EB' }}
                >
                  <Upload className="w-5 h-5" />
                  Importar Inventario (CSV/XLSX)
                </button>
                <button
                  onClick={() => setCurrentView('emails')}
                  className="px-6 py-3 rounded-lg text-white transition-all hover:shadow-md flex items-center gap-2"
                  style={{ backgroundColor: '#73C2FB' }}
                >
                  <Mail className="w-5 h-5" />
                  Notificaciones por Correo
                </button>
                <button
                  onClick={() => setCurrentView('subscriptions')}
                  className="px-6 py-3 rounded-lg bg-white border-2 transition-all hover:shadow-sm flex items-center gap-2"
                  style={{ borderColor: '#F0E68C', color: '#D97706' }}
                >
                  <Bell className="w-5 h-5" />
                  Suscripciones de Restock
                </button>
                <button
                  onClick={() => downloadExampleCSV()}
                  className="px-6 py-3 rounded-lg bg-white border-2 border-gray-300 text-gray-700 transition-all hover:shadow-sm flex items-center gap-2 hover:border-gray-400"
                >
                  <Download className="w-5 h-5" />
                  Descargar Plantilla
                </button>
                <button
                  onClick={handleResetProducts}
                  className="px-6 py-3 rounded-lg bg-red-500 text-white transition-all hover:shadow-md flex items-center gap-2"
                >
                  <Shield className="w-5 h-5" />
                  Resetear Productos
                </button>
                <button
                  onClick={handleVerifyStorage}
                  className="px-6 py-3 rounded-lg bg-gray-500 text-white transition-all hover:shadow-md flex items-center gap-2"
                >
                  <Shield className="w-5 h-5" />
                  Verificar Almacenamiento
                </button>
                <button
                  onClick={handleClearAllProducts}
                  className="px-6 py-3 rounded-lg bg-red-500 text-white transition-all hover:shadow-md flex items-center gap-2"
                >
                  <Shield className="w-5 h-5" />
                  Limpiar Catálogo
                </button>
                <button
                  onClick={handleAuditLog}
                  className="px-6 py-3 rounded-lg bg-white border-2 transition-all hover:shadow-sm flex items-center gap-2"
                  style={{ borderColor: '#9333EA', color: '#9333EA' }}
                >
                  <ScrollText className="w-5 h-5" />
                  Registro de Auditoría
                </button>
              </div>
            </div>

            {/* Table */}
            <ProductsTable
              products={products}
              onEdit={handleEdit}
              onDelete={handleDeleteProduct}
              onAdjustStock={handleAdjustStockClick}
            />
          </>
        )}

        {currentView === 'create' && (
          <ProductForm
            onSave={handleCreateProduct}
            onCancel={handleCancel}
          />
        )}

        {currentView === 'edit' && selectedProduct && (
          <ProductForm
            product={selectedProduct}
            onSave={handleUpdateProduct}
            onCancel={handleCancel}
          />
        )}

        {currentView === 'adjust' && selectedProduct && (
          <InventoryAdjustmentPanel
            product={selectedProduct}
            onSave={handleAdjustStock}
            onCancel={handleCancel}
          />
        )}

        {currentView === 'import' && (
          <ExcelImport
            onImport={handleImportProducts}
            onCancel={handleCancel}
          />
        )}

        {currentView === 'emails' && (
          <EmailNotificationsDashboard
            onBack={handleCancel}
          />
        )}

        {currentView === 'subscriptions' && (
          <RestockSubscriptionsPanel
            onBack={handleCancel}
          />
        )}

        {currentView === 'audit' && (
          <AuditLogPanel
            onBack={handleCancel}
          />
        )}
      </div>
    </div>
  );
}