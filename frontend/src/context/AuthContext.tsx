import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/authService';

interface User {
  id: string;
  name: string;
  email: string;
  type: 'personal' | 'business';
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  updateProfile: (userData: { name: string; email: string }) => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  birthdate: string;
  type: 'personal' | 'business';
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('@AureumApp:user');
      
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // In a real app, this would make an API call
      const response = await authService.login(email, password);
      
      // Store user data
      const userData = response.user;
      setUser(userData);
      await AsyncStorage.setItem('@AureumApp:user', JSON.stringify(userData));
      await AsyncStorage.setItem('@AureumApp:token', response.token);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      // In a real app, this would make an API call
      const response = await authService.register(userData);
      
      // Store user data
      const newUser = response.user;
      setUser(newUser);
      await AsyncStorage.setItem('@AureumApp:user', JSON.stringify(newUser));
      await AsyncStorage.setItem('@AureumApp:token', response.token);
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Clear user data
      setUser(null);
      await AsyncStorage.removeItem('@AureumApp:user');
      await AsyncStorage.removeItem('@AureumApp:token');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      // In a real app, this would make an API call
      await authService.changePassword(oldPassword, newPassword);
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  };

  const updateProfile = async (userData: { name: string; email: string }) => {
    try {
      // In a real app, this would make an API call
      const updatedUser = await authService.updateProfile(userData);
      
      // Update user data
      setUser(prev => prev ? { ...prev, ...updatedUser } : null);
      
      if (user) {
        const newUserData = { ...user, ...updatedUser };
        await AsyncStorage.setItem('@AureumApp:user', JSON.stringify(newUserData));
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        changePassword,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
