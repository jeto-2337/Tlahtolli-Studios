import React from 'react';
import { Sparkles, Star, Zap, Trophy } from 'lucide-react';

interface RarityBadgeProps {
  rarity: string;
}

export function RarityBadge({ rarity }: RarityBadgeProps) {
  const getRarityConfig = () => {
    // Normalizar rareza a minúsculas para comparación
    const normalizedRarity = rarity?.toLowerCase() || 'común';
    
    switch (normalizedRarity) {
      case 'común':
      case 'comun':
        return { 
          icon: Star, 
          bg: 'bg-gray-100', 
          text: 'text-gray-700',
          border: 'border-gray-300',
          label: 'Común'
        };
      case 'raro':
        return { 
          icon: Sparkles, 
          bg: 'bg-blue-50', 
          text: 'text-blue-700',
          border: 'border-blue-300',
          label: 'Raro'
        };
      case 'épico':
      case 'epico':
        return { 
          icon: Zap, 
          bg: 'bg-purple-50', 
          text: 'text-purple-700',
          border: 'border-purple-300',
          label: 'Épico'
        };
      case 'legendario':
        return { 
          icon: Trophy, 
          bg: 'bg-yellow-50', 
          text: 'text-yellow-700',
          border: 'border-yellow-300',
          label: 'Legendario'
        };
      default:
        // Fallback para raridades desconocidas
        return { 
          icon: Star, 
          bg: 'bg-gray-100', 
          text: 'text-gray-700',
          border: 'border-gray-300',
          label: rarity || 'Común'
        };
    }
  };

  const config = getRarityConfig();
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${config.bg} ${config.text} ${config.border}`}>
      <Icon className="w-4 h-4" />
      <span className="text-sm">{config.label}</span>
    </div>
  );
}