import React, { useState } from 'react';
import { User, MapPin, Sparkles } from 'lucide-react';
import { validateName } from '../../utils/validation';

export interface PersonalInfoData {
  firstName: string;
  paternalLastName: string;
  maternalLastName: string;
  phone: string;
  street: string;
  number: string;
  colony: string;
  municipality: string;
  state: string;
  zipCode: string;
}

interface PersonalInfoStepProps {
  onComplete: (data: PersonalInfoData) => void;
  initialData?: Partial<PersonalInfoData>;
  guestEmail?: string;
}

export function PersonalInfoStep({ onComplete, initialData = {}, guestEmail }: PersonalInfoStepProps) {
  const [formData, setFormData] = useState<PersonalInfoData>({
    firstName: initialData.firstName || '',
    paternalLastName: initialData.paternalLastName || '',
    maternalLastName: initialData.maternalLastName || '',
    phone: initialData.phone || '',
    street: initialData.street || '',
    number: initialData.number || '',
    colony: initialData.colony || '',
    municipality: initialData.municipality || '',
    state: initialData.state || '',
    zipCode: initialData.zipCode || ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof PersonalInfoData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof PersonalInfoData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PersonalInfoData, string>> = {};

    if (!validateName(formData.firstName)) {
      newErrors.firstName = 'El nombre debe tener al menos 2 caracteres';
    }
    if (!validateName(formData.paternalLastName)) {
      newErrors.paternalLastName = 'El apellido paterno debe tener al menos 2 caracteres';
    }
    if (!validateName(formData.maternalLastName)) {
      newErrors.maternalLastName = 'El apellido materno debe tener al menos 2 caracteres';
    }
    if (formData.phone.length < 10) {
      newErrors.phone = 'Ingresa un teléfono válido (10 dígitos)';
    }
    if (formData.street.trim().length < 3) {
      newErrors.street = 'Ingresa una calle válida';
    }
    if (formData.number.trim().length < 1) {
      newErrors.number = 'Ingresa un número';
    }
    if (formData.colony.trim().length < 3) {
      newErrors.colony = 'Ingresa una colonia válida';
    }
    if (formData.municipality.trim().length < 3) {
      newErrors.municipality = 'Ingresa un municipio válido';
    }
    if (formData.state.trim().length < 3) {
      newErrors.state = 'Ingresa un estado válido';
    }
    if (formData.zipCode.length !== 5) {
      newErrors.zipCode = 'El código postal debe tener 5 dígitos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onComplete(formData);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="text-center mb-6">
          <h2 className="text-gray-900 mb-2">Datos del aventurero</h2>
          <p className="text-gray-600 text-sm flex items-center justify-center gap-2">
            <span>✦</span>
            Información personal y dirección de envío
            <span>✦</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Información Personal */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-gray-600" />
              <h3 className="text-gray-900">Información personal</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm text-gray-700 mb-2">
                  Nombre(s) *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.firstName ? 'border-red-500 focus:ring-red-200' : 'border-gray-300'
                  }`}
                  style={!errors.firstName ? { '--tw-ring-color': '#73C2FB' } as React.CSSProperties : {}}
                  placeholder="Juan Carlos"
                  required
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm" style={{ color: '#FF4C4C' }}>{errors.firstName}</p>
                )}
              </div>

              <div>
                <label htmlFor="paternalLastName" className="block text-sm text-gray-700 mb-2">
                  Apellido Paterno *
                </label>
                <input
                  type="text"
                  id="paternalLastName"
                  name="paternalLastName"
                  value={formData.paternalLastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.paternalLastName ? 'border-red-500 focus:ring-red-200' : 'border-gray-300'
                  }`}
                  style={!errors.paternalLastName ? { '--tw-ring-color': '#73C2FB' } as React.CSSProperties : {}}
                  placeholder="Pérez"
                  required
                />
                {errors.paternalLastName && (
                  <p className="mt-1 text-sm" style={{ color: '#FF4C4C' }}>{errors.paternalLastName}</p>
                )}
              </div>

              <div>
                <label htmlFor="maternalLastName" className="block text-sm text-gray-700 mb-2">
                  Apellido Materno *
                </label>
                <input
                  type="text"
                  id="maternalLastName"
                  name="maternalLastName"
                  value={formData.maternalLastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.maternalLastName ? 'border-red-500 focus:ring-red-200' : 'border-gray-300'
                  }`}
                  style={!errors.maternalLastName ? { '--tw-ring-color': '#73C2FB' } as React.CSSProperties : {}}
                  placeholder="García"
                  required
                />
                {errors.maternalLastName && (
                  <p className="mt-1 text-sm" style={{ color: '#FF4C4C' }}>{errors.maternalLastName}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm text-gray-700 mb-2">
                  Número de teléfono *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.phone ? 'border-red-500 focus:ring-red-200' : 'border-gray-300'
                  }`}
                  style={!errors.phone ? { '--tw-ring-color': '#73C2FB' } as React.CSSProperties : {}}
                  placeholder="5512345678"
                  maxLength={10}
                  required
                />
                {errors.phone && (
                  <p className="mt-1 text-sm" style={{ color: '#FF4C4C' }}>{errors.phone}</p>
                )}
              </div>

              {/* Email informativo - Solo lectura */}
              {guestEmail && (
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-700 mb-2">
                    Correo de contacto
                  </label>
                  <div className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50">
                    <p className="text-gray-900">{guestEmail}</p>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Este es el email que ingresaste en el paso anterior
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Dirección de Envío */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-gray-600" />
              <h3 className="text-gray-900">Dirección de envío</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="street" className="block text-sm text-gray-700 mb-2">
                  Calle *
                </label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.street ? 'border-red-500 focus:ring-red-200' : 'border-gray-300'
                  }`}
                  style={!errors.street ? { '--tw-ring-color': '#73C2FB' } as React.CSSProperties : {}}
                  placeholder="Av. Insurgentes Sur"
                  required
                />
                {errors.street && (
                  <p className="mt-1 text-sm" style={{ color: '#FF4C4C' }}>{errors.street}</p>
                )}
              </div>

              <div>
                <label htmlFor="number" className="block text-sm text-gray-700 mb-2">
                  Número *
                </label>
                <input
                  type="text"
                  id="number"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.number ? 'border-red-500 focus:ring-red-200' : 'border-gray-300'
                  }`}
                  style={!errors.number ? { '--tw-ring-color': '#73C2FB' } as React.CSSProperties : {}}
                  placeholder="123"
                  required
                />
                {errors.number && (
                  <p className="mt-1 text-sm" style={{ color: '#FF4C4C' }}>{errors.number}</p>
                )}
              </div>

              <div>
                <label htmlFor="colony" className="block text-sm text-gray-700 mb-2">
                  Colonia *
                </label>
                <input
                  type="text"
                  id="colony"
                  name="colony"
                  value={formData.colony}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.colony ? 'border-red-500 focus:ring-red-200' : 'border-gray-300'
                  }`}
                  style={!errors.colony ? { '--tw-ring-color': '#73C2FB' } as React.CSSProperties : {}}
                  placeholder="Del Valle"
                  required
                />
                {errors.colony && (
                  <p className="mt-1 text-sm" style={{ color: '#FF4C4C' }}>{errors.colony}</p>
                )}
              </div>

              <div>
                <label htmlFor="municipality" className="block text-sm text-gray-700 mb-2">
                  Municipio/Alcaldía *
                </label>
                <input
                  type="text"
                  id="municipality"
                  name="municipality"
                  value={formData.municipality}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.municipality ? 'border-red-500 focus:ring-red-200' : 'border-gray-300'
                  }`}
                  style={!errors.municipality ? { '--tw-ring-color': '#73C2FB' } as React.CSSProperties : {}}
                  placeholder="Benito Juárez"
                  required
                />
                {errors.municipality && (
                  <p className="mt-1 text-sm" style={{ color: '#FF4C4C' }}>{errors.municipality}</p>
                )}
              </div>

              <div>
                <label htmlFor="state" className="block text-sm text-gray-700 mb-2">
                  Estado *
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.state ? 'border-red-500 focus:ring-red-200' : 'border-gray-300'
                  }`}
                  style={!errors.state ? { '--tw-ring-color': '#73C2FB' } as React.CSSProperties : {}}
                  placeholder="Ciudad de México"
                  required
                />
                {errors.state && (
                  <p className="mt-1 text-sm" style={{ color: '#FF4C4C' }}>{errors.state}</p>
                )}
              </div>

              <div>
                <label htmlFor="zipCode" className="block text-sm text-gray-700 mb-2">
                  Código Postal *
                </label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.zipCode ? 'border-red-500 focus:ring-red-200' : 'border-gray-300'
                  }`}
                  style={!errors.zipCode ? { '--tw-ring-color': '#73C2FB' } as React.CSSProperties : {}}
                  placeholder="03100"
                  maxLength={5}
                  required
                />
                {errors.zipCode && (
                  <p className="mt-1 text-sm" style={{ color: '#FF4C4C' }}>{errors.zipCode}</p>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-6 py-4 rounded-lg text-white transition-all hover:shadow-md flex items-center justify-center gap-2"
            style={{ backgroundColor: '#50C878' }}
          >
            <Sparkles className="w-5 h-5" />
            Continuar a método de envío
          </button>
        </form>
      </div>
    </div>
  );
}
