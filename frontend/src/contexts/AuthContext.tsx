import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user is authenticated on mount
  useEffect(() => {
    if (token) {
      checkAuth();
    }
  }, [token]);

  const checkAuth = async () => {
    if (!token) return;

    try {
      const response = await apiService.getCurrentUser(token);
      if (response.data) {
        setUser(response.data.user);
      } else {
        // Token is invalid, clear it
        logout();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.login(email, password);
      
      if (response.error) {
        setError(response.error);
        setLoading(false);
        return false;
      }

      if (response.data) {
        const { token: newToken, user: userData } = response.data;
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('token', newToken);
        setLoading(false);
        return true;
      }

      setLoading(false);
      return false;
    } catch (error) {
      setError('Login failed. Please try again.');
      setLoading(false);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.register(name, email, password);
      
      if (response.error) {
        setError(response.error);
        setLoading(false);
        return false;
      }

      if (response.data) {
        const { token: newToken, user: userData } = response.data;
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('token', newToken);
        setLoading(false);
        return true;
      }

      setLoading(false);
      return false;
    } catch (error) {
      setError('Registration failed. Please try again.');
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
