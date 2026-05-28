import React from 'react';
import { UserPlus, LogIn, RefreshCw, Shield, CheckCircle } from 'lucide-react';

export function AuthDemo() {
  return (
    <div className="min-h-screen py-12 px-4" style={{ backgroundColor: '#FFFDD0' }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-gray-900 mb-4">Sistema de Autenticación - TONALLI-004</h1>
          <p className="text-gray-600">
            Portal de Acceso y Registro de Aventureros
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: '#50C878' }}
            >
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-gray-900 mb-2">Registro</h3>
            <p className="text-sm text-gray-600 mb-4">
              Crea tu cuenta de aventurero con validación completa
            </p>
            <ul className="space-y-2 text-xs text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" style={{ color: '#50C878' }} />
                <span>Validación de email</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" style={{ color: '#50C878' }} />
                <span>Contraseña segura</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" style={{ color: '#50C878' }} />
                <span>Opción "Recuérdame"</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: '#50C878' }}
            >
              <LogIn className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-gray-900 mb-2">Inicio de Sesión</h3>
            <p className="text-sm text-gray-600 mb-4">
              Accede a tu portal con sesión persistente
            </p>
            <ul className="space-y-2 text-xs text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" style={{ color: '#50C878' }} />
                <span>Validación de credenciales</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" style={{ color: '#50C878' }} />
                <span>Sesión persistente</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" style={{ color: '#50C878' }} />
                <span>Mensajes dinámicos</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: '#50C878' }}
            >
              <RefreshCw className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-gray-900 mb-2">Reactivación</h3>
            <p className="text-sm text-gray-600 mb-4">
              Reactiva tu cuenta inactiva fácilmente
            </p>
            <ul className="space-y-2 text-xs text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" style={{ color: '#50C878' }} />
                <span>Recuperación rápida</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" style={{ color: '#50C878' }} />
                <span>Datos preservados</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" style={{ color: '#50C878' }} />
                <span>Acceso inmediato</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h3 className="text-gray-900 mb-6">Especificaciones Técnicas</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-gray-900 mb-3 text-sm">Validaciones Implementadas</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div 
                  className="p-4 rounded-lg border"
                  style={{ borderColor: '#73C2FB', backgroundColor: '#F0F9FF' }}
                >
                  <p className="text-sm mb-2"><strong>Email:</strong></p>
                  <p className="text-xs text-gray-600">Formato válido (xxx@xxx.xxx)</p>
                </div>
                <div 
                  className="p-4 rounded-lg border"
                  style={{ borderColor: '#73C2FB', backgroundColor: '#F0F9FF' }}
                >
                  <p className="text-sm mb-2"><strong>Contraseña:</strong></p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Mínimo 5 caracteres</li>
                    <li>• Al menos 1 mayúscula</li>
                    <li>• Al menos 1 número</li>
                    <li>• Al menos 1 carácter especial</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-gray-900 mb-3 text-sm">Mensajes Dinámicos</h4>
              <div className="space-y-3">
                <div className="p-3 rounded-lg flex items-center gap-3" style={{ backgroundColor: '#50C878' }}>
                  <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
                  <p className="text-white text-sm">¡Bienvenido a la aventura! Tu cuenta ha sido creada.</p>
                </div>
                <div className="p-3 rounded-lg flex items-center gap-3" style={{ backgroundColor: '#50C878' }}>
                  <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
                  <p className="text-white text-sm">¡Bienvenido de nuevo, aventurero!</p>
                </div>
                <div className="p-3 rounded-lg flex items-center gap-3" style={{ backgroundColor: '#FF4C4C' }}>
                  <Shield className="w-5 h-5 text-white flex-shrink-0" />
                  <p className="text-white text-sm">Información incorrecta. Verifica tu email y contraseña.</p>
                </div>
                <div className="p-3 rounded-lg flex items-center gap-3" style={{ backgroundColor: '#50C878' }}>
                  <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
                  <p className="text-white text-sm">¡Cuenta activada correctamente! Tu viaje puede continuar.</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-gray-900 mb-3 text-sm">Persistencia de Sesión</h4>
              <div 
                className="p-4 rounded-lg border"
                style={{ borderColor: '#73C2FB', backgroundColor: '#F0F9FF' }}
              >
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Funcionalidad "Recuérdame"</strong>
                </p>
                <ul className="space-y-1 text-xs text-gray-600">
                  <li>• La sesión persiste incluso después de cerrar el navegador</li>
                  <li>• Se utiliza localStorage para sesiones persistentes</li>
                  <li>• Se utiliza sessionStorage para sesiones temporales</li>
                  <li>• La sesión se verifica automáticamente al cargar la aplicación</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h3 className="text-gray-900 mb-4">Narrativa Simbólica</h3>
          <div className="space-y-4 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <span className="text-2xl">✦</span>
              <div>
                <p className="mb-1"><strong>Portal de Acceso:</strong></p>
                <p className="text-xs">El inicio de sesión se presenta como un "portal mágico" al universo del videojuego</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">✦</span>
              <div>
                <p className="mb-1"><strong>Registro de Aventureros:</strong></p>
                <p className="text-xs">El registro invita a los usuarios a comenzar su viaje como aventureros</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">✦</span>
              <div>
                <p className="mb-1"><strong>Cofres y Tesoros:</strong></p>
                <p className="text-xs">Los datos del usuario se "guardan en cofres" de forma segura</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">✦</span>
              <div>
                <p className="mb-1"><strong>Protección Mágica:</strong></p>
                <p className="text-xs">La seguridad se representa con escudos y símbolos de protección</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
