/**
 * Muestra un banner informativo en la consola del navegador
 */
export function showConsoleBanner() {
  // Banner ASCII art
  console.log('%c┌─────────────────────────────────────────────────────────┐', 'color: #50C878;');
  console.log('%c│                                                         │', 'color: #50C878;');
  console.log('%c│          🎮 TLAHTOLLI STUDIO                           │', 'color: #50C878; font-size: 18px; font-weight: bold;');
  console.log('%c│          Tienda de Mercancía de Videojuegos            │', 'color: #73C2FB;');
  console.log('%c│                                                         │', 'color: #50C878;');
  console.log('%c└─────────────────────────────────────────────────────────┘', 'color: #50C878;');
  console.log('');
  
  // Estado de la aplicación
  console.log('%c📊 ESTADO DE LA APLICACIÓN', 'color: #F0E68C; font-weight: bold; font-size: 14px;');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #F0E68C;');
  console.log('');
  
  console.log('%c✅ MODO LOCAL ACTIVO', 'color: #50C878; font-weight: bold;');
  console.log('%c   └─ Productos cargados desde archivos locales', 'color: #73C2FB;');
  console.log('%c   └─ Carrito funcional con persistencia', 'color: #73C2FB;');
  console.log('%c   └─ Todo funciona sin API', 'color: #73C2FB;');
  console.log('');
  console.log('%c💡 Para activar la API de Supabase (opcional):', 'color: #F0E68C; font-weight: bold;');
  console.log('%c   1. Despliega la función Edge de Supabase', 'color: #F0E68C;');
  console.log('%c   2. Verifica el indicador 🔴/🟢 en la esquina inferior derecha', 'color: #F0E68C;');
  console.log('%c   3. Cuando esté 🟢, ejecuta: tlahtolli.initDatabase()', 'color: #F0E68C;');
  
  console.log('');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #F0E68C;');
  console.log('');
  
  // Funcionalidades disponibles
  console.log('%c🛠️  UTILIDADES DISPONIBLES', 'color: #73C2FB; font-weight: bold; font-size: 14px;');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #73C2FB;');
  console.log('');
  
  console.log('%c  🔍 tlahtolli.checkConnection()', 'color: #50C878; font-weight: bold;');
  console.log('     Verifica el estado de la conexión con la base de datos');
  console.log('');
  
  console.log('%c  🌱 tlahtolli.initDatabase()', 'color: #50C878; font-weight: bold;');
  console.log('     Inicializa la BD con productos (solo si está vacía)');
  console.log('');
  
  console.log('%c  🔄 tlahtolli.syncProducts()', 'color: #50C878; font-weight: bold;');
  console.log('     Sincroniza productos locales con la base de datos');
  console.log('');
  
  console.log('%c  ⚠️  tlahtolli.resetDatabase()', 'color: #FF4C4C; font-weight: bold;');
  console.log('     RESETEA toda la base de datos (¡cuidado!)');
  console.log('');
  
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #73C2FB;');
  console.log('');
  
  // Información adicional
  console.log('%c📚 RECURSOS', 'color: #F0E68C; font-weight: bold; font-size: 14px;');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #F0E68C;');
  console.log('');
  console.log('%c  📖 Documentación de API:', 'color: #73C2FB;');
  console.log('     → /docs/api-database.md');
  console.log('');
  console.log('%c  📊 Estado de la API:', 'color: #73C2FB;');
  console.log('     → /docs/api-status.md');
  console.log('');
  console.log('%c  🎯 Project ID:', 'color: #73C2FB;');
  console.log('     → hiowfuekyeeixfxdpkyz');
  console.log('');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #F0E68C;');
  console.log('');
  
  // Tips
  console.log('%c💡 TIPS RÁPIDOS', 'color: #50C878; font-weight: bold; font-size: 14px;');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #50C878;');
  console.log('');
  console.log('%c  ✦ Mira la esquina inferior derecha para el estado de BD', 'color: #73C2FB;');
  console.log('%c  ✦ El carrito se guarda automáticamente en tu cuenta', 'color: #73C2FB;');
  console.log('%c  ✦ Admin: Usa email/pass de un usuario con isAdmin: true', 'color: #73C2FB;');
  console.log('');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #50C878;');
  console.log('');
  console.log('%c🎮 ¡Disfruta de tu aventura en Tlahtolli Studio! ✨', 'color: #F0E68C; font-weight: bold; font-size: 14px;');
  console.log('');
}

// Exportar para uso global
if (typeof window !== 'undefined') {
  (window as any).showBanner = showConsoleBanner;
}