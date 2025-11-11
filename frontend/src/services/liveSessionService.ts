import { api } from './authService';

export interface LiveSessionData {
  id: number;
  title: string;
  description: string;
  scheduledTime: string;
  duration?: number;
  hostId: number;
  maxParticipants?: number;
  roleAccess: string[];
  status: 'scheduled' | 'live' | 'ended' | 'cancelled';
  sessionUrl?: string;
  recordingUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SessionParticipant {
  id: string;
  userId: number;
  name: string;
  email: string;
  avatar?: string;
  joinedAt: string;
  leftAt?: string;
  role: 'host' | 'participant';
  permissions: {
    canShare: boolean;
    canChat: boolean;
    canUnmute: boolean;
  };
}

export interface CreateSessionRequest {
  title: string;
  description: string;
  scheduledTime: string;
  duration?: number;
  maxParticipants?: number;
  roleAccess: string[];
  autoRecord?: boolean;
}

export interface UpdateSessionRequest {
  title?: string;
  description?: string;
  scheduledTime?: string;
  duration?: number;
  maxParticipants?: number;
  roleAccess?: string[];
  status?: 'scheduled' | 'live' | 'ended' | 'cancelled';
}

export interface JoinSessionResponse {
  sessionToken: string;
  sessionData: LiveSessionData;
  participant: SessionParticipant;
  iceServers: RTCIceServer[];
}

export interface SessionAnalytics {
  sessionId: number;
  totalParticipants: number;
  peakParticipants: number;
  averageDuration: number;
  chatMessages: number;
  engagementRate: number;
  attendanceByRole: { [role: string]: number };
  feedbackRating?: number;
}

class LiveSessionService {
  // Session Management
  async createSession(data: CreateSessionRequest): Promise<LiveSessionData> {
    const response = await api.post('/live-sessions', data);
    return response.data;
  }

  async updateSession(sessionId: number, data: UpdateSessionRequest): Promise<LiveSessionData> {
    const response = await api.put(`/live-sessions/${sessionId}`, data);
    return response.data;
  }

  async deleteSession(sessionId: number): Promise<void> {
    await api.delete(`/live-sessions/${sessionId}`);
  }

  async getSession(sessionId: number): Promise<LiveSessionData> {
    const response = await api.get(`/live-sessions/${sessionId}`);
    return response.data;
  }

  async getSessions(filters?: {
    status?: string;
    roleAccess?: string[];
    startDate?: string;
    endDate?: string;
    hostId?: number;
  }): Promise<LiveSessionData[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }
    
    const response = await api.get(`/live-sessions?${params.toString()}`);
    return response.data;
  }

  async getUpcomingSessions(): Promise<LiveSessionData[]> {
    const response = await api.get('/live-sessions/upcoming');
    return response.data;
  }

  async getLiveSessions(): Promise<LiveSessionData[]> {
    const response = await api.get('/live-sessions/live');
    return response.data;
  }

  // Session Participation
  async joinSession(sessionId: number): Promise<JoinSessionResponse> {
    const response = await api.post(`/live-sessions/${sessionId}/join`);
    return response.data;
  }

  async leaveSession(sessionId: number): Promise<void> {
    await api.post(`/live-sessions/${sessionId}/leave`);
  }

  async getSessionParticipants(sessionId: number): Promise<SessionParticipant[]> {
    const response = await api.get(`/live-sessions/${sessionId}/participants`);
    return response.data;
  }

  async updateParticipantPermissions(
    sessionId: number, 
    participantId: string, 
    permissions: Partial<SessionParticipant['permissions']>
  ): Promise<void> {
    await api.put(`/live-sessions/${sessionId}/participants/${participantId}/permissions`, permissions);
  }

  async kickParticipant(sessionId: number, participantId: string): Promise<void> {
    await api.delete(`/live-sessions/${sessionId}/participants/${participantId}`);
  }

  // Session Control
  async startSession(sessionId: number): Promise<LiveSessionData> {
    const response = await api.post(`/live-sessions/${sessionId}/start`);
    return response.data;
  }

  async endSession(sessionId: number): Promise<LiveSessionData> {
    const response = await api.post(`/live-sessions/${sessionId}/end`);
    return response.data;
  }

  async pauseSession(sessionId: number): Promise<LiveSessionData> {
    const response = await api.post(`/live-sessions/${sessionId}/pause`);
    return response.data;
  }

  async resumeSession(sessionId: number): Promise<LiveSessionData> {
    const response = await api.post(`/live-sessions/${sessionId}/resume`);
    return response.data;
  }

  // Recording Management
  async startRecording(sessionId: number): Promise<{ recordingId: string }> {
    const response = await api.post(`/live-sessions/${sessionId}/recording/start`);
    return response.data;
  }

  async stopRecording(sessionId: number): Promise<{ recordingUrl: string }> {
    const response = await api.post(`/live-sessions/${sessionId}/recording/stop`);
    return response.data;
  }

  async getRecordings(sessionId: number): Promise<{ url: string; duration: number; createdAt: string }[]> {
    const response = await api.get(`/live-sessions/${sessionId}/recordings`);
    return response.data;
  }

  // Analytics and Reporting
  async getSessionAnalytics(sessionId: number): Promise<SessionAnalytics> {
    const response = await api.get(`/live-sessions/${sessionId}/analytics`);
    return response.data;
  }

  async getHostAnalytics(hostId: number, period?: string): Promise<{
    totalSessions: number;
    totalParticipants: number;
    averageRating: number;
    engagementMetrics: any;
  }> {
    const params = period ? `?period=${period}` : '';
    const response = await api.get(`/live-sessions/analytics/host/${hostId}${params}`);
    return response.data;
  }

  // Feedback and Rating
  async submitFeedback(sessionId: number, feedback: {
    rating: number;
    comment?: string;
    categories?: { [key: string]: number };
  }): Promise<void> {
    await api.post(`/live-sessions/${sessionId}/feedback`, feedback);
  }

  async getSessionFeedback(sessionId: number): Promise<{
    averageRating: number;
    totalResponses: number;
    comments: { rating: number; comment: string; createdAt: string }[];
  }> {
    const response = await api.get(`/live-sessions/${sessionId}/feedback`);
    return response.data;
  }

  // Utility Methods
  generateSessionUrl(sessionId: number): string {
    return `${window.location.origin}/session/${sessionId}`;
  }

  generateInviteLink(sessionId: number, expiresIn?: number): string {
    const baseUrl = this.generateSessionUrl(sessionId);
    if (expiresIn) {
      const expires = Date.now() + expiresIn * 1000;
      return `${baseUrl}?expires=${expires}`;
    }
    return baseUrl;
  }

  isSessionActive(session: LiveSessionData): boolean {
    return session.status === 'live';
  }

  isSessionUpcoming(session: LiveSessionData): boolean {
    const now = new Date();
    const sessionTime = new Date(session.scheduledTime);
    return session.status === 'scheduled' && sessionTime > now;
  }

  getSessionTimeRemaining(session: LiveSessionData): number {
    const now = new Date();
    const sessionTime = new Date(session.scheduledTime);
    return Math.max(0, sessionTime.getTime() - now.getTime());
  }

  formatSessionDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  // WebRTC Helper Methods
  getDefaultIceServers(): RTCIceServer[] {
    return [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
    ];
  }

  async checkMediaPermissions(): Promise<{
    camera: boolean;
    microphone: boolean;
    screen: boolean;
  }> {
    try {
      const permissions = await Promise.all([
        navigator.permissions.query({ name: 'camera' as PermissionName }),
        navigator.permissions.query({ name: 'microphone' as PermissionName }),
      ]);

      return {
        camera: permissions[0].state === 'granted',
        microphone: permissions[1].state === 'granted',
        screen: 'getDisplayMedia' in navigator.mediaDevices,
      };
    } catch (error) {
      console.error('Error checking permissions:', error);
      return { camera: false, microphone: false, screen: false };
    }
  }

  async testMediaDevices(): Promise<{
    cameras: MediaDeviceInfo[];
    microphones: MediaDeviceInfo[];
    speakers: MediaDeviceInfo[];
  }> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      
      return {
        cameras: devices.filter(device => device.kind === 'videoinput'),
        microphones: devices.filter(device => device.kind === 'audioinput'),
        speakers: devices.filter(device => device.kind === 'audiooutput'),
      };
    } catch (error) {
      console.error('Error enumerating devices:', error);
      return { cameras: [], microphones: [], speakers: [] };
    }
  }
}

export const liveSessionService = new LiveSessionService();
export default liveSessionService;
