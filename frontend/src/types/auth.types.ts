/**
 * Tipos para la autenticación y usuarios
 */

/**
 * Tipo para representar un usuario
 */
export interface User {
    id: string;
    name: string;
    email: string;
    type: UserType;
    birthdate?: string;
    createdAt?: string;
    updatedAt?: string;
  }
  
  /**
   * Tipo para representar el tipo de usuario
   */
  export type UserType = 'personal' | 'business';
  
  /**
   * Datos de registro
   */
  export interface RegisterData {
    name: string;
    email: string;
    password: string;
    birthdate: string;
    type: UserType;
  }
  
  /**
   * Datos de inicio de sesión
   */
  export interface LoginData {
    email: string;
    password: string;
  }
  
  /**
   * Respuesta del servidor para autenticación
   */
  export interface AuthResponse {
    user: User;
    token: string;
  }
  
  /**
   * Datos para actualizar perfil
   */
  export interface UpdateProfileData {
    name?: string;
    email?: string;
  }
  
  /**
   * Datos para cambio de contraseña
   */
  export interface ChangePasswordData {
    oldPassword: string;
    newPassword: string;
  }
  
  /**
   * Estado del contexto de autenticación
   */
  export interface AuthContextState {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (userData: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
    updateProfile: (userData: UpdateProfileData) => Promise<void>;
    clearError: () => void;
  }  