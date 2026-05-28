import { productsApi } from './api';
import { products as localProducts } from '../data/products';

/**
 * Inicializa la base de datos con los productos locales
 * Esta función se puede llamar desde la consola del navegador o desde un botón de admin
 */
export async function initializeDatabase() {
  console.log('🔄 Inicializando base de datos...');
  
  try {
    // 1. Intentar obtener productos existentes
    const existingResult = await productsApi.getAll();
    
    if (existingResult.error) {
      console.error('❌ Error al verificar productos existentes:', existingResult.error);
      return {
        success: false,
        error: existingResult.error,
        message: 'No se pudo conectar con la base de datos. Verifica que la función de Supabase esté desplegada.'
      };
    }
    
    const existingProducts = existingResult.data || [];
    console.log(`📊 Productos existentes en BD: ${existingProducts.length}`);
    
    // 2. Si no hay productos, inicializar con productos locales
    if (existingProducts.length === 0) {
      console.log('🌱 No hay productos en BD, iniciando carga...');
      
      const results = [];
      for (const product of localProducts) {
        console.log(`  → Creando: ${product.name}`);
        
        // Asegurar que el producto tenga un SKU
        const productWithSku = {
          ...product,
          sku: product.id, // Usar el ID como SKU si no tiene uno
          isAvailable: product.isAvailable !== undefined ? product.isAvailable : (product.stock > 0),
          hasSales: false
        };
        
        const result = await productsApi.create(productWithSku);
        
        if (result.error) {
          console.error(`    ✗ Error: ${result.error}`);
          results.push({ product: product.name, success: false, error: result.error });
        } else {
          console.log(`    ✓ Creado exitosamente`);
          results.push({ product: product.name, success: true });
        }
      }
      
      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      
      console.log(`✅ Inicialización completa: ${successful} exitosos, ${failed} fallidos`);
      
      return {
        success: true,
        created: successful,
        failed: failed,
        message: `Base de datos inicializada con ${successful} productos`
      };
    } else {
      console.log('ℹ️ La base de datos ya contiene productos');
      return {
        success: true,
        existing: existingProducts.length,
        message: `La base de datos ya tiene ${existingProducts.length} productos`
      };
    }
  } catch (error) {
    console.error('💥 Error fatal al inicializar:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      message: 'Error fatal durante la inicialización'
    };
  }
}

/**
 * Reinicia la base de datos a los productos por defecto
 * ¡CUIDADO! Esto eliminará todos los productos existentes
 */
export async function resetDatabase() {
  console.log('⚠️ RESET: Eliminando todos los productos...');
  
  try {
    // Limpiar todos los productos
    const clearResult = await productsApi.clearAll();
    
    if (clearResult.error) {
      console.error('❌ Error al limpiar productos:', clearResult.error);
      return {
        success: false,
        error: clearResult.error,
        message: 'No se pudieron eliminar los productos existentes'
      };
    }
    
    console.log('✓ Productos eliminados');
    
    // Reinicializar con productos locales
    return await initializeDatabase();
  } catch (error) {
    console.error('💥 Error fatal al resetear:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      message: 'Error fatal durante el reset'
    };
  }
}

/**
 * Sincroniza productos locales con la base de datos
 * Actualiza productos existentes y crea nuevos
 */
export async function syncProductsToDatabase() {
  console.log('🔄 Sincronizando productos con base de datos...');
  
  try {
    const existingResult = await productsApi.getAll();
    
    if (existingResult.error) {
      return {
        success: false,
        error: existingResult.error,
        message: 'No se pudo conectar con la base de datos'
      };
    }
    
    const existingProducts = existingResult.data || [];
    const existingMap = new Map(existingProducts.map(p => [p.id, p]));
    
    let created = 0;
    let updated = 0;
    let skipped = 0;
    
    for (const localProduct of localProducts) {
      const existing = existingMap.get(localProduct.id);
      
      const productData = {
        ...localProduct,
        sku: localProduct.id,
        isAvailable: localProduct.isAvailable !== undefined ? localProduct.isAvailable : (localProduct.stock > 0),
        hasSales: false
      };
      
      if (existing) {
        // Actualizar solo si hay cambios significativos
        if (
          existing.name !== localProduct.name ||
          existing.price !== localProduct.price ||
          existing.stock !== localProduct.stock
        ) {
          console.log(`  → Actualizando: ${localProduct.name}`);
          const result = await productsApi.update(localProduct.id, productData);
          
          if (result.error) {
            console.error(`    ✗ Error: ${result.error}`);
          } else {
            console.log(`    ✓ Actualizado`);
            updated++;
          }
        } else {
          skipped++;
        }
      } else {
        // Crear nuevo producto
        console.log(`  → Creando: ${localProduct.name}`);
        const result = await productsApi.create(productData);
        
        if (result.error) {
          console.error(`    ✗ Error: ${result.error}`);
        } else {
          console.log(`    ✓ Creado`);
          created++;
        }
      }
    }
    
    console.log(`✅ Sincronización completa: ${created} creados, ${updated} actualizados, ${skipped} sin cambios`);
    
    return {
      success: true,
      created,
      updated,
      skipped,
      message: `Sincronización completa: ${created} creados, ${updated} actualizados`
    };
  } catch (error) {
    console.error('💥 Error fatal al sincronizar:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      message: 'Error fatal durante la sincronización'
    };
  }
}

/**
 * Verifica el estado de la conexión con la base de datos
 */
export async function checkDatabaseConnection() {
  // Silencioso - no mostrar logs innecesarios
  
  try {
    const result = await productsApi.getAll();
    
    if (result.error) {
      // Modo local - no es un error, es el comportamiento esperado
      return {
        connected: false,
        error: result.error,
        message: 'Modo local activo'
      };
    }
    
    const productCount = result.data?.length || 0;
    
    return {
      connected: true,
      productCount,
      message: `API conectada - ${productCount} productos en base de datos`
    };
  } catch (error) {
    console.error('💥 Error al verificar conexión:', error);
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      message: 'Error al verificar conexión con la base de datos'
    };
  }
}

// Hacer las funciones disponibles globalmente en desarrollo
if (typeof window !== 'undefined') {
  (window as any).tlahtolli = {
    initDatabase: initializeDatabase,
    resetDatabase,
    syncProducts: syncProductsToDatabase,
    checkConnection: checkDatabaseConnection
  };
  
  console.log('%c🎮 Tlahtolli Studio - API de Base de Datos', 'color: #50C878; font-size: 16px; font-weight: bold;');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #F0E68C;');
  console.log('%c🛠️ Utilidades de base de datos disponibles:', 'color: #73C2FB; font-weight: bold;');
  console.log('');
  console.log('%c  tlahtolli.checkConnection()', 'color: #50C878; font-weight: bold;');
  console.log('    → Verificar conexión con la base de datos');
  console.log('');
  console.log('%c  tlahtolli.initDatabase()', 'color: #50C878; font-weight: bold;');
  console.log('    → Inicializar BD con productos (solo si está vacía)');
  console.log('');
  console.log('%c  tlahtolli.syncProducts()', 'color: #50C878; font-weight: bold;');
  console.log('    → Sincronizar productos locales a BD');
  console.log('');
  console.log('%c  tlahtolli.resetDatabase()', 'color: #FF4C4C; font-weight: bold;');
  console.log('    → ⚠️ RESETEAR toda la BD (elimina todo)');
  console.log('');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #F0E68C;');
  console.log('%c📚 Documentación completa: /docs/api-database.md', 'color: #73C2FB;');
  console.log('%c✨ Project ID: hiowfuekyeeixfxdpkyz', 'color: #F0E68C;');
}