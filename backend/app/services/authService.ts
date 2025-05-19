import { apiService } from './api';

export const authService = {
  login: async (email, password) => {
    try {
      return await apiService.auth.login(email, password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  register: async (userData) => {
    try {
      return await apiService.auth.register(userData);
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },
  
  changePassword: async (oldPassword, newPassword) => {
    try {
      return await apiService.users.changePassword({
        old_password: oldPassword,
        new_password: newPassword
      });
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  },
  
  updateProfile: async (userData) => {
    try {
      return await apiService.users.updateProfile(userData);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }
};

export default authService;