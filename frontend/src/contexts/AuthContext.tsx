import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User } from '@/services/authService';
import Cookies from 'js-cookie';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  register: (email: string, name: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
  refreshUser: () => Promise<User | null>;
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
      return userData;
    } catch (error) {
      console.error('Failed to refresh user:', error);
      return null;
    }
  };

  useEffect(() => {
    let refreshInterval: NodeJS.Timeout;
    let visibilityChangeHandler: () => void;

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

    const startRefreshInterval = () => {
      // Skip refresh if we're in a session to prevent interruptions
      const isInSession = window.location.pathname.includes('/session/');
      if (isInSession) {
        console.log('[AuthContext] Skipping auth refresh - user is in active session');
        return;
      }
      
      refreshInterval = setInterval(async () => {
        if (user && !document.hidden) { // Only refresh when tab is visible
          try {
            await authService.getCurrentUser();
          } catch (error) {
            console.error('[AuthContext] Refresh failed:', error);
          }
        }
      }, 60000); // Reduced from 30s to 60s to be less aggressive
    };

    // Handle visibility changes to prevent session interruption
    visibilityChangeHandler = () => {
      const isInSession = window.location.pathname.includes('/session/');
      
      if (document.hidden && isInSession) {
        // Tab became hidden while in session - pause refresh
        console.log('[AuthContext] Tab hidden during session - pausing auth refresh');
        if (refreshInterval) {
          clearInterval(refreshInterval);
        }
      } else if (!document.hidden && isInSession) {
        // Tab became visible again - don't restart refresh during session
        console.log('[AuthContext] Tab visible again during session - keeping auth refresh paused');
      } else if (!document.hidden && !isInSession) {
        // Tab became visible and not in session - restart refresh
        console.log('[AuthContext] Tab visible - restarting auth refresh');
        if (refreshInterval) {
          clearInterval(refreshInterval);
        }
        startRefreshInterval();
      }
    };

    initializeAuth();

    // Refresh when window gains focus (e.g., after admin approves roles)
    const onFocus = () => {
      const isInSession = window.location.pathname.includes('/session/');
      if (localStorage.getItem('accessToken') && !isInSession) {
        refreshUser();
      }
    };

    window.addEventListener('focus', onFocus);
    window.addEventListener('visibilitychange', visibilityChangeHandler);

    startRefreshInterval();

    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('visibilitychange', visibilityChangeHandler);
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [user]);

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      await authService.login(email, password);
      const userData = await refreshUser();
      return userData;
    } catch (error) {
      console.error('Login failed:', error);
      return null;
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