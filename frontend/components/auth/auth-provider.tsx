'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';

interface UserData {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface AuthResponse {
  success: boolean;
  token?: string;
  user?: UserData;
  error?: string;
}

interface AuthContextType {
  token: string | null;
  user: UserData | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  signup: (name: string, email: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  });

  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleAuthRequest = async (
    url: string,
    body: any
  ): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_URL}/auth${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      console.log("login success")

      console.log(data)

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Request failed',
        };
      }

      if (data.token) {
        setToken(data.token);
        localStorage.setItem('token', data.token);

        if (data.user) {
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      }

      return {
        success: true,
        token: data.token,
        user: data.user || undefined,
      };
    } catch (error) {
      console.error('Auth request failed:', error);
      return { success: false, error: 'Network error' };
    }
  };

  async function login(email: string, password: string) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data)
      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);

        if (data.user) {
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        return {
          success: true,
          token: data.token,
          user: data.user,
        };
      } else {
        return {
          success: false,
          error: data.message || 'Invalid credentials',
        };
      }
    } catch (error) {
      return { success: false, error: 'Login request failed' };
    }
  }

  const signup = (name: string, email: string, password: string) => {
    return handleAuthRequest('/signup', { name, email, password });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{ token, user, loading, login, signup, logout }}
    >
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
