import { mockUsers, mockUserData } from './mockData';

// Simulated auth service for demo purposes
export const authService = {
  login: async (email: string, password: string) => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user by email
    const user = mockUsers.find(u => u.email === email);
    
    if (!user || user.password !== password) {
      throw new Error('Credenciales inválidas');
    }
    
    // Return user data without sensitive info
    const { password: _, ...userData } = user;
    
    return {
      user: userData,
      token: 'mock-jwt-token-' + Date.now()
    };
  },
  
  register: async (userData) => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if email already exists
    if (mockUsers.some(u => u.email === userData.email)) {
      throw new Error('El correo ya está registrado');
    }
    
    // Create new user
    const newUser = {
      id: 'user-' + Date.now(),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      type: userData.type,
      birthdate: userData.birthdate,
    };
    
    // In a real app, this would save to a database
    mockUsers.push(newUser);
    
    // Return user data without sensitive info
    const { password: _, ...newUserData } = newUser;
    
    return {
      user: newUserData,
      token: 'mock-jwt-token-' + Date.now()
    };
  },
  
  changePassword: async (oldPassword, newPassword) => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would validate the old password and update it
    return { success: true };
  },
  
  updateProfile: async (userData) => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would update the user profile in the database
    return userData;
  }
};