import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' }
});

// Auto-attach JWT token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth service
export const authService = {
    register: async (name: string, email: string, password: string) => {
        const response = await api.post('/auth/register', { name, email, password });
        return response.data;
    },
    login: async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

// Batch service
export const batchService = {
    // Get all batches
    getAll: async () => {
        const response = await api.get('/batches');
        return response.data;
    },

    // Step 1: Create batch from CSV
    create: async (batchName: string, csvFile: File) => {
        const formData = new FormData();
        formData.append('batchName', batchName);
        formData.append('files', csvFile);

        const response = await api.post('/batches/create', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // Step 2: Upload and validate applicant files
    uploadFiles: async (batchId: number, files: File[]) => {
        const formData = new FormData();
        formData.append('batchId', batchId.toString());
        files.forEach(file => formData.append('files', file));

        const response = await api.post('/batches/upload-files', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    }
};

// Dashboard service
export const dashboardService = {
    getStats: async (batchId?: number) => {
        const url = batchId
            ? `/dashboard/stats?batchId=${batchId}`
            : '/dashboard/stats';
        const response = await api.get(url);
        return response.data;
    },

    getApplicants: async (batchId?: number) => {
        const url = batchId
            ? `/dashboard/applicants?batchId=${batchId}`
            : '/dashboard/applicants';
        const response = await api.get(url);
        return response.data;
    }
};

export default api;