export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Lista de contraseñas comunes a evitar
const COMMON_PASSWORDS = [
  'password', 'Password1', 'Password123', '12345678', 'qwerty',
  'admin', 'admin123', 'letmein', 'welcome', 'monkey',
  '123456', '12345678', '123456789', 'test', 'qwerty123',
  'password1', 'abc123', 'iloveyou', 'dragon', 'master'
];

export const validatePassword = (password: string, email?: string): { 
  isValid: boolean; 
  errors: string[];
  strength?: 'weak' | 'medium' | 'strong';
} => {
  const errors: string[] = [];
  
  // Longitud mínima
  if (password.length < 5) {
    errors.push('Debe tener al menos 5 caracteres');
  }
  
  // Al menos una mayúscula
  if (!/[A-Z]/.test(password)) {
    errors.push('Debe contener al menos una mayúscula');
  }
  
  // Al menos un número
  if (!/[0-9]/.test(password)) {
    errors.push('Debe contener al menos un número');
  }
  
  // Al menos un carácter especial
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Debe contener al menos un carácter especial');
  }
  
  // Verificar contraseñas comunes
  if (COMMON_PASSWORDS.some(common => password.toLowerCase().includes(common.toLowerCase()))) {
    errors.push('Esta contraseña es muy común, elige una más segura');
  }
  
  // Verificar que no sea similar al email
  if (email) {
    const emailUser = email.split('@')[0].toLowerCase();
    if (password.toLowerCase().includes(emailUser) && emailUser.length > 3) {
      errors.push('La contraseña no debe contener tu email');
    }
  }
  
  // No debe tener secuencias repetidas
  if (/(.)\1{3,}/.test(password)) {
    errors.push('Evita repetir el mismo carácter más de 3 veces');
  }
  
  // Calcular fortaleza
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (errors.length === 0) {
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    const lengthScore = password.length >= 8 ? 2 : password.length >= 5 ? 1 : 0;
    
    const score = (hasLowerCase ? 1 : 0) + 
                  (hasUpperCase ? 1 : 0) + 
                  (hasNumber ? 1 : 0) + 
                  (hasSpecial ? 1 : 0) + 
                  lengthScore;
    
    if (score >= 6) strength = 'strong';
    else if (score >= 4) strength = 'medium';
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    strength
  };
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};