interface Course {
  id: number;
  title: string;
  description: string;
  thumbnailUrl?: string;
  duration?: number;
  level?: string;
  price?: number;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
  videos?: CourseVideo[];
  _count?: {
    videos: number;
  };
}

interface CourseVideo {
  id: number;
  courseId: number;
  title: string;
  description?: string;
  videoUrl: string;
  duration?: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface UserProgress {
  id: number;
  userId: number;
  courseId: number;
  videoId: number;
  completed: boolean;
  progress: number;
  lastWatchedAt: string;
  createdAt: string;
  updatedAt: string;
}

class CourseService {
  private baseUrl = 'http://localhost:3000/api';

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('accessToken');
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  // Get all courses
  async getCourses(): Promise<Course[]> {
    return this.request<Course[]>('/courses');
  }

  // Get single course with videos
  async getCourse(id: number): Promise<Course> {
    return this.request<Course>(`/courses/${id}`);
  }

  // Get user's enrolled courses (filtered by role on backend)
  async getEnrolledCourses(): Promise<Course[]> {
    return this.request<Course[]>('/courses');
  }

  // Get course progress for user
  async getCourseProgress(courseId: number): Promise<{
    courseId: number;
    totalVideos: number;
    completedVideos: number;
    progress: number;
    videoProgress: UserProgress[];
  }> {
    return this.request(`/courses/${courseId}/progress`);
  }

  // Mark video as completed
  async markVideoCompleted(courseId: number, videoId: number): Promise<UserProgress> {
    return this.request<UserProgress>(`/courses/${courseId}/videos/${videoId}/complete`, {
      method: 'POST',
    });
  }

  // Update video progress
  async updateVideoProgress(
    courseId: number,
    videoId: number,
    progress: number
  ): Promise<UserProgress> {
    return this.request<UserProgress>(`/courses/${courseId}/videos/${videoId}/progress`, {
      method: 'PUT',
      body: JSON.stringify({ progress }),
    });
  }

  // Enroll in course (for premium courses)
  async enrollInCourse(courseId: number): Promise<{ message: string }> {
    return this.request(`/courses/${courseId}/enroll`, {
      method: 'POST',
    });
  }

  // Get course videos
  async getCourseVideos(courseId: number): Promise<CourseVideo[]> {
    return this.request<CourseVideo[]>(`/courses/${courseId}/videos`);
  }
}

export const courseService = new CourseService();
export type { Course, CourseVideo, UserProgress };
