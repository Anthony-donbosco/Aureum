import { validateInput } from './securityUtils';

/**
 * Valida un email
 * @param email Email a validar
 * @returns Resultado de la validación
 */
export const validateEmail = (email: string): { isValid: boolean, message: string | null } => {
  // Primero verificamos la seguridad básica
  const securityCheck = validateInput(email);
  if (!securityCheck.isValid) {
    return securityCheck;
  }

  // Validamos formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      message: 'Ingrese un email válido'
    };
  }

  return {
    isValid: true,
    message: null
  };
};

/**
 * Valida una contraseña
 * @param password Contraseña a validar
 * @returns Resultado de la validación
 */
export const validatePassword = (password: string): { isValid: boolean, message: string | null } => {
  // Primero verificamos la seguridad básica
  const securityCheck = validateInput(password);
  if (!securityCheck.isValid) {
    return securityCheck;
  }

  // Validar longitud
  if (password.length < 8) {
    return {
      isValid: false,
      message: 'La contraseña debe tener al menos 8 caracteres'
    };
  }

  // Validar que contenga al menos un número
  if (!/\d/.test(password)) {
    return {
      isValid: false,
      message: 'La contraseña debe incluir al menos un número'
    };
  }

  // Validar que contenga al menos una letra mayúscula
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: 'La contraseña debe incluir al menos una letra mayúscula'
    };
  }

  return {
    isValid: true,
    message: null
  };
};

/**
 * Valida un nombre
 * @param name Nombre a validar
 * @returns Resultado de la validación
 */
export const validateName = (name: string): { isValid: boolean, message: string | null } => {
  // Primero verificamos la seguridad básica
  const securityCheck = validateInput(name);
  if (!securityCheck.isValid) {
    return securityCheck;
  }

  // Validar longitud
  if (name.trim().length < 2) {
    return {
      isValid: false,
      message: 'El nombre debe tener al menos 2 caracteres'
    };
  }

  // Validar que solo contenga letras y espacios
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name)) {
    return {
      isValid: false,
      message: 'El nombre solo debe contener letras'
    };
  }

  return {
    isValid: true,
    message: null
  };
};

/**
 * Valida una fecha de nacimiento
 * @param date Fecha a validar
 * @returns Resultado de la validación
 */
export const validateBirthdate = (date: string): { isValid: boolean, message: string | null } => {
  // Primero verificamos la seguridad básica
  const securityCheck = validateInput(date);
  if (!securityCheck.isValid) {
    return securityCheck;
  }

  // Validar formato (DD/MM/YYYY)
  const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  if (!dateRegex.test(date)) {
    return {
      isValid: false,
      message: 'Use el formato DD/MM/AAAA'
    };
  }

  // Validar que sea una fecha válida y no futura
  const [day, month, year] = date.split('/').map(Number);
  const birthDate = new Date(year, month - 1, day);
  const today = new Date();
  
  if (birthDate > today) {
    return {
      isValid: false,
      message: 'La fecha no puede ser futura'
    };
  }

  // Validar edad mínima (18 años)
  const minAgeDate = new Date();
  minAgeDate.setFullYear(minAgeDate.getFullYear() - 18);
  
  if (birthDate > minAgeDate) {
    return {
      isValid: false,
      message: 'Debes tener al menos 18 años'
    };
  }

  return {
    isValid: true,
    message: null
  };
};

/**
 * Valida un monto de transacción
 * @param amount Monto a validar
 * @returns Resultado de la validación
 */
export const validateAmount = (amount: string): { isValid: boolean, message: string | null } => {
  // Primero verificamos la seguridad básica
  const securityCheck = validateInput(amount);
  if (!securityCheck.isValid) {
    return securityCheck;
  }

  // Validar que sea un número
  if (!/^\d+(\.\d{1,2})?$/.test(amount)) {
    return {
      isValid: false,
      message: 'Ingrese un monto válido (ej. 100.50)'
    };
  }

  // Validar que sea mayor que cero
  const numAmount = parseFloat(amount);
  if (numAmount <= 0) {
    return {
      isValid: false,
      message: 'El monto debe ser mayor que cero'
    };
  }

  return {
    isValid: true,
    message: null
  };
};

/**
 * Valida si un formulario de registro está completo y válido
 * @param data Datos del formulario
 * @returns Resultado de la validación
 */
export const validateRegisterForm = (data: {
  name: string;
  email: string;
  password: string;
  birthdate: string;
}): { isValid: boolean, message: string | null } => {
  // Validar nombre
  const nameValidation = validateName(data.name);
  if (!nameValidation.isValid) {
    return nameValidation;
  }

  // Validar email
  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) {
    return emailValidation;
  }

  // Validar contraseña
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) {
    return passwordValidation;
  }

  // Validar fecha de nacimiento
  const birthdateValidation = validateBirthdate(data.birthdate);
  if (!birthdateValidation.isValid) {
    return birthdateValidation;
  }

  return {
    isValid: true,
    message: null
  };
};

/**
 * Valida si un formulario de transacción está completo y válido
 * @param data Datos del formulario
 * @returns Resultado de la validación
 */
export const validateTransactionForm = (data: {
  type: string;
  category: string;
  amount: string;
  date: string;
  detail: string;
}): { isValid: boolean, message: string | null } => {
  // Validar tipo
  if (!['income', 'expense'].includes(data.type)) {
    return {
      isValid: false,
      message: 'Tipo de transacción inválido'
    };
  }

  // Validar categoría
  if (!data.category || data.category.trim() === '') {
    return {
      isValid: false,
      message: 'Seleccione una categoría'
    };
  }

  // Validar monto
  const amountValidation = validateAmount(data.amount);
  if (!amountValidation.isValid) {
    return amountValidation;
  }

  // Validar fecha
  if (!data.date) {
    return {
      isValid: false,
      message: 'Seleccione una fecha'
    };
  }

  // Validar detalle
  const detailValidation = validateInput(data.detail);
  if (!detailValidation.isValid) {
    return detailValidation;
  }

  if (data.detail.trim() === '') {
    return {
      isValid: false,
      message: 'Ingrese un detalle para la transacción'
    };
  }

  return {
    isValid: true,
    message: null
  };
};