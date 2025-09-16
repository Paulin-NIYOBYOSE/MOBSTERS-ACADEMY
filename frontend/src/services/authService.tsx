import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse {
  message: string;
  userId: string;
}

class AuthService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    this.accessToken = localStorage.getItem('accessToken');
    this.refreshToken = localStorage.getItem('refreshToken');
    this.setupAxiosInterceptors();
  }

  private setupAxiosInterceptors() {
    axios.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            await this.refreshTokens();
            originalRequest.headers.Authorization = `Bearer ${this.accessToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            this.clearTokens();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await axios.post<LoginResponse>(`${API_BASE_URL}/auth/login`, {
      email,
      password,
    });

    this.setTokens(response.data.accessToken, response.data.refreshToken);
    return response.data;
  }

  async register(email: string, name: string, password: string, program?: string): Promise<RegisterResponse> {
    const response = await axios.post<RegisterResponse>(`${API_BASE_URL}/auth/register`, {
      email,
      name,
      password,
      program,
    });

    return response.data;
  }

  async refreshTokens(): Promise<LoginResponse> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post<LoginResponse>(`${API_BASE_URL}/auth/refresh`, {
      refreshToken: this.refreshToken,
    });

    this.setTokens(response.data.accessToken, response.data.refreshToken);
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await axios.get<User>(`${API_BASE_URL}/auth/me`);
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/auth/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearTokens();
    }
  }

  private setTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  // Admin endpoints
  async getUsers(): Promise<User[]> {
    const response = await axios.get<User[]>(`${API_BASE_URL}/admin/users`);
    return response.data;
  }

  async assignRoles(userId: string, roles: string[]): Promise<void> {
    await axios.post(`${API_BASE_URL}/admin/users/${userId}/roles`, { roles });
  }

  // Content endpoints
  async getCommunityContent(): Promise<any> {
    const response = await axios.get(`${API_BASE_URL}/community/content`);
    return response.data;
  }

  async getAcademyContent(): Promise<any> {
    const response = await axios.get(`${API_BASE_URL}/academy/content`);
    return response.data;
  }

  async getMentorshipContent(): Promise<any> {
    const response = await axios.get(`${API_BASE_URL}/mentor/mentorship-content`);
    return response.data;
  }

  // Admin role request endpoints
  async getPendingRoleRequests(): Promise<any> {
    const response = await axios.get(`${API_BASE_URL}/admin/role-requests`);
    return response.data;
  }

  async approveRoleRequest(requestId: string): Promise<void> {
    await axios.post(`${API_BASE_URL}/admin/role-requests/${requestId}/approve`);
  }

  // Payment endpoint
  async createPaymentIntent(amount: number, userId: string, program: string): Promise<any> {
    const response = await axios.post(`${API_BASE_URL}/payment/create-payment-intent`, {
      amount,
      userId,
      program,
    });
    return response.data;
  }
}

export const authService = new AuthService();