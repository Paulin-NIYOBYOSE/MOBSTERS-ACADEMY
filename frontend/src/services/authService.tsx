import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";

export interface User {
  avatarUrl?: string;
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
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
});

// Attach access token
api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Refresh token interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = Cookies.get("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");
        const { data } = await axios.post<Tokens>(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          { refreshToken }
        );
        localStorage.setItem("accessToken", data.accessToken);
        Cookies.set("refreshToken", data.refreshToken, {
          expires: 7,
          secure: true,
          sameSite: "strict",
        });
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        Cookies.remove("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: async (
    email: string,
    name: string,
    password: string
  ): Promise<RegisterResponse> => {
    const { data } = await api.post<RegisterResponse>("/auth/register", {
      email,
      name,
      password,
    });
    return data;
  },

  login: async (email: string, password: string): Promise<Tokens> => {
    const { data } = await api.post<Tokens>("/auth/login", { email, password });
    localStorage.setItem("accessToken", data.accessToken);
    Cookies.set("refreshToken", data.refreshToken, {
      expires: 7,
      secure: true,
      sameSite: "strict",
    });
    return data;
  },

  getCurrentUser: async (): Promise<User> => {
    const { data } = await api.get<User>("/auth/me");
    return data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
    localStorage.removeItem("accessToken");
    Cookies.remove("refreshToken");
  },

  getAccessToken: (): string | null => localStorage.getItem("accessToken"),

  // Content & course APIs
  getCommunityContent: async () => (await api.get("/community/content")).data,
  getAcademyContent: async () => (await api.get("/academy/content")).data,
  getMentorshipContent: async () =>
    (await api.get("/mentor/mentorship-content")).data,

  getCourses: async () => (await api.get("/courses")).data,
  createCourse: async (courseData: {
    title: string;
    content: string;
    roleAccess: string[];
  }) => (await api.post("/courses", courseData)).data,
  updateCourse: async (
    id: number,
    courseData: { title: string; content: string; roleAccess: string[] }
  ) => (await api.put(`/courses/${id}`, courseData)).data,
  deleteCourse: async (id: number) => await api.delete(`/courses/${id}`),

  // Live sessions
  createLiveSession: async (data: {
    title: string;
    description: string;
    date: string;
    roleAccess: string[];
  }) => (await api.post("/courses/live-session", data)).data,
  updateLiveSession: async (
    id: number,
    data: {
      title: string;
      description: string;
      date: string;
      roleAccess: string[];
    }
  ) => (await api.put(`/courses/live-session/${id}`, data)).data,
  deleteLiveSession: async (id: number) =>
    await api.delete(`/courses/live-session/${id}`),
  getLiveSessions: async () => (await api.get("/courses/live-sessions")).data,

  // Signals
  createSignal: async (data: {
    title: string;
    content: string;
    roleAccess: string[];
  }) => (await api.post("/courses/signal", data)).data,
  updateSignal: async (
    id: number,
    data: { title: string; content: string; roleAccess: string[] }
  ) => (await api.put(`/courses/signal/${id}`, data)).data,
  deleteSignal: async (id: number) => await api.delete(`/courses/signal/${id}`),
  getSignals: async () => (await api.get("/courses/signals")).data,

  // Admin
  getPendingRoleRequests: async () =>
    (await api.get("/admin/role-requests")).data,
  approveRoleRequest: async (id: number) =>
    (await api.post(`/admin/role-requests/${id}/approve`)).data,

  // Payments
  createPaymentIntent: async (amount: number, id: number, program: string) =>
    (await api.post("/payment/create-payment-intent", { amount, program }))
      .data,
};
