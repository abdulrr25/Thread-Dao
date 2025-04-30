import axios from 'axios';
import { toast } from 'react-hot-toast';

// Create axios instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    toast.error(message);
    return Promise.reject(error);
  }
);

// Error types
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// API response type
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

// API request options
export interface ApiRequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
}

// API methods
export const apiClient = {
  async get<T>(url: string, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    const response = await api.get<T>(url, options);
    return {
      data: response.data,
      status: response.status,
    };
  },

  async post<T>(url: string, data?: any, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    const response = await api.post<T>(url, data, options);
    return {
      data: response.data,
      status: response.status,
    };
  },

  async put<T>(url: string, data?: any, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    const response = await api.put<T>(url, data, options);
    return {
      data: response.data,
      status: response.status,
    };
  },

  async patch<T>(url: string, data?: any, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    const response = await api.patch<T>(url, data, options);
    return {
      data: response.data,
      status: response.status,
    };
  },

  async delete<T>(url: string, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    const response = await api.delete<T>(url, options);
    return {
      data: response.data,
      status: response.status,
    };
  },
}; 