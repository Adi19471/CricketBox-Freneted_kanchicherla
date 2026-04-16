import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import api from '@/lib/api';
import { isTokenExpired } from '../lib/authUtils';
import type { AuthResponse, RegisterPayload, LoginPayload, User } from '@/types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  role: string | null;
  bookingConfirmationCode: string | null;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginPayload) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    role: null,
    bookingConfirmationCode: null,
    loading: true,
  });

  useEffect(() => {
    const initAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        const role = localStorage.getItem('role') || null;
        const bookingConfirmationCode = localStorage.getItem('bookingConfirmationCode') || null;
        const tokenExpiry = localStorage.getItem('tokenExpiry') || null;

        if (token && userStr && tokenExpiry) {
          if (isTokenExpired(tokenExpiry)) {
            console.warn('Token expired on init, clearing auth');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('role');
            localStorage.removeItem('tokenExpiry');
            localStorage.removeItem('bookingConfirmationCode');
            setState({ user: null, token: null, role: null, bookingConfirmationCode: null, loading: false });
            return;
          }
          
          const user = JSON.parse(userStr);
          // Full User shape validation using type guard
          const isValidUser = (obj: Record<string, unknown>): obj is User =>
            obj && typeof obj === 'object' &&
            typeof obj.id === 'number' &&
            typeof obj.email === 'string' &&
            typeof obj.name === 'string' &&
            typeof obj.phoneNumber === 'string' &&
            typeof obj.role === 'string';
          if (isValidUser(user)) {
            setState({
              user,
              token,
              role,
              bookingConfirmationCode,
              loading: false,
            });
            return;
          } else {
            throw new Error('Invalid user shape');
          }
        }
      } catch (error) {
        console.error('Auth init failed - clearing invalid storage:', error);
        // Clear all auth storage on error
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        localStorage.removeItem('bookingConfirmationCode');
        localStorage.removeItem('tokenExpiry');
      } finally {
        setState(prev => ({ ...prev, loading: false }));
      }
    };
    initAuth();
  }, []);

  const saveToStorage = (responseData: unknown): void => {
    const response: AuthResponse = {
      statusCode: responseData.statusCode || 200,
      message: responseData.message || 'success',
      token: responseData.token,
      role: responseData.role,
      expirationTime: responseData.expirationTime || '',
      bookingConfirmationCode: responseData.bookingConfirmationCode || null,
      user: responseData.user || { id: 0, email: '', name: 'User', phoneNumber: '', role: responseData.role || '' },
      userList: responseData.userList || [],
      data: responseData.data || {}
    };
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    localStorage.setItem('role', response.role);
    localStorage.setItem('tokenExpiry', response.expirationTime);
    localStorage.setItem('bookingConfirmationCode', response.bookingConfirmationCode);
    
    // Check if token already expired
    if (isTokenExpired(response.expirationTime)) {
      console.warn('New token expired immediately, clearing');
      logout();
      return;
    }
    
    setState({
      user: response.user,
      token: response.token,
      role: response.role,
      bookingConfirmationCode: response.bookingConfirmationCode,
      loading: false,
    });
  };

  const login = async (credentials: LoginPayload) => {
    try {
      const apiResponse = await api.post('/auth/login', credentials);
      saveToStorage(apiResponse.data);
      toast.success('Login successful!');
    } catch (error: unknown) {
      const message = error instanceof AxiosError 
        ? error.response?.data?.message || 'Login failed'
        : 'Login failed';
      toast.error(message);
      throw error;
    }
  };

  const register = async (data: RegisterPayload) => {
    try {
      const apiResponse = await api.post('/auth/register', data);
      saveToStorage(apiResponse.data);
      toast.success('Registration successful!');
    } catch (error: unknown) {
      const message = error instanceof AxiosError 
        ? error.response?.data?.message || 'Registration failed'
        : 'Registration failed';
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('bookingConfirmationCode');
    setState({
      user: null,
      token: null,
      role: null,
      bookingConfirmationCode: null,
      loading: false,
    });
    toast.success('Logged out successfully');
    window.location.href = '/';
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    isAuthenticated: !!state.user && !!state.token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

