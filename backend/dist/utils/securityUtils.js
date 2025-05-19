"use strict";
// backend/app/utils/securityUtils.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmail = exports.generateSecureToken = exports.checkPasswordStrength = exports.decryptData = exports.encryptData = exports.sanitizeInput = exports.validateInput = void 0;
// Eliminamos la importación de react-native-simple-encryption
// import { encrypt, decrypt } from '../../../frontend/node_modules/react-native-simple-encryption';
const crypto = __importStar(require("crypto"));
// Secret key for basic encryption
const SECRET_KEY = 'AUREUM_APP_SECRET_KEY';
/**
 * Validate input for potential XSS and SQL injection attacks
 * @param input String to validate
 * @returns Validation result
 */
const validateInput = (input) => {
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
exports.validateInput = validateInput;
/**
 * Sanitize input to prevent XSS attacks
 * @param input String to sanitize
 * @returns Sanitized string
 */
const sanitizeInput = (input) => {
    if (!input)
        return '';
    // Basic sanitization to escape HTML special characters
    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
};
exports.sanitizeInput = sanitizeInput;
/**
 * Encrypt sensitive data using Node.js crypto
 * @param data Data to encrypt
 * @returns Encrypted string
 */
const encryptData = (data) => {
    try {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(SECRET_KEY.padEnd(32, '0')), iv);
        let encrypted = cipher.update(data, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return iv.toString('hex') + ':' + encrypted;
    }
    catch (error) {
        console.error('Encryption error:', error);
        return '';
    }
};
exports.encryptData = encryptData;
/**
 * Decrypt sensitive data using Node.js crypto
 * @param encryptedData Encrypted data
 * @returns Decrypted string
 */
const decryptData = (encryptedData) => {
    try {
        const parts = encryptedData.split(':');
        const iv = Buffer.from(parts[0], 'hex');
        const encrypted = parts[1];
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(SECRET_KEY.padEnd(32, '0')), iv);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
    catch (error) {
        console.error('Decryption error:', error);
        return '';
    }
};
exports.decryptData = decryptData;
/**
 * Check password strength
 * @param password Password to check
 * @returns Validation result with strength feedback
 */
const checkPasswordStrength = (password) => {
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
exports.checkPasswordStrength = checkPasswordStrength;
// Create a secure random string (for tokens, etc.)
const generateSecureToken = (length = 32) => {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
};
exports.generateSecureToken = generateSecureToken;
// Validate email format
const validateEmail = (email) => {
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
exports.validateEmail = validateEmail;
// Eliminamos toda la parte de React Native (EnhancedSecureInput)
//# sourceMappingURL=securityUtils.js.map