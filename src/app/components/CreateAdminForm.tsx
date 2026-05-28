import { useState } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface CreateAdminFormProps {
  onBack?: () => void;
}

export default function CreateAdminForm({ onBack }: CreateAdminFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    paternalLastName: '',
    maternalLastName: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [createdAdmin, setCreatedAdmin] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setCreatedAdmin(null);

    try {
      // Try API first
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-80f0f1f5/auth/create-admin`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage({ type: 'error', text: data.error || 'Error al crear administrador' });
        setLoading(false);
        return;
      }

      // Success!
      setCreatedAdmin(data.user);
      setMessage({ type: 'success', text: '✨ ¡Administrador creado exitosamente!' });
      
      // Reset form
      setFormData({
        firstName: '',
        paternalLastName: '',
        maternalLastName: '',
        email: '',
        password: ''
      });
    } catch (error: any) {
      // Fallback to localStorage if API fails
      if (error.message?.includes('521') || error.message?.includes('fetch')) {
        setMessage({ 
          type: 'error', 
          text: '⚠️ La API no está disponible. Modo local no soporta creación de usuarios.'
        });
      } else {
        setMessage({ type: 'error', text: 'Error de conexión' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0E68C] via-[#FFFDD0] to-[#73C2FB] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#50C878] mb-2">🔑 Crear Admin</h1>
          <p className="text-gray-600">Crear nuevo usuario administrador</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#50C878] focus:border-transparent"
              placeholder="Juan"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Apellido Paterno
            </label>
            <input
              type="text"
              name="paternalLastName"
              value={formData.paternalLastName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#50C878] focus:border-transparent"
              placeholder="García"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Apellido Materno
            </label>
            <input
              type="text"
              name="maternalLastName"
              value={formData.maternalLastName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#50C878] focus:border-transparent"
              placeholder="López"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#50C878] focus:border-transparent"
              placeholder="admin@tlahtolli.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="text"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#50C878] focus:border-transparent"
              placeholder="admin123"
            />
            <p className="text-xs text-gray-500 mt-1">
              💡 Guarda estas credenciales en un lugar seguro
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#50C878] text-white py-3 rounded-lg font-semibold hover:bg-[#45b368] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creando...' : '✨ Crear Administrador'}
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {createdAdmin && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">📋 Credenciales creadas:</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>Email:</strong> {createdAdmin.email}</p>
              <p><strong>ID:</strong> {createdAdmin.id}</p>
              <p><strong>Admin:</strong> {createdAdmin.isAdmin ? '✅ Sí' : '❌ No'}</p>
              <p className="text-xs text-blue-600 mt-2">
                🔐 Guarda la contraseña que ingresaste arriba
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <a 
            href="/login" 
            className="text-[#50C878] hover:underline text-sm"
          >
            ← Volver al Login
          </a>
        </div>
      </div>
    </div>
  );
}