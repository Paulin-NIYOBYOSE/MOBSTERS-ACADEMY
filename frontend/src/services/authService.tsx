import axios, { AxiosInstance, AxiosError } from "axios";
import Cookies from "js-cookie";

// Auth error types matching backend
export enum AuthErrorCode {
  USER_NOT_FOUND = "USER_NOT_FOUND",
  INVALID_PASSWORD = "INVALID_PASSWORD",
  EMAIL_ALREADY_EXISTS = "EMAIL_ALREADY_EXISTS",
  INVALID_EMAIL_FORMAT = "INVALID_EMAIL_FORMAT",
  WEAK_PASSWORD = "WEAK_PASSWORD",
  ACCOUNT_LOCKED = "ACCOUNT_LOCKED",
  ACCOUNT_DISABLED = "ACCOUNT_DISABLED",
  EMAIL_NOT_VERIFIED = "EMAIL_NOT_VERIFIED",
  INVALID_REFRESH_TOKEN = "INVALID_REFRESH_TOKEN",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  TOO_MANY_ATTEMPTS = "TOO_MANY_ATTEMPTS",
  SERVER_ERROR = "SERVER_ERROR",
  VALIDATION_ERROR = "VALIDATION_ERROR",
}

export interface AuthErrorResponse {
  error: {
    code: AuthErrorCode;
    message: string;
    details?: any;
    timestamp: string;
    path?: string;
  };
}

export class AuthError extends Error {
  constructor(
    public code: AuthErrorCode,
    message: string,
    public details?: any,
    public status?: number
  ) {
    super(message);
    this.name = "AuthError";
  }

  static fromResponse(error: AxiosError): AuthError {
    if (error.response?.data && typeof error.response.data === "object") {
      const errorData = error.response.data as any;

      // Handle new structured error format
      if (errorData.error && errorData.error.code) {
        return new AuthError(
          errorData.error.code,
          errorData.error.message,
          errorData.error.details,
          error.response.status
        );
      }

      // Handle validation errors
      if (errorData.message && Array.isArray(errorData.message)) {
        return new AuthError(
          AuthErrorCode.VALIDATION_ERROR,
          "Validation failed",
          { validationErrors: errorData.message },
          error.response.status
        );
      }

      // Handle simple message format
      if (errorData.message) {
        return new AuthError(
          AuthErrorCode.SERVER_ERROR,
          errorData.message,
          undefined,
          error.response.status
        );
      }
    }

    // Default error handling
    return new AuthError(
      AuthErrorCode.SERVER_ERROR,
      error.message || "An unexpected error occurred",
      undefined,
      error.response?.status
    );
  }

  getUserFriendlyMessage(): string {
    switch (this.code) {
      case AuthErrorCode.USER_NOT_FOUND:
        return "No account found with this email address. Please check your email or sign up.";
      case AuthErrorCode.INVALID_PASSWORD:
        return "The password you entered is incorrect. Please try again.";
      case AuthErrorCode.EMAIL_ALREADY_EXISTS:
        return "An account with this email already exists. Please sign in instead.";
      case AuthErrorCode.WEAK_PASSWORD:
        return `Password is too weak. ${
          this.details?.requirements
            ? "Requirements: " + this.details.requirements.join(", ")
            : ""
        }`;
      case AuthErrorCode.ACCOUNT_LOCKED:
        return "Your account is temporarily locked due to multiple failed login attempts. Please try again later.";
      case AuthErrorCode.ACCOUNT_DISABLED:
        return "Your account has been disabled. Please contact support for assistance.";
      case AuthErrorCode.TOO_MANY_ATTEMPTS:
        return "Too many login attempts. Please wait before trying again.";
      case AuthErrorCode.VALIDATION_ERROR:
        if (
          this.details?.validationErrors &&
          Array.isArray(this.details.validationErrors)
        ) {
          return this.details.validationErrors.join(". ");
        }
        return "Please check your input and try again.";
      case AuthErrorCode.INVALID_REFRESH_TOKEN:
      case AuthErrorCode.TOKEN_EXPIRED:
        return "Your session has expired. Please sign in again.";
      default:
        return this.message || "An error occurred. Please try again.";
    }
  }
}

export interface User {
  avatarUrl?: string;
  id: number;
  email: string;
  name: string;
  roles: string[];
  plan: string;
  status: string;
  subscriptionEnd?: string;
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

interface RegisterResponse {
  message: string;
  userId: number;
}

interface OverviewStats {
  totalStudents: number;
  activeMentorships: number;
  revenueThisMonth: number;
  expiringSoon: User[];
}

export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
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

// Refresh token interceptor with better error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors with token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get("refreshToken");
        if (!refreshToken) {
          throw new AuthError(
            AuthErrorCode.INVALID_REFRESH_TOKEN,
            "No refresh token available"
          );
        }

        const { data } = await axios.post<Tokens>(
          `${
            import.meta.env.VITE_API_URL || "http://localhost:3000"
          }/auth/refresh`,
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
        console.error('[AuthService] Token refresh failed:', {
          error: refreshError,
          currentPath: window.location.pathname,
          errorMessage: refreshError instanceof Error ? refreshError.message : 'Unknown error'
        });
        
        // Clear tokens and redirect to login
        localStorage.removeItem("accessToken");
        Cookies.remove("refreshToken");

        // Only redirect if we're not already on the login page or in a session
        const isInSession = window.location.pathname.includes('/session/');
        const isOnAuthPage = window.location.pathname.includes("/login") || 
                            window.location.pathname.includes("/register");
        
        if (!isOnAuthPage && !isInSession) {
          console.log('[AuthService] Redirecting to login due to auth failure');
          window.location.href = "/login";
        } else if (isInSession) {
          console.log('[AuthService] Auth failed in session, letting session component handle it');
          // Don't redirect immediately, let the session component handle the auth error
        }

        return Promise.reject(
          AuthError.fromResponse(refreshError as AxiosError)
        );
      }
    }

    // For non-auth endpoints, return the original error
    return Promise.reject(error);
  }
);

export const authService = {
  register: async (
    email: string,
    name: string,
    password: string
  ): Promise<RegisterResponse> => {
    try {
      const { data } = await api.post<RegisterResponse>("/auth/register", {
        email,
        name,
        password,
      });
      return data;
    } catch (error) {
      throw AuthError.fromResponse(error as AxiosError);
    }
  },

  login: async (email: string, password: string): Promise<Tokens> => {
    try {
      const { data } = await api.post<Tokens>("/auth/login", {
        email,
        password,
      });
      localStorage.setItem("accessToken", data.accessToken);
      Cookies.set("refreshToken", data.refreshToken, {
        expires: 7,
        secure: true,
        sameSite: "strict",
      });
      return data;
    } catch (error) {
      throw AuthError.fromResponse(error as AxiosError);
    }
  },

  getCurrentUser: async (): Promise<User> => {
    try {
      console.log('[AuthService] Fetching current user...');
      const { data } = await api.get<User>("/auth/me");
      console.log('[AuthService] Current user fetched successfully:', { id: data.id, email: data.email });
      return data;
    } catch (error) {
      console.error('[AuthService] Failed to fetch current user:', {
        error,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      });
      throw AuthError.fromResponse(error as AxiosError);
    }
  },

  logout: async (): Promise<void> => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      // Don't throw on logout errors, just log them
      console.warn("Logout request failed:", error);
    } finally {
      // Always clear local storage
      localStorage.removeItem("accessToken");
      Cookies.remove("refreshToken");
    }
  },

  getAccessToken: (): string | null => localStorage.getItem("accessToken"),

  // Content & course APIs
  getCommunityContent: async () => (await api.get("/community/content")).data,
  getAcademyContent: async () => (await api.get("/academy/content")).data,
  getMentorshipContent: async () =>
    (await api.get("/mentor/mentorship-content")).data,

  getCourses: async () => (await api.get("/courses")).data,
  getAllCourses: async () => (await api.get("/courses")).data, // For admins, use same endpoint as it filters by role
  // Course videos (series)
  getCourseVideos: async (courseId: number) =>
    (await api.get(`/courses/${courseId}/videos`)).data,
  addCourseVideo: async (
    courseId: number,
    data: {
      title: string;
      description?: string;
      videoUrl: string;
      durationSec?: number;
      orderIndex?: number;
    }
  ) => (await api.post(`/courses/${courseId}/videos`, data)).data,
  addCourseVideoFile: async (courseId: number, formData: FormData) =>
    (
      await api.post(`/courses/${courseId}/videos/file`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    ).data,
  updateCourseVideo: async (
    courseId: number,
    videoId: number,
    data: {
      title?: string;
      description?: string;
      videoUrl?: string;
      durationSec?: number;
      orderIndex?: number;
    }
  ) => (await api.put(`/courses/${courseId}/videos/${videoId}`, data)).data,
  deleteCourseVideo: async (courseId: number, videoId: number) =>
    (await api.delete(`/courses/${courseId}/videos/${videoId}`)).data,
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
  uploadCourseThumbnail: async (courseId: number, formData: FormData) =>
    (
      await api.post(`/courses/${courseId}/thumbnail`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    ).data,

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
  getPendingRoleRequests: async () => {
    try {
      return (await api.get("/role-requests")).data;
    } catch (e: any) {
      if (e?.response?.status === 404) {
        return [] as any[];
      }
      throw e;
    }
  },
  approveRoleRequest: async (id: number) =>
    (await api.post(`/role-requests/${id}/approve`)).data,
  rejectRoleRequest: async (id: number) =>
    (await api.post(`/role-requests/${id}/reject`)).data,
  requestRole: async (program: "academy" | "mentorship") =>
    (await api.post(`/role-requests`, { program })).data,
  getMyRoleRequests: async () => (await api.get(`/me/role-requests`)).data,

  // User Management
  getUsers: async (): Promise<User[]> => (await api.get("/admin/users")).data,
  updateUser: async (id: number, userData: { plan: string; status: string }) =>
    (await api.put(`/admin/users/${id}`, userData)).data,

  deleteUser: async (id: number) =>
    (await api.delete(`/admin/users/${id}`)).data,

  assignRoles: async (id: number, roles: string[]) =>
    (await api.post(`/admin/users/${id}/roles`, { roles })).data,

  // Subscription Management
  extendSubscription: async (userId: number) =>
    (await api.post(`/admin/subscriptions/${userId}/extend`)).data,
  cancelSubscription: async (userId: number) =>
    (await api.post(`/admin/subscriptions/${userId}/cancel`)).data,

  // Overview Stats
  getOverviewStats: async (): Promise<OverviewStats> => {
    // No backend endpoint available; synthesize from existing data
    try {
      const users = await authService.getUsers().catch(() => [] as User[]);
      return {
        totalStudents: users.length || 0,
        activeMentorships:
          users.filter((u: any) => u.plan === "mentorship").length || 0,
        revenueThisMonth: 0,
        expiringSoon: [],
      } as OverviewStats;
    } catch {
      return {
        totalStudents: 0,
        activeMentorships: 0,
        revenueThisMonth: 0,
        expiringSoon: [],
      } as OverviewStats;
    }
  },

  // Payments
  createPaymentIntent: async (amount: number, id: number, program: string) => {
    try {
      return (
        await api.post("/payment/create-payment-intent", { amount, program })
      ).data;
    } catch (error) {
      throw AuthError.fromResponse(error as AxiosError);
    }
  },

  // Error handling helper
  isAuthError: (error: any): error is AuthError => {
    return error instanceof AuthError;
  },

  // Get user-friendly error message
  getErrorMessage: (error: any): string => {
    if (error instanceof AuthError) {
      return error.getUserFriendlyMessage();
    }
    return error?.message || "An unexpected error occurred";
  },
};
