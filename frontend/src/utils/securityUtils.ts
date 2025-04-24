export interface ValidationResult {
    isValid: boolean;
    message: string | null;
  }
  
  export const validateInput = (input: string): ValidationResult => {
    // Check for potential XSS attack patterns
    const xssPatterns = /[<>$\/=]/; // Basic patterns that might indicate XSS attempts
    
    if (xssPatterns.test(input)) {
      return {
        isValid: false,
        message: "No se permiten usar caracteres especiales",
      };
    }
    
    return {
      isValid: true,
      message: null,
    };
  };
  
  export const sanitizeInput = (input: string): string => {
    // Basic sanitization to escape HTML special characters
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  };
  