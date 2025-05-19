// backend/app/utils/securityUtils.ts

// Eliminamos la importación de react-native-simple-encryption
// import { encrypt, decrypt } from '../../../frontend/node_modules/react-native-simple-encryption';
import * as crypto from 'crypto';

// Secret key for basic encryption
const SECRET_KEY = 'AUREUM_APP_SECRET_KEY';

// Interface for validation result
export interface ValidationResult {
  isValid: boolean;
  message: string | null;
}

/**
 * Validate input for potential XSS and SQL injection attacks
 * @param input String to validate
 * @returns Validation result
 */
export const validateInput = (input: string): ValidationResult => {
  // Check for empty input
  if (!input || input.trim() === '') {
    return {
      isValid: true,
      message: null,
    };
  }
  
  // Check for potential XSS attack patterns
  const xssPatterns = /[<>$\/=]/; // Basic patterns that might indicate XSS attempts
  
  if (xssPatterns.test(input)) {
    return {
      isValid: false,
      message: "No se permiten usar caracteres especiales",
    };
  }
  
  // Check for SQL injection attempts
  const sqlInjectionPatterns = /('(''|[^'])*')|(\b(SELECT|UPDATE|INSERT|DELETE|FROM|WHERE|DROP|ALTER|EXEC|EXECUTE|UNION|CREATE|TABLE|TRUNCATE|INTO|OR)\b)/i;
  
  if (sqlInjectionPatterns.test(input)) {
    return {
      isValid: false,
      message: "Entrada no válida detectada",
    };
  }
  
  return {
    isValid: true,
    message: null,
  };
};

/**
 * Sanitize input to prevent XSS attacks
 * @param input String to sanitize
 * @returns Sanitized string
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Basic sanitization to escape HTML special characters
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Encrypt sensitive data using Node.js crypto
 * @param data Data to encrypt
 * @returns Encrypted string
 */
export const encryptData = (data: string): string => {
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(SECRET_KEY.padEnd(32, '0')), iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    return '';
  }
};

/**
 * Decrypt sensitive data using Node.js crypto
 * @param encryptedData Encrypted data
 * @returns Decrypted string
 */
export const decryptData = (encryptedData: string): string => {
  try {
    const parts = encryptedData.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(SECRET_KEY.padEnd(32, '0')), iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return '';
  }
};

/**
 * Check password strength
 * @param password Password to check
 * @returns Validation result with strength feedback
 */
export const checkPasswordStrength = (password: string): ValidationResult => {
  if (!password) {
    return {
      isValid: false,
      message: 'Por favor ingrese una contraseña',
    };
  }
  
  // Check length
  if (password.length < 8) {
    return {
      isValid: false,
      message: 'La contraseña debe tener al menos 8 caracteres',
    };
  }
  
  // Check for at least one number
  if (!/\d/.test(password)) {
    return {
      isValid: false,
      message: 'La contraseña debe contener al menos un número',
    };
  }
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: 'La contraseña debe contener al menos una letra mayúscula',
    };
  }
  
  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: 'La contraseña debe contener al menos una letra minúscula',
    };
  }
  
  // Check for at least one special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      isValid: false,
      message: 'La contraseña debe contener al menos un carácter especial',
    };
  }
  
  return {
    isValid: true,
    message: 'Contraseña fuerte',
  };
};

// Create a secure random string (for tokens, etc.)
export const generateSecureToken = (length: number = 32): string => {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
};

// Validate email format
export const validateEmail = (email: string): ValidationResult => {
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email || !emailRegex.test(email)) {
    return {
      isValid: false,
      message: 'Por favor ingrese un correo electrónico válido',
    };
  }
  
  return {
    isValid: true,
    message: null,
  };
};

// Eliminamos toda la parte de React Native (EnhancedSecureInput)