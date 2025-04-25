import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Definir el tipo de usuario
export interface User {
  id?: string;
  name?: string;
  email?: string;
  // Otros campos del usuario que puedas necesitar
}

// Definir el tipo para actualización de perfil
export interface ProfileUpdate {
  name: string;
  email: string;
  // Otros campos que puedas querer actualizar
}

// Definir el tipo del contexto de autenticación
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  updateProfile: (profileData: ProfileUpdate) => Promise<void>;
  // Otros métodos que puedas necesitar
}

// Crear el contexto con un valor predeterminado seguro (null)
const AuthContext = createContext<AuthContextType | null>(null);

// Props para el proveedor del contexto
interface AuthProviderProps {
  children: ReactNode;
}

// Proveedor del contexto de autenticación
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Efecto para cargar el usuario al iniciar la aplicación
  useEffect(() => {
    // Aquí podrías implementar la lógica para cargar el usuario desde localStorage, AsyncStorage, etc.
    const loadUserFromStorage = async () => {
      setIsLoading(true);
      try {
        // Aquí va tu lógica para cargar el usuario
        // Por ejemplo:
        // const storedUser = await AsyncStorage.getItem('user');
        // if (storedUser) {
        //   setUser(JSON.parse(storedUser));
        //   setIsAuthenticated(true);
        // }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  // Implementación de los métodos de autenticación
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Implementa tu lógica de inicio de sesión aquí
      // Por ejemplo, una llamada a API:
      // const response = await fetch('/api/login', {...});
      // const data = await response.json();
      
      // Simulamos una respuesta exitosa
      const mockUser: User = { id: '1', name: 'Usuario de Prueba', email };
      setUser(mockUser);
      setIsAuthenticated(true);
      
      // Guarda el usuario en almacenamiento local si es necesario
      // await AsyncStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // Implementa tu lógica de cierre de sesión
      // Por ejemplo:
      // await AsyncStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Implementa tu lógica de registro
      // Por ejemplo:
      // const response = await fetch('/api/register', {...});
      // const data = await response.json();
      
      // Simulamos una respuesta exitosa
      const mockUser: User = { id: '2', name, email };
      setUser(mockUser);
      setIsAuthenticated(true);
      
      // Guarda el usuario en almacenamiento local si es necesario
      // await AsyncStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    setIsLoading(true);
    try {
      // Implementa tu lógica de cambio de contraseña
      // Por ejemplo:
      // const response = await fetch('/api/change-password', {...});
      // const data = await response.json();
      
      // Simulamos una respuesta exitosa
      console.log('Password changed successfully');
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData: ProfileUpdate) => {
    setIsLoading(true);
    try {
      // Implementa tu lógica de actualización de perfil
      // Por ejemplo:
      // const response = await fetch('/api/update-profile', {...});
      // const data = await response.json();
      
      // Actualizamos el usuario en el estado
      if (user) {
        const updatedUser = { ...user, ...profileData };
        setUser(updatedUser);
        
        // Actualiza también en el almacenamiento local si es necesario
        // await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Valor del contexto que se proporcionará
  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
    changePassword,
    updateProfile
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;