"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiService = exports.handleApiError = void 0;
const axios_1 = __importDefault(require("../../../frontend/node_modules/axios"));
const async_storage_1 = __importDefault(require("../../../frontend/node_modules/@react-native-async-storage/async-storage"));
// API Base URL - change to your server address
const API_URL = 'http://localhost:8000';
// Axios instance
const api = axios_1.default.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
// Add token to requests
api.interceptors.request.use(async (config) => {
    const token = await async_storage_1.default.getItem('@AureumApp:token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));
// Helper function to handle API errors
const handleApiError = (error) => {
    let errorMessage = 'Ha ocurrido un error. Por favor intente de nuevo.';
    if (error.response) {
        // Server responded with error
        const { data, status } = error.response;
        // Log for debugging
        console.error('API Error:', status, data);
        // Extract error message
        if (data.detail) {
            errorMessage = data.detail;
        }
        // Handle token expiration
        if (status === 401) {
            // Clear token and redirect to login
            async_storage_1.default.removeItem('@AureumApp:token');
            async_storage_1.default.removeItem('@AureumApp:user');
        }
    }
    else if (error.request) {
        // No response from server
        console.error('API Error: No response from server', error.request);
        errorMessage = 'No se puede conectar al servidor. Verifique su conexión.';
    }
    else {
        // Something happened in setting up the request
        console.error('API Error:', error.message);
    }
    return errorMessage;
};
exports.handleApiError = handleApiError;
// API methods
exports.apiService = {
    // Auth endpoints
    auth: {
        login: async (email, password) => {
            try {
                const formData = new FormData();
                formData.append('username', email);
                formData.append('password', password);
                const response = await api.post('/token', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                // Get user profile
                await async_storage_1.default.setItem('@AureumApp:token', response.data.access_token);
                const userProfile = await exports.apiService.users.getProfile();
                // Store user data
                await async_storage_1.default.setItem('@AureumApp:user', JSON.stringify(userProfile));
                return {
                    user: userProfile,
                    token: response.data.access_token
                };
            }
            catch (error) {
                throw new Error((0, exports.handleApiError)(error));
            }
        },
        register: async (userData) => {
            try {
                const response = await api.post('/register', userData);
                // Get user profile
                await async_storage_1.default.setItem('@AureumApp:token', response.data.access_token);
                const userProfile = await exports.apiService.users.getProfile();
                // Store user data
                await async_storage_1.default.setItem('@AureumApp:user', JSON.stringify(userProfile));
                return {
                    user: userProfile,
                    token: response.data.access_token
                };
            }
            catch (error) {
                throw new Error((0, exports.handleApiError)(error));
            }
        },
    },
    // User endpoints
    users: {
        getProfile: async () => {
            try {
                const response = await api.get('/users/me');
                return response.data;
            }
            catch (error) {
                throw new Error((0, exports.handleApiError)(error));
            }
        },
        updateProfile: async (userData) => {
            try {
                const response = await api.put('/users/me', userData);
                return response.data;
            }
            catch (error) {
                throw new Error((0, exports.handleApiError)(error));
            }
        },
        changePassword: async (passwordData) => {
            try {
                const response = await api.post('/users/me/change-password', passwordData);
                return response.data;
            }
            catch (error) {
                throw new Error((0, exports.handleApiError)(error));
            }
        },
    },
    // Transaction endpoints
    transactions: {
        getAll: async () => {
            try {
                const response = await api.get('/transactions');
                return response.data;
            }
            catch (error) {
                throw new Error((0, exports.handleApiError)(error));
            }
        },
        getIncome: async () => {
            try {
                const response = await api.get('/transactions/income');
                return response.data;
            }
            catch (error) {
                throw new Error((0, exports.handleApiError)(error));
            }
        },
        getExpenses: async () => {
            try {
                const response = await api.get('/transactions/expense');
                return response.data;
            }
            catch (error) {
                throw new Error((0, exports.handleApiError)(error));
            }
        },
        create: async (transactionData) => {
            try {
                const response = await api.post('/transactions', transactionData);
                return response.data;
            }
            catch (error) {
                throw new Error((0, exports.handleApiError)(error));
            }
        },
        getBalance: async () => {
            try {
                const response = await api.get('/balance');
                return response.data;
            }
            catch (error) {
                throw new Error((0, exports.handleApiError)(error));
            }
        },
    },
};
exports.default = api;
//# sourceMappingURL=api.js.map