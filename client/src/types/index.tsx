// User type - matches our database users table
export interface User {
    id: number;
    name: string;
    email: string;
}

// Auth response from backend
export interface AuthResponse {
    message: string;
    token: string;
    user: User;
}

// Login form data
export interface LoginFormData {
    email: string;
    password: string;
}

// Register form data
export interface RegisterFormData {
    name: string;
    email: string;
    password: string;
}