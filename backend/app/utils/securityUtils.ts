import { encrypt, decrypt } from 'react-native-simple-encryption';

// Secret key for basic encryption (in a real app, use more secure methods)
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
 * Encrypt sensitive data
 * @param data Data to encrypt
 * @returns Encrypted string
 */
export const encryptData = (data: string): string => {
  try {
    return encrypt(SECRET_KEY, data);
  } catch (error) {
    console.error('Encryption error:', error);
    return '';
  }
};

/**
 * Decrypt sensitive data
 * @param encryptedData Encrypted data
 * @returns Decrypted string
 */
export const decryptData = (encryptedData: string): string => {
  try {
    return decrypt(SECRET_KEY, encryptedData);
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
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  // Use crypto API if available
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues);
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(randomValues[i] % chars.length);
    }
  } else {
    // Fallback to less secure method
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }
  
  return result;
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

// Extend SecureInput with additional security features
import React, { useState, useEffect } from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';

interface SecureInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  validator?: (value: string) => ValidationResult;
  isPassword?: boolean;
}

export const EnhancedSecureInput: React.FC<SecureInputProps> = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  validator,
  isPassword = false,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean>(true);
  const [passwordStrength, setPasswordStrength] = useState<string | null>(null);

  useEffect(() => {
    if (value) {
      // First perform XSS validation
      const basicValidation = validateInput(value);
      
      if (!basicValidation.isValid) {
        setError(basicValidation.message);
        setIsValid(false);
        return;
      }
      
      // Then perform custom validation if provided
      if (validator) {
        const customValidation = validator(value);
        setIsValid(customValidation.isValid);
        setError(customValidation.isValid ? null : customValidation.message);
      } else {
        setIsValid(true);
        setError(null);
      }
      
      // Additional password strength check
      if (isPassword && value.length > 0) {
        const strengthCheck = checkPasswordStrength(value);
        setPasswordStrength(strengthCheck.message);
      } else {
        setPasswordStrength(null);
      }
    } else {
      setError(null);
      setIsValid(true);
      setPasswordStrength(null);
    }
  }, [value, validator, isPassword]);

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          !isValid && styles.inputError,
          isPassword && value && checkPasswordStrength(value).isValid && styles.inputStrong
        ]}
        placeholder={placeholder}
        value={value}
        onChangeText={(text) => {
          onChangeText(text);
        }}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      {passwordStrength && isPassword && (
        <Text 
          style={[
            styles.strengthText,
            checkPasswordStrength(value).isValid ? styles.strongText : styles.weakText
          ]}
        >
          {passwordStrength}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8,
  },
  input: {
    backgroundColor: '#F2F2F2',
    borderRadius: 20,
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  inputStrong: {
    borderColor: 'green',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  strengthText: {
    fontSize: 12,
    marginTop: 4,
  },
  strongText: {
    color: 'green',
  },
  weakText: {
    color: 'orange',
  },
});