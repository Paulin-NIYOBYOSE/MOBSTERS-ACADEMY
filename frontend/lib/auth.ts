// lib/auth.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

interface AuthResponse {
  success: boolean;
  token?: string;
  error?: string;
  user?: {
    email: string;
    name: string;
  };
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        return { 
          success: true, 
          token: data.token,
          user: {
            email: data.email,
            name: data.name
          }
        };
      } else {
        return { success: false, error: data.message || 'Login failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  },

  async signup(name: string, email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        return { 
          success: true, 
          token: data.token,
          user: {
            email: data.email,
            name: data.name
          }
        };
      } else {
        return { success: false, error: data.message || 'Signup failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  },

  async getProfile(token: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        return { 
          success: true, 
          user: {
            email: data.email,
            name: data.name
          }
        };
      } else {
        return { success: false, error: data.message || 'Failed to fetch profile' };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }
};