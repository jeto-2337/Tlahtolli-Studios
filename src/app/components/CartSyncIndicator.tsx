import React, { useEffect, useState } from 'react';
import { Save, Cloud, CloudOff } from 'lucide-react';

interface CartSyncIndicatorProps {
  itemCount: number;
  userId: string | null;
}

export function CartSyncIndicator({ itemCount, userId }: CartSyncIndicatorProps) {
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (itemCount >= 0) {
      setShowSaved(true);
      const timer = setTimeout(() => setShowSaved(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [itemCount]);

  if (!showSaved) return null;

  const isGuest = !userId;

  return (
    <div className="fixed bottom-4 right-4 z-40 animate-slide-in-right">
      <div
        className="flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg text-white text-sm"
        style={{ backgroundColor: '#50C878' }}
      >
        {isGuest ? (
          <>
            <Save className="w-4 h-4" />
            <span>Carrito guardado localmente</span>
          </>
        ) : (
          <>
            <Cloud className="w-4 h-4" />
            <span>Carrito guardado</span>
          </>
        )}
      </div>
    </div>
  );
}
