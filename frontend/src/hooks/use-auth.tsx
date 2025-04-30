import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';

interface User {
  id: string;
  walletAddress: string;
  username?: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // TODO: Implement token validation and user data fetching
      setState(prev => ({ ...prev, isLoading: false }));
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (walletAddress: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await apiService.login(walletAddress);
      localStorage.setItem('token', response.token);
      setState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred during login',
      }));
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  return {
    ...state,
    login,
    logout,
  };
} 