import axios, { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';

export interface User {
  avatarUrl: string;
  id: number;
  email: string;
  name: string;
  roles: string[];
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

interface RegisterResponse {
  message: string;
  userId: number;
}

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = Cookies.get('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');
        const { data } = await axios.post<Tokens>(`${import.meta.env.VITE_API_URL}/auth/refresh`, { refreshToken });
        localStorage.setItem('accessToken', data.accessToken);
        Cookies.set('refreshToken', data.refreshToken, { expires: 7, secure: true, sameSite: 'strict' });
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        Cookies.remove('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async register(email: string, name: string, password: string): Promise<RegisterResponse> {
    const { data } = await api.post('/auth/register', { email, name, password });
    return data;
  },

  async login(email: string, password: string): Promise<Tokens> {
    const { data } = await api.post<Tokens>('/auth/login', { email, password });
    localStorage.setItem('accessToken', data.accessToken);
    Cookies.set('refreshToken', data.refreshToken, { expires: 7, secure: true, sameSite: 'strict' });
    return data;
  },

  async getCurrentUser(): Promise<User> {
    const { data } = await api.get<User>('/auth/me');
    return data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
    localStorage.removeItem('accessToken');
    Cookies.remove('refreshToken');
  },

  async getCommunityContent(): Promise<any> {
    const { data } = await api.get('/community/content');
    return data;
  },

  async getAcademyContent(): Promise<any> {
    const { data } = await api.get('/academy/content');
    return data;
  },

  async getMentorshipContent(): Promise<any> {
    const { data } = await api.get('/mentor/mentorship-content');
    return data;
  },

  async getCourses(): Promise<{ id: number; title: string; content: string; roleAccess: string[]; createdAt: string }[]> {
    const { data } = await api.get('/courses');
    return data;
  },

  async createCourse(courseData: { title: string; content: string; roleAccess: string[] }): Promise<any> {
    const { data } = await api.post('/courses', courseData);
    return data;
  },

  async updateCourse(courseId: number, courseData: { title: string; content: string; roleAccess: string[] }): Promise<any> {
    const { data } = await api.put(`/courses/${courseId}`, courseData);
    return data;
  },

  async deleteCourse(courseId: number): Promise<void> {
    await api.delete(`/courses/${courseId}`);
  },

  async createLiveSession(sessionData: { title: string; description: string; date: string; roleAccess: string[] }): Promise<any> {
    const { data } = await api.post('/courses/live-session', sessionData);
    return data;
  },

  async updateLiveSession(sessionId: number, sessionData: { title: string; description: string; date: string; roleAccess: string[] }): Promise<any> {
    const { data } = await api.put(`/courses/live-session/${sessionId}`, sessionData);
    return data;
  },

  async deleteLiveSession(sessionId: number): Promise<void> {
    await api.delete(`/courses/live-session/${sessionId}`);
  },

  async getLiveSessions(): Promise<{ id: number; title: string; description: string; date: string; roleAccess: string[]; createdAt: string }[]> {
    const { data } = await api.get('/courses/live-sessions');
    return data;
  },

  async createSignal(signalData: { title: string; content: string; roleAccess: string[] }): Promise<any> {
    const { data } = await api.post('/courses/signal', signalData);
    return data;
  },

  async updateSignal(signalId: number, signalData: { title: string; content: string; roleAccess: string[] }): Promise<any> {
    const { data } = await api.put(`/courses/signal/${signalId}`, signalData);
    return data;
  },

  async deleteSignal(signalId: number): Promise<void> {
    await api.delete(`/courses/signal/${signalId}`);
  },

  async getSignals(): Promise<{ id: number; title: string; content: string; roleAccess: string[]; createdAt: string }[]> {
    const { data } = await api.get('/courses/signals');
    return data;
  },

  async getPendingRoleRequests(): Promise<{ id: number; userId: number; program: string; status: string; createdAt: string; user: { email: string; name: string } }[]> {
    const { data } = await api.get('/admin/role-requests');
    return data;
  },

  async approveRoleRequest(requestId: number): Promise<any> {
    const { data } = await api.post(`/admin/role-requests/${requestId}/approve`);
    return data;
  },

  async createPaymentIntent(amount: number, program: string): Promise<{ clientSecret: string }> {
    const { data } = await api.post('/payment/create-payment-intent', { amount, program });
    return data;
  },

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  },
};