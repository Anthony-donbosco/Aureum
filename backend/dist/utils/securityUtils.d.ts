export interface ValidationResult {
    isValid: boolean;
    message: string | null;
}
/**
 * Validate input for potential XSS and SQL injection attacks
 * @param input String to validate
 * @returns Validation result
 */
export declare const validateInput: (input: string) => ValidationResult;
/**
 * Sanitize input to prevent XSS attacks
 * @param input String to sanitize
 * @returns Sanitized string
 */
export declare const sanitizeInput: (input: string) => string;
/**
 * Encrypt sensitive data using Node.js crypto
 * @param data Data to encrypt
 * @returns Encrypted string
 */
export declare const encryptData: (data: string) => string;
/**
 * Decrypt sensitive data using Node.js crypto
 * @param encryptedData Encrypted data
 * @returns Decrypted string
 */
export declare const decryptData: (encryptedData: string) => string;
/**
 * Check password strength
 * @param password Password to check
 * @returns Validation result with strength feedback
 */
export declare const checkPasswordStrength: (password: string) => ValidationResult;
export declare const generateSecureToken: (length?: number) => string;
export declare const validateEmail: (email: string) => ValidationResult;
