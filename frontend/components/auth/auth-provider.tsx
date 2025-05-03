'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface UserData {
  email: string;
  name: string;
}

interface AuthResponse {
  success: boolean;
  token?: string;
  user?: UserData;
  error?: string;
}

interface AuthContextType {
  token: string | null;
  login: (email: string, password: string) => Promise<AuthResponse>;
  signup: (name: string, email: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  const handleAuthRequest = async (url: string, body: any): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_URL}/auth${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { 
          success: false, 
          error: errorData.message || 'Request failed' 
        };
      }

      const data = await response.json();
      
      if (data.token) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
      }
      
      return { 
        success: true, 
        token: data.token,
        user: data.user
      };
    } catch (error) {
      console.error('Auth request failed:', error);
      return { 
        success: false, 
        error: 'Network error' 
      };
    }
  };

  const login = (email: string, password: string) => {
    return handleAuthRequest('/login', { email, password });
  };

  const signup = (name: string, email: string, password: string) => {
    return handleAuthRequest('/signup', { name, email, password });
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}