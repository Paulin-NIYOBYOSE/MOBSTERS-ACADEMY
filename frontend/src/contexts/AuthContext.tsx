import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User } from '@/services/authService';
import Cookies from 'js-cookie';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, name: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          await refreshUser();
        } catch (error) {
          console.error('Failed to fetch user:', error);
          localStorage.removeItem('accessToken');
          Cookies.remove('refreshToken');
        }
      }
      setLoading(false);
    };

    initializeAuth();

    // Refresh when window gains focus (e.g., after admin approves roles)
    const onFocus = () => {
      if (localStorage.getItem('accessToken')) {
        refreshUser();
      }
    };
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') onFocus();
    });
    window.addEventListener('focus', onFocus);

    // Periodic refresh (every 45s) to pick up role changes
    const interval = window.setInterval(() => {
      if (localStorage.getItem('accessToken')) {
        refreshUser();
      }
    }, 45 * 1000);

    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('visibilitychange', onFocus as any);
      window.clearInterval(interval);
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await authService.login(email, password);
      await refreshUser();
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const register = async (email: string, name: string, password: string): Promise<boolean> => {
    try {
      await authService.register(email, name, password);
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    localStorage.removeItem('accessToken');
    Cookies.remove('refreshToken');
  };

  const hasRole = (role: string): boolean => {
    return user?.roles?.includes(role) || false;
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    hasRole,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};