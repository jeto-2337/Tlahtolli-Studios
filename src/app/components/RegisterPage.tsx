import React, { useState } from 'react';
import { UserPlus, Eye, EyeOff, Sparkles, Shield, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { validateEmail, validatePassword, validateName } from '../utils/validation';
import { ValidationErrors } from '../types/auth';

interface RegisterPageProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
  onBackToHome?: () => void;
}

export function RegisterPage({ onSuccess, onSwitchToLogin, onBackToHome }: RegisterPageProps) {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    paternalLastName: '',
    maternalLastName: '',
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Validar que el campo no esté vacío
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es obligatorio';
    } else if (!validateName(formData.firstName)) {
      newErrors.firstName = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validar que el campo no esté vacío
    if (!formData.paternalLastName.trim()) {
      newErrors.paternalLastName = 'El apellido paterno es obligatorio';
    } else if (!validateName(formData.paternalLastName)) {
      newErrors.paternalLastName = 'El apellido paterno debe tener al menos 2 caracteres';
    }

    // Validar que el campo no esté vacío
    if (!formData.maternalLastName.trim()) {
      newErrors.maternalLastName = 'El apellido materno es obligatorio';
    } else if (!validateName(formData.maternalLastName)) {
      newErrors.maternalLastName = 'El apellido materno debe tener al menos 2 caracteres';
    }

    // Validar que el campo no esté vacío
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Ingresa un email válido';
    }

    // Validar que el campo no esté vacío
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors.join('. ');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await register(
        formData.firstName,
        formData.paternalLastName,
        formData.maternalLastName,
        formData.email,
        formData.password,
        formData.rememberMe
      );

      if (result.success) {
        setSuccessMessage(result.message);
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage('Ocurrió un error. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ backgroundColor: '#F4F0F8' }}>
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#7B4FA6' }}>
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-gray-900 mb-2">Registro de Aventureros</h1>
          <p className="text-gray-600 flex items-center justify-center gap-2">
            <span>✦</span>
            Tu viaje comienza aquí
            <span>✦</span>
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          {successMessage && (
            <div className="mb-6 p-4 rounded-lg flex items-center gap-3" style={{ backgroundColor: '#7B4FA6' }}>
              <Sparkles className="w-5 h-5 text-white" />
              <p className="text-white text-sm">{successMessage}</p>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 p-4 rounded-lg flex items-center gap-3" style={{ backgroundColor: '#FF4C4C' }}>
              <Shield className="w-5 h-5 text-white" />
              <p className="text-white text-sm">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="firstName" className="block text-sm text-gray-700 mb-2">
                Nombre(s) *
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.firstName 
                    ? 'border-red-500 focus:ring-red-200' 
                    : 'border-gray-300 focus:ring-blue-200'
                }`}
                style={!errors.firstName ? { '--tw-ring-color': '#73C2FB' } as React.CSSProperties : {}}
                placeholder="Nombre del aventurero"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label htmlFor="paternalLastName" className="block text-sm text-gray-700 mb-2">
                Apellido Paterno *
              </label>
              <input
                id="paternalLastName"
                name="paternalLastName"
                type="text"
                required
                value={formData.paternalLastName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.paternalLastName 
                    ? 'border-red-500 focus:ring-red-200' 
                    : 'border-gray-300 focus:ring-blue-200'
                }`}
                style={!errors.paternalLastName ? { '--tw-ring-color': '#73C2FB' } as React.CSSProperties : {}}
                placeholder="Apellido paterno"
              />
              {errors.paternalLastName && (
                <p className="mt-1 text-sm text-red-500">{errors.paternalLastName}</p>
              )}
            </div>

            <div>
              <label htmlFor="maternalLastName" className="block text-sm text-gray-700 mb-2">
                Apellido Materno *
              </label>
              <input
                id="maternalLastName"
                name="maternalLastName"
                type="text"
                required
                value={formData.maternalLastName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.maternalLastName 
                    ? 'border-red-500 focus:ring-red-200' 
                    : 'border-gray-300 focus:ring-blue-200'
                }`}
                style={!errors.maternalLastName ? { '--tw-ring-color': '#73C2FB' } as React.CSSProperties : {}}
                placeholder="Apellido materno"
              />
              {errors.maternalLastName && (
                <p className="mt-1 text-sm text-red-500">{errors.maternalLastName}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm text-gray-700 mb-2">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.email 
                    ? 'border-red-500 focus:ring-red-200' 
                    : 'border-gray-300 focus:ring-blue-200'
                }`}
                style={!errors.email ? { '--tw-ring-color': '#73C2FB' } as React.CSSProperties : {}}
                placeholder="tu@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-gray-700 mb-2">
                Contraseña *
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all pr-12 ${
                    errors.password 
                      ? 'border-red-500 focus:ring-red-200' 
                      : 'border-gray-300 focus:ring-blue-200'
                  }`}
                  style={!errors.password ? { '--tw-ring-color': '#73C2FB' } as React.CSSProperties : {}}
                  placeholder="Mínimo 5 caracteres"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                Debe incluir: mayúscula, número y carácter especial
              </p>
            </div>

            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                style={{ accentColor: '#73C2FB' }}
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
                Recuérdame (mantener sesión activa)
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-4 rounded-lg text-white transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ backgroundColor: '#7B4FA6' }}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creando portal...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Registrarme
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <button
                onClick={onSwitchToLogin}
                className="underline transition-colors"
                style={{ color: '#73C2FB' }}
              >
                Inicia sesión aquí
              </button>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-gray-900 mb-3 text-sm">Beneficios de crear una cuenta</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <span>✦</span>
              <span>Guarda tus productos favoritos</span>
            </li>
            <li className="flex items-center gap-2">
              <span>✦</span>
              <span>Accede a ofertas exclusivas</span>
            </li>
            <li className="flex items-center gap-2">
              <span>✦</span>
              <span>Rastrea tus pedidos en tiempo real</span>
            </li>
          </ul>
        </div>

        {onBackToHome && (
          <div className="mt-4 text-center">
            <button
              onClick={onBackToHome}
              className="text-sm underline"
              style={{ color: '#73C2FB' }}
            >
              <ArrowLeft className="w-4 h-4 inline-block mr-1" />
              Volver al inicio
            </button>
          </div>
        )}
      </div>
    </div>
  );
}