'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient, ApiError } from '@itemseek2/api-client';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  organizationId: string;
  organizationName: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

let refreshPromise: Promise<any> | null = null;

export function useAuth() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null
  });

  // Handle auth errors
  const handleAuthError = useCallback(() => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('refresh-token');
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      error: 'Authentication failed'
    });
  }, []);

  // Refresh auth token
  const refreshAuthToken = useCallback(async () => {
    // Prevent multiple simultaneous refresh attempts
    if (refreshPromise) {
      return refreshPromise;
    }

    const refreshToken = localStorage.getItem('refresh-token');
    if (!refreshToken) {
      throw new Error('No refresh token');
    }

    refreshPromise = apiClient.post('/auth/refresh', {
      refreshToken
    }, {
      skipAuth: true
    });

    try {
      const response = await refreshPromise;
      
      // Update tokens
      localStorage.setItem('auth-token', response.accessToken);
      if (response.refreshToken) {
        localStorage.setItem('refresh-token', response.refreshToken);
      }

      return response;
    } finally {
      refreshPromise = null;
    }
  }, []);

  // Check and refresh token
  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('auth-token');
    const refreshToken = localStorage.getItem('refresh-token');
    
    if (!token) {
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null
      });
      return;
    }

    try {
      // Verify current token
      const response = await apiClient.get('/auth/verify', {
        skipAuth: false
      });

      setState({
        user: response.user,
        isLoading: false,
        isAuthenticated: true,
        error: null
      });
    } catch (error) {
      if (error instanceof ApiError && error.status === 401 && refreshToken) {
        // Token expired, try to refresh
        try {
          await refreshAuthToken();
          // Retry verification
          const response = await apiClient.get('/auth/verify');
          setState({
            user: response.user,
            isLoading: false,
            isAuthenticated: true,
            error: null
          });
        } catch (refreshError) {
          // Refresh failed
          handleAuthError();
        }
      } else {
        handleAuthError();
      }
    }
  }, [handleAuthError, refreshAuthToken]);

  // Login
  const login = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password
      }, {
        skipAuth: true
      });

      // Store tokens
      localStorage.setItem('auth-token', response.accessToken);
      localStorage.setItem('refresh-token', response.refreshToken);
      
      // Store auth cookie for SSR
      document.cookie = `auth-token=${response.accessToken}; path=/; max-age=3600; SameSite=Lax`;

      setState({
        user: response.user,
        isLoading: false,
        isAuthenticated: true,
        error: null
      });

      return { success: true };
    } catch (error) {
      const message = error instanceof ApiError 
        ? error.data?.message || 'Invalid credentials'
        : 'Login failed';
        
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: message
      }));
      
      return { success: false, error: message };
    }
  };

  // Logout
  const logout = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      if (token) {
        // Notify server
        await apiClient.post('/auth/logout', {}, {
          skipAuth: false
        }).catch(() => {
          // Ignore logout errors
        });
      }
    } finally {
      // Clear local state
      localStorage.removeItem('auth-token');
      localStorage.removeItem('refresh-token');
      document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null
      });

      router.push('/login');
    }
  };

  // Auto-refresh token before expiry
  useEffect(() => {
    if (!state.isAuthenticated) return;

    const setupTokenRefresh = () => {
      const token = localStorage.getItem('auth-token');
      if (!token) return;

      try {
        // Decode token to get expiry
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiryTime = payload.exp * 1000;
        const currentTime = Date.now();
        const timeUntilExpiry = expiryTime - currentTime;
        
        // Refresh 5 minutes before expiry
        const refreshTime = timeUntilExpiry - (5 * 60 * 1000);
        
        if (refreshTime > 0) {
          const timeout = setTimeout(async () => {
            try {
              await refreshAuthToken();
              setupTokenRefresh(); // Setup next refresh
            } catch (error) {
              console.error('Token refresh failed:', error);
            }
          }, refreshTime);

          return () => clearTimeout(timeout);
        }
      } catch (error) {
        console.error('Failed to parse token:', error);
      }
    };

    const cleanup = setupTokenRefresh();
    return cleanup;
  }, [state.isAuthenticated, refreshAuthToken]);

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user: state.user,
    isLoading: state.isLoading,
    isAuthenticated: state.isAuthenticated,
    error: state.error,
    login,
    logout,
    checkAuth,
    refreshToken: refreshAuthToken
  };
}