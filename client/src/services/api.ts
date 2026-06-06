import axios from 'axios';

// Base URL for all API calls
const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Automatically add JWT token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API calls
export const authService = {
    // Register new user
    register: async (name: string, email: string, password: string) => {
        const response = await api.post('/auth/register', { 
            name, 
            email, 
            password 
        });
        return response.data;
    },

    // Login existing user
    login: async (email: string, password: string) => {
        const response = await api.post('/auth/login', { 
            email, 
            password 
        });
        return response.data;
    },

    // Logout - just remove token from storage
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

export default api;