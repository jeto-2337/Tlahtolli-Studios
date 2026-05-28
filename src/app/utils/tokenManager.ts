interface PasswordResetToken {
  email: string;
  token: string;
  expiresAt: number;
  createdAt: number;
}

const TOKEN_STORAGE_KEY = 'tlahtolli_reset_tokens';
const TOKEN_EXPIRY_MS = 5 * 60 * 1000; // 5 minutos

export const generateToken = (): string => {
  // Generar un token único aleatorio
  return Array.from({ length: 32 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};

export const createPasswordResetToken = (email: string): string => {
  const tokens = getTokens();
  const token = generateToken();
  const now = Date.now();
  
  const resetToken: PasswordResetToken = {
    email,
    token,
    createdAt: now,
    expiresAt: now + TOKEN_EXPIRY_MS
  };
  
  // Eliminar tokens antiguos del mismo email
  const filteredTokens = tokens.filter(t => t.email !== email);
  filteredTokens.push(resetToken);
  
  saveTokens(filteredTokens);
  return token;
};

export const validateToken = (token: string): { 
  isValid: boolean; 
  email?: string; 
  isExpired?: boolean 
} => {
  const tokens = getTokens();
  const foundToken = tokens.find(t => t.token === token);
  
  if (!foundToken) {
    return { isValid: false };
  }
  
  const now = Date.now();
  if (now > foundToken.expiresAt) {
    return { isValid: false, isExpired: true, email: foundToken.email };
  }
  
  return { isValid: true, email: foundToken.email };
};

export const invalidateToken = (token: string): void => {
  const tokens = getTokens();
  const filteredTokens = tokens.filter(t => t.token !== token);
  saveTokens(filteredTokens);
};

export const cleanExpiredTokens = (): void => {
  const tokens = getTokens();
  const now = Date.now();
  const validTokens = tokens.filter(t => now <= t.expiresAt);
  saveTokens(validTokens);
};

const getTokens = (): PasswordResetToken[] => {
  try {
    const data = localStorage.getItem(TOKEN_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveTokens = (tokens: PasswordResetToken[]): void => {
  localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
};

// Simular el envío de email (en producción esto sería una llamada a API)
export const simulateEmailSend = (email: string, token: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`
        ═══════════════════════════════════════
        📧 EMAIL DE RECUPERACIÓN ENVIADO
        ═══════════════════════════════════════
        Para: ${email}
        Token: ${token}
        Expira en: 5 minutos
        
        Usa este enlace para recuperar tu contraseña.
        En una aplicación real, esto se enviaría por email.
        ═══════════════════════════════════════
      `);
      resolve(true);
    }, 500);
  });
};