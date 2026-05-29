import React, { useState } from 'react';
import { Mail, Sparkles } from 'lucide-react';
import { validateEmail } from '../../utils/validation';

interface GuestEmailStepProps {
  onComplete: (email: string) => void;
  initialEmail?: string;
}

export function GuestEmailStep({ onComplete, initialEmail = '' }: GuestEmailStepProps) {
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Por favor, ingresa un correo electrónico válido');
      return;
    }

    onComplete(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#73C2FB' }}>
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-gray-900 mb-2">Correo de contacto</h2>
          <p className="text-gray-600 text-sm flex items-center justify-center gap-2">
            <span>✦</span>
            Ingresa tu email para continuar como invitado
            <span>✦</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm text-gray-700 mb-2">
              Correo electrónico *
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                error 
                  ? 'border-red-500 focus:ring-red-200' 
                  : 'border-gray-300 focus:ring-blue-200'
              }`}
              style={!error ? { '--tw-ring-color': '#73C2FB' } as React.CSSProperties : {}}
              placeholder="aventurero@email.com"
              required
            />
            {error && (
              <p className="mt-1 text-sm" style={{ color: '#FF4C4C' }}>{error}</p>
            )}
            <p className="mt-2 text-xs text-gray-500">
              Te enviaremos la confirmación de tu orden a este correo
            </p>
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 rounded-lg text-white transition-all hover:shadow-md flex items-center justify-center gap-2"
            style={{ backgroundColor: '#7B4FA6' }}
          >
            <Sparkles className="w-5 h-5" />
            Continuar
          </button>
        </form>

        <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#F4F0F8' }}>
          <p className="text-xs text-gray-600 text-center">
            💡 Tip: Podrás ver el estado de tu orden sin necesidad de crear una cuenta
          </p>
        </div>
      </div>
    </div>
  );
}
