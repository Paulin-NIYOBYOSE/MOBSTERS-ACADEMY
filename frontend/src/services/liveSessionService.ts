import { api } from './authService';

export interface LiveSessionData {
  id: number;
  title: string;
  description: string;
  date: string;
  duration?: number;
  uploadedBy: number;
  maxParticipants?: number;
  roleAccess: string[];
  status: 'scheduled' | 'live' | 'ended' | 'cancelled';
  sessionUrl?: string;
  recordingUrl?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  _count?: {
    participants: number;
  };
}

export interface SessionParticipant {
  id: string;
  userId: number;
  joinedAt: string;
  leftAt?: string;
  role: 'host' | 'participant';
  permissions: {
    canShare: boolean;
    canChat: boolean;
    canUnmute: boolean;
  };
  user: {
    id: number;
    name: string;
    email: string;
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
    const response = await api.post('/courses/live-session', {
      title: data.title,
      description: data.description,
      date: data.scheduledTime,
      roleAccess: data.roleAccess
    });
    return response.data;
  }

  async updateSession(sessionId: number, data: UpdateSessionRequest): Promise<LiveSessionData> {
    const response = await api.put(`/courses/live-session/${sessionId}`, {
      title: data.title,
      description: data.description,
      date: data.scheduledTime,
      roleAccess: data.roleAccess
    });
    return response.data;
  }

  async deleteSession(sessionId: number): Promise<void> {
    await api.delete(`/courses/live-session/${sessionId}`);
  }

  async getSession(sessionId: number): Promise<LiveSessionData> {
    try {
      console.log('[LiveSessionService] Getting session:', sessionId);
      // For now, get all sessions and filter by ID since individual session endpoint doesn't exist
      const sessions = await this.getSessions();
      console.log('[LiveSessionService] Retrieved sessions:', sessions.length);
      const session = sessions.find(s => s.id === sessionId);
      if (!session) {
        console.error('[LiveSessionService] Session not found:', { sessionId, availableSessions: sessions.map(s => s.id) });
        throw new Error(`Session with ID ${sessionId} not found`);
      }
      console.log('[LiveSessionService] Session found:', { id: session.id, title: session.title, status: session.status });
      return session;
    } catch (error) {
      console.error('[LiveSessionService] Error getting session:', {
        sessionId,
        error,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
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
    
    const response = await api.get(`/courses/live-sessions?${params.toString()}`);
    return response.data;
  }

  async getUpcomingSessions(): Promise<LiveSessionData[]> {
    const sessions = await this.getSessions();
    const now = new Date();
    return sessions.filter(s => {
      if (s.status !== 'scheduled' || !s.date) return false;
      const sessionDate = new Date(s.date);
      return !isNaN(sessionDate.getTime()) && sessionDate > now;
    });
  }

  async getUpcomingAndLiveSessions(): Promise<LiveSessionData[]> {
    try {
      const response = await api.get('/courses/upcoming-live-sessions');
      return response.data;
    } catch (error) {
      // Fallback to regular live sessions if the new endpoint is not available
      console.warn('Falling back to regular live sessions endpoint:', error);
      try {
        const response = await api.get('/courses/live-sessions');
        return response.data;
      } catch (fallbackError) {
        console.error('Both live session endpoints failed:', fallbackError);
        return [];
      }
    }
  }

  async getLiveSessions(): Promise<LiveSessionData[]> {
    const sessions = await this.getSessions();
    return sessions.filter(s => s.status === 'live');
  }

  // Session Participation
  async joinSession(sessionId: number): Promise<JoinSessionResponse> {
    try {
      console.log('[LiveSessionService] Joining session:', sessionId);
      const response = await api.post(`/courses/live-session/${sessionId}/join`);
      console.log('[LiveSessionService] Join session response:', {
        sessionId,
        hasToken: !!response.data?.sessionToken,
        hasSessionData: !!response.data?.sessionData,
        hasParticipant: !!response.data?.participant
      });
      return response.data;
    } catch (error) {
      console.error('[LiveSessionService] Error joining session:', {
        sessionId,
        error,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        status: (error as any)?.response?.status,
        statusText: (error as any)?.response?.statusText
      });
      throw error;
    }
  }

  async leaveSession(sessionId: number): Promise<void> {
    try {
      console.log('[LiveSessionService] Leaving session:', sessionId);
      await api.post(`/courses/live-session/${sessionId}/leave`);
      console.log('[LiveSessionService] Successfully left session:', sessionId);
    } catch (error) {
      console.error('[LiveSessionService] Error leaving session:', {
        sessionId,
        error,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        status: (error as any)?.response?.status
      });
      throw error;
    }
  }

  async getSessionParticipants(sessionId: number): Promise<SessionParticipant[]> {
    try {
      console.log('[LiveSessionService] Getting session participants:', sessionId);
      const response = await api.get(`/courses/live-session/${sessionId}/participants`);
      console.log('[LiveSessionService] Participants retrieved:', {
        sessionId,
        participantCount: response.data?.length || 0
      });
      return response.data;
    } catch (error) {
      console.error('[LiveSessionService] Error getting session participants:', {
        sessionId,
        error,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        status: (error as any)?.response?.status
      });
      throw error;
    }
  }

  async updateParticipantPermissions(
    sessionId: number, 
    participantId: string, 
    permissions: Partial<SessionParticipant['permissions']>
  ): Promise<void> {
    await api.put(`/courses/live-session/${sessionId}/participants/${participantId}/permissions`, permissions);
  }

  async kickParticipant(sessionId: number, participantId: string): Promise<void> {
    await api.delete(`/courses/live-session/${sessionId}/participants/${participantId}`);
  }

  // Session Control
  async startSession(sessionId: number): Promise<LiveSessionData> {
    const response = await api.post(`/courses/live-session/${sessionId}/start`);
    return response.data;
  }

  async endSession(sessionId: number): Promise<LiveSessionData> {
    const response = await api.post(`/courses/live-session/${sessionId}/end`);
    return response.data;
  }

  async pauseSession(sessionId: number): Promise<LiveSessionData> {
    // Not implemented in backend yet
    throw new Error('Pause functionality not implemented');
  }

  async resumeSession(sessionId: number): Promise<LiveSessionData> {
    // Not implemented in backend yet
    throw new Error('Resume functionality not implemented');
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
    const response = await api.get(`/courses/live-session/${sessionId}/analytics`);
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
    await api.post(`/courses/live-session/${sessionId}/feedback`, feedback);
  }

  async getSessionFeedback(sessionId: number): Promise<{
    averageRating: number;
    totalResponses: number;
    comments: { rating: number; comment: string; createdAt: string }[];
  }> {
    const response = await api.get(`/courses/live-session/${sessionId}/feedback`);
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
    if (session.status !== 'scheduled' || !session.date) return false;
    const now = new Date();
    const sessionTime = new Date(session.date);
    return !isNaN(sessionTime.getTime()) && sessionTime > now;
  }

  getSessionTimeRemaining(session: LiveSessionData): number {
    if (!session.date) return 0;
    const now = new Date();
    const sessionTime = new Date(session.date);
    if (isNaN(sessionTime.getTime())) return 0;
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
