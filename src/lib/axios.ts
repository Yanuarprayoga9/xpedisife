/* eslint-disable @typescript-eslint/no-unused-vars */
// lib/auth-api.ts
import axios from 'axios';
import type  { AuthResponse, LoginFormData, RegisterFormData, ForgotPasswordFormData, ResetPasswordFormData } from '@/types/auth';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'https://dummyjson.com',
  headers: {
    'Content-Type': 'application/json',
  },
  // withCredentials: true, // Include cookies for DummyJSON
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-storage');
    if (token) {
      try {
        const parsedStorage = JSON.parse(token);
        if (parsedStorage.state?.token) {
          config.headers.Authorization = `Bearer ${parsedStorage.state.token}`;
        }
      } catch (error) {
        console.error('Error parsing auth token:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
          const parsedStorage = JSON.parse(authStorage);
          const refreshToken = parsedStorage.state?.refreshToken;

          if (refreshToken) {
            const response = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {
              refreshToken,
              expiresInMins: 30,
            });

            const { token } = response.data;
            
            // Update token in localStorage
            parsedStorage.state.token = token;
            localStorage.setItem('auth-storage', JSON.stringify(parsedStorage));

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('auth-storage');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const authApi = {
  // Set auth token for subsequent requests
  setAuthToken: (token: string) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  // Clear auth token
  clearAuthToken: () => {
    delete api.defaults.headers.common['Authorization'];
  },

  // Login
  login: async (credentials: LoginFormData): Promise<AuthResponse> => {
    console.log("api",credentials)
    const response = await api.post('/auth/login', {
      username: credentials.username,
      password: credentials.password,
      expiresInMins: 30, // optional, defaults to 60
    });
    
    // Transform DummyJSON response to match our AuthResponse interface
    const { token, refreshToken, ...user } = response.data;
    return {
      user: {
        id: user.id.toString(),
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        avatar: user.image,
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      token,
      refreshToken,
    };
  },

  // Register - Note: DummyJSON doesn't support registration, this is a mock
  register: async (userData: RegisterFormData): Promise<AuthResponse> => {
    // For demo purposes, we'll simulate registration by calling login with demo credentials
    // In a real app, you'd call your actual registration endpoint
    const response = await api.post('/auth/login', {
      username: 'emilys', // Demo user from DummyJSON
      password: 'emilyspass',
      expiresInMins: 30,
    });
    
    // Transform response and use the provided registration data for display
    const { token, refreshToken, ...user } = response.data;
    return {
      user: {
        id: user.id.toString(),
        name: userData.name, // Use the name from registration form
        email: userData.email, // Use the email from registration form
        avatar: user.image,
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      token,
      refreshToken,
    };
  },

  // Logout
  logout: async (): Promise<void> => {
    // DummyJSON doesn't have logout endpoint, so we'll just resolve
    return Promise.resolve();
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/refresh', { 
      refreshToken,
      expiresInMins: 30,
    });
    
    const { token, refreshToken: newRefreshToken, ...user } = response.data;
    return {
      user: {
        id: user.id.toString(),
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        avatar: user.image,
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      token,
      refreshToken: newRefreshToken,
    };
  },

  // Forgot password - Mock implementation
  forgotPassword: async (data: ForgotPasswordFormData): Promise<{ message: string }> => {
    // DummyJSON doesn't support this, so we'll mock it
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ message: 'Email reset password telah dikirim!' });
      }, 1000);
    });
  },

  // Reset password - Mock implementation  
  resetPassword: async (data: ResetPasswordFormData): Promise<{ message: string }> => {
    // DummyJSON doesn't support this, so we'll mock it
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ message: 'Password berhasil direset!' });
      }, 1000);
    });
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    const user = response.data;
    return {
      id: user.id.toString(),
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      avatar: user.image,
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  // Update profile - Mock implementation
  updateProfile: async (data: Partial<{ name: string; email: string; avatar: string }>) => {
    // DummyJSON doesn't support profile updates, so we'll mock it
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          message: 'Profile berhasil diupdate!',
          user: data,
        });
      }, 1000);
    });
  },

  // Change password - Mock implementation
  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    // DummyJSON doesn't support password change, so we'll mock it
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ message: 'Password berhasil diubah!' });
      }, 1000);
    });
  },
};

export default api;