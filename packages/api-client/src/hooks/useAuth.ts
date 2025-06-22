import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { apiClient } from '../index';
import type { User, LoginInput, SignupInput } from '@itemseek2/shared';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

interface AuthContextType extends AuthState {
  login: (data: LoginInput) => Promise<void>;
  signup: (data: SignupInput) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  const login = useCallback(async (data: LoginInput) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await apiClient.login(data);
      if (response.success && response.data) {
        apiClient.setAuthToken(response.data.accessToken);
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        setState({ user: response.data.user, loading: false, error: null });
      }
    } catch (error) {
      setState(prev => ({ ...prev, loading: false, error: error as Error }));
      throw error;
    }
  }, []);

  const signup = useCallback(async (data: SignupInput) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await apiClient.signup(data);
      if (response.success && response.data) {
        apiClient.setAuthToken(response.data.accessToken);
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        setState({ user: response.data.user, loading: false, error: null });
      }
    } catch (error) {
      setState(prev => ({ ...prev, loading: false, error: error as Error }));
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      await apiClient.logout();
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      apiClient.clearAuthToken();
      setState({ user: null, loading: false, error: null });
    }
  }, []);

  const refreshAuth = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setState({ user: null, loading: false, error: null });
      return;
    }

    setState(prev => ({ ...prev, loading: true }));
    try {
      apiClient.setAuthToken(token);
      const response = await apiClient.getCurrentUser();
      if (response.success && response.data) {
        setState({ user: response.data, loading: false, error: null });
      }
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      apiClient.clearAuthToken();
      setState({ user: null, loading: false, error: error as Error });
    }
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}