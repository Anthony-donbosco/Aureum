"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const api_1 = require("./api");
exports.authService = {
    login: async (email, password) => {
        try {
            return await api_1.apiService.auth.login(email, password);
        }
        catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },
    register: async (userData) => {
        try {
            return await api_1.apiService.auth.register(userData);
        }
        catch (error) {
            console.error('Register error:', error);
            throw error;
        }
    },
    changePassword: async (oldPassword, newPassword) => {
        try {
            return await api_1.apiService.users.changePassword({
                old_password: oldPassword,
                new_password: newPassword
            });
        }
        catch (error) {
            console.error('Change password error:', error);
            throw error;
        }
    },
    updateProfile: async (userData) => {
        try {
            return await api_1.apiService.users.updateProfile(userData);
        }
        catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
    }
};
exports.default = exports.authService;
//# sourceMappingURL=authService.js.map