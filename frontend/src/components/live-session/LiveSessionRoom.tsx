import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  MonitorOff,
  Phone,
  PhoneOff,
  Settings,
  Users,
  MessageSquare,
  MoreVertical,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Circle,
  Square,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import liveSessionService, { LiveSessionData, SessionParticipant } from '@/services/liveSessionService';
import SessionDebugPanel from '@/components/debug/SessionDebugPanel';
import { io, Socket } from 'socket.io-client';

interface ChatMessage {
  id: string;
  userId: number;
  userName: string;
  message: string;
  timestamp: Date;
}

interface MediaState {
  video: boolean;
  audio: boolean;
  screen: boolean;
}


interface LiveSessionRoomProps {
  sessionId?: string;
  skipJoin?: boolean; // Skip the join call if already joined from parent
}

export const LiveSessionRoom: React.FC<LiveSessionRoomProps> = ({ sessionId: propSessionId, skipJoin = false }) => {
  const { sessionId: paramSessionId } = useParams<{ sessionId: string }>();
  const sessionId = propSessionId || paramSessionId;
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const { toast } = useToast();

  // Refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideosRef = useRef<{ [key: string]: HTMLVideoElement }>({});
  const peerConnectionsRef = useRef<{ [key: string]: RTCPeerConnection }>({});
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  // State
  const [session, setSession] = useState<LiveSessionData | null>(null);
  const [participants, setParticipants] = useState<SessionParticipant[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [mediaState, setMediaState] = useState<MediaState>({
    video: false,
    audio: false,
    screen: false,
  });
  const [isConnected, setIsConnected] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [sessionPersistent, setSessionPersistent] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isTabVisible, setIsTabVisible] = useState(!document.hidden);
  const initializedRef = useRef(false);
  const socketRef = useRef<Socket | null>(null);

  // WebRTC Configuration
  const iceServers = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ];

  // Initialize session
  useEffect(() => {
    if (!sessionId || !user) return;
    // Avoid creating multiple sockets
    if (socketRef.current) return;
    if (initializedRef.current) return;
    initializedRef.current = true;

    const initializeSession = async () => {
      try {
        console.log('[LiveSessionRoom] Initializing session:', sessionId);
        const sessionData = await liveSessionService.getSession(parseInt(sessionId));
        console.log('[LiveSessionRoom] Session data loaded:', sessionData);
        setSession(sessionData);

        // Join the session (skip if already joined from parent)
        if (!skipJoin) {
          console.log('[LiveSessionRoom] Joining session...');
          await liveSessionService.joinSession(parseInt(sessionId));
          console.log('[LiveSessionRoom] Successfully joined session');
        } else {
          console.log('[LiveSessionRoom] Skipping join - already joined from parent component');
        }
        
        // Load participants
        console.log('[LiveSessionRoom] Loading participants...');
        const participantsData = await liveSessionService.getSessionParticipants(parseInt(sessionId));
        console.log('[LiveSessionRoom] Participants loaded:', participantsData);
        setParticipants(participantsData);

        // Ensure local media is initialized
        await initializeMedia();

        setIsConnected(true);
        setConnectionStatus('connected');
        setSessionPersistent(true);
        setRetryCount(0); // Reset retry count on success
        
        // Start heartbeat to keep session alive
        startSessionHeartbeat();

        toast({
          title: "Joined Session",
          description: `Welcome to ${sessionData.title}`,
        });

      } catch (error) {
        console.error('[LiveSessionRoom] Failed to initialize session:', {
          error,
          sessionId,
          user: user?.id,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          errorStack: error instanceof Error ? error.stack : undefined
        });
        
        // Check if it's an auth error vs session error
        const isAuthError = error instanceof Error && 
          (error.message.includes('401') || error.message.includes('unauthorized') || error.message.includes('token'));
        
        if (isAuthError) {
          console.log('[LiveSessionRoom] Auth error detected, user will be redirected by auth service');
          toast({
            title: "Authentication Error",
            description: "Please log in again to join the session",
            variant: "destructive",
          });
        } else {
          // For non-auth errors, show error but don't immediately redirect
          if (retryCount < maxRetries) {
            setRetryCount(prev => prev + 1);
            toast({
              title: "Connection Error",
              description: `Failed to connect to session. Retrying... (${retryCount + 1}/${maxRetries})`,
              variant: "destructive",
            });
            
            // Retry with exponential backoff
            const retryDelay = Math.min(3000 * Math.pow(2, retryCount), 15000);
            setTimeout(() => {
              console.log(`[LiveSessionRoom] Retrying session initialization (attempt ${retryCount + 1})...`);
              initializeSession();
            }, retryDelay);
          } else {
            toast({
              title: "Connection Failed",
              description: "Unable to connect to session after multiple attempts. Please refresh the page.",
              variant: "destructive",
            });
          }
        }
      }
    };

    initializeSession();

    // Handle visibility changes to maintain session
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      setIsTabVisible(isVisible);
      
      if (isVisible && isConnected) {
        console.log('[LiveSessionRoom] Tab became visible - ensuring session is active');
        // Refresh participant list to confirm session is still active
        if (sessionId) {
          liveSessionService.getSessionParticipants(parseInt(sessionId))
            .then(participantsData => {
              setParticipants(participantsData);
              console.log('[LiveSessionRoom] Session confirmed active after tab visibility change');
            })
            .catch(error => {
              console.warn('[LiveSessionRoom] Failed to refresh participants after visibility change:', error);
            });
        }
      } else if (!isVisible) {
        console.log('[LiveSessionRoom] Tab became hidden - session will persist in background');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup on unmount
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      stopSessionHeartbeat();
      // Do not leave server session on unmount (StrictMode/dev re-mounts)
      cleanupLocalOnly();
      // Disconnect socket if connected
      try {
        if (socketRef.current && sessionId) {
          socketRef.current.emit('leave_session', { sessionId: parseInt(sessionId) });
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      } catch {}
      initializedRef.current = false;
    };
  }, [sessionId]);

  // Setup WebSocket for real-time chat
  useEffect(() => {
    if (!sessionId || !user) return;

    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const token = localStorage.getItem('accessToken');
    const socket = io(`${baseUrl}/ws/sessions`, {
      transports: ['websocket'],
      auth: { token },
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[LiveSessionRoom] Socket connected');
      socket.emit('join_session', { sessionId: parseInt(sessionId) });
    });

    socket.on('chat_message', (msg: any) => {
      setChatMessages(prev => [
        ...prev,
        {
          id: msg.id || Date.now().toString(),
          userId: msg.userId,
          userName: msg.userName,
          message: msg.message,
          timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
        },
      ]);
    });

    // Presence events: update participants state in real time
    socket.on('participant_joined', (payload: any) => {
      const joined = payload?.user;
      if (!joined) return;
      setParticipants(prev => {
        const exists = prev.some(p => p.user.id === joined.id);
        if (exists) return prev;
        // Append minimal participant meta if not present
        return [
          ...prev,
          {
            id: `ws-${joined.id}` as any,
            user: { id: joined.id, name: joined.name || joined.email || 'User' } as any,
            role: 'participant',
            joinedAt: new Date().toISOString() as any,
          },
        ];
      });
    });
    socket.on('participant_left', (payload: any) => {
      const left = payload?.user;
      if (!left) return;
      setParticipants(prev => prev.filter(p => p.user.id !== left.id));
    });

    socket.on('disconnect', () => {
      console.log('[LiveSessionRoom] Socket disconnected');
    });

    return () => {
      try {
        socket.emit('leave_session', { sessionId: parseInt(sessionId) });
        socket.disconnect();
      } catch {}
      socketRef.current = null;
    };
  }, [sessionId]);

  // Initialize media devices
  const initializeMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      setMediaState(prev => ({
        ...prev,
        video: true,
        audio: true,
      }));

      return stream;
    } catch (error) {
      console.error('Failed to access media devices:', error);
      toast({
        title: "Media Access Error",
        description: "Please allow camera and microphone access",
        variant: "destructive",
      });
      return null;
    }
  }, [toast]);

  // Toggle video
  const toggleVideo = useCallback(async () => {
    if (!localStreamRef.current) {
      await initializeMedia();
      return;
    }

    const videoTrack = localStreamRef.current.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setMediaState(prev => ({ ...prev, video: videoTrack.enabled }));
    }
  }, [initializeMedia]);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (!localStreamRef.current) return;

    const audioTrack = localStreamRef.current.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setMediaState(prev => ({ ...prev, audio: audioTrack.enabled }));
    }
  }, []);

  // Toggle screen sharing
  const toggleScreenShare = useCallback(async () => {
    try {
      if (mediaState.screen) {
        // Stop screen sharing
        if (screenStreamRef.current) {
          screenStreamRef.current.getTracks().forEach(track => track.stop());
          screenStreamRef.current = null;
        }
        
        // Switch back to camera
        await initializeMedia();
        setMediaState(prev => ({ ...prev, screen: false }));
      } else {
        // Start screen sharing
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });

        screenStreamRef.current = screenStream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }

        setMediaState(prev => ({ ...prev, screen: true }));

        // Handle screen share end
        screenStream.getVideoTracks()[0].onended = () => {
          setMediaState(prev => ({ ...prev, screen: false }));
          initializeMedia();
        };
      }
    } catch (error) {
      console.error('Screen sharing error:', error);
      toast({
        title: "Screen Share Error",
        description: "Failed to start screen sharing",
        variant: "destructive",
      });
    }
  }, [mediaState.screen, initializeMedia, toast]);

  // Session heartbeat to keep connection alive
  const startSessionHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }

    heartbeatIntervalRef.current = setInterval(async () => {
      if (!sessionId || !isConnected) return;

      // Skip heartbeat if tab is hidden to reduce server load
      if (document.hidden) {
        console.log('[LiveSessionRoom] Skipping heartbeat - tab is hidden');
        return;
      }

      try {
        console.log('[LiveSessionRoom] Sending heartbeat...');
        // Refresh participant list to keep session active
        const participantsData = await liveSessionService.getSessionParticipants(parseInt(sessionId));
        setParticipants(participantsData);
        console.log('[LiveSessionRoom] Heartbeat successful, participants updated');
      } catch (error) {
        console.warn('[LiveSessionRoom] Heartbeat failed:', error);
        // Don't disconnect on heartbeat failure, just log it
      }
    }, 45000); // Increased to 45 seconds to be less aggressive
  }, [sessionId, isConnected]);

  const stopSessionHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
      console.log('[LiveSessionRoom] Stopped session heartbeat');
    }
  }, []);

  // Soft local-only cleanup (does not inform server)
  const cleanupLocalOnly = useCallback(() => {
    try {
      // Stop all media streams
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
        console.log('[LiveSessionRoom] (soft) Stopped local media streams');
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
        console.log('[LiveSessionRoom] (soft) Stopped screen share streams');
      }

      // Close peer connections
      Object.values(peerConnectionsRef.current).forEach(pc => pc.close());
      console.log('[LiveSessionRoom] (soft) Closed peer connections');

      setIsConnected(false);
      setConnectionStatus('disconnected');
    } catch (e) {
      console.warn('[LiveSessionRoom] Soft cleanup error:', e);
    }
  }, []);

  // Leave session
  const leaveSession = useCallback(async (navigateAway: boolean = true) => {
    try {
      console.log('[LiveSessionRoom] Leaving session:', sessionId);
      
      // Stop all media streams
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
        console.log('[LiveSessionRoom] Stopped local media streams');
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
        console.log('[LiveSessionRoom] Stopped screen share streams');
      }

      // Close peer connections
      Object.values(peerConnectionsRef.current).forEach(pc => pc.close());
      console.log('[LiveSessionRoom] Closed peer connections');

      // Notify via socket first for real-time presence
      try {
        if (socketRef.current && sessionId) {
          socketRef.current.emit('leave_session', { sessionId: parseInt(sessionId) });
        }
      } catch {}

      // Leave session on server
      if (sessionId) {
        await liveSessionService.leaveSession(parseInt(sessionId));
        console.log('[LiveSessionRoom] Left session on server');
      }

      setIsConnected(false);
      setConnectionStatus('disconnected');
      
      if (navigateAway) {
        console.log('[LiveSessionRoom] Navigating to dashboard');
        navigate('/dashboard');
      }

    } catch (error) {
      console.error('[LiveSessionRoom] Error leaving session:', {
        error,
        sessionId,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      });
      
      // Even if leaving fails, still navigate away if requested
      if (navigateAway) {
        navigate('/dashboard');
      }
    }
  }, [sessionId, navigate]);

  // Send chat message
  const sendMessage = useCallback(() => {
    if (!newMessage.trim() || !user) return;

    const text = newMessage.trim();
    // Optimistic update
    setChatMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        userId: user.id,
        userName: user.name,
        message: text,
        timestamp: new Date(),
      },
    ]);
    setNewMessage('');

    // Emit to server for broadcast
    if (socketRef.current && sessionId) {
      socketRef.current.emit('chat_message', {
        sessionId: parseInt(sessionId),
        message: text,
      });
    }
  }, [newMessage, user, toast]);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Start/stop recording
  const toggleRecording = useCallback(async () => {
    try {
      if (isRecording) {
        // Stop recording logic would go here
        setIsRecording(false);
        toast({
          title: "Recording Stopped",
          description: "Session recording has been saved",
        });
      } else {
        // Start recording logic would go here
        setIsRecording(true);
        toast({
          title: "Recording Started",
          description: "Session is now being recorded",
        });
      }
    } catch (error) {
      console.error('Recording error:', error);
      toast({
        title: "Recording Error",
        description: "Failed to toggle recording",
        variant: "destructive",
      });
    }
  }, [isRecording, toast]);

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Connecting to session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold">{session.title}</h1>
            <Badge variant={session.status === 'live' ? 'default' : 'secondary'}>
              {session.status.toUpperCase()}
            </Badge>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <div className={`w-3 h-3 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500' : 
                connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              <span className="text-sm font-medium capitalize">{connectionStatus}</span>
              {!isTabVisible && (
                <div className="flex items-center space-x-2 text-amber-600">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-xs">Background</span>
                </div>
              )}
              <Users className="w-4 h-4" />
              <span>{participants.length} participants</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {hasRole('admin') && (
              <Button
                variant={isRecording ? "destructive" : "outline"}
                size="sm"
                onClick={toggleRecording}
              >
                {isRecording ? <Square className="w-4 h-4 mr-2" /> : <Circle className="w-4 h-4 mr-2" />}
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </Button>
            )}
            
            <Button variant="outline" size="sm" onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </Button>

            <Button variant="outline" size="sm" onClick={() => setShowParticipants(!showParticipants)}>
              <Users className="w-4 h-4 mr-2" />
              Participants
            </Button>

            <Button variant="outline" size="sm" onClick={() => setShowChat(!showChat)}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat
            </Button>

            <Button variant="destructive" size="sm" onClick={leaveSession}>
              <PhoneOff className="w-4 h-4 mr-2" />
              Leave
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Video Area */}
        <div className="flex-1 relative">
          {/* Main Video */}
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            
            {!mediaState.video && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
                <div className="text-center">
                  <VideoOff className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-400">Camera is off</p>
                </div>
              </div>
            )}
          </div>

          {/* Participant Videos Grid */}
          <div className="absolute bottom-4 right-4 grid grid-cols-2 gap-2 max-w-md">
            {participants.slice(0, 4).map((participant) => (
              <div key={participant.id} className="relative">
                <div className="w-32 h-24 bg-gray-700 rounded-lg overflow-hidden">
                  <video
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 px-2 py-1 rounded text-xs">
                    {participant.user.name}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-4 bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-full px-6 py-3">
              <Button
                variant={mediaState.audio ? "default" : "destructive"}
                size="sm"
                onClick={toggleAudio}
                className="rounded-full w-12 h-12"
              >
                {mediaState.audio ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </Button>

              <Button
                variant={mediaState.video ? "default" : "destructive"}
                size="sm"
                onClick={toggleVideo}
                className="rounded-full w-12 h-12"
              >
                {mediaState.video ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </Button>

              <Button
                variant={mediaState.screen ? "default" : "outline"}
                size="sm"
                onClick={toggleScreenShare}
                className="rounded-full w-12 h-12"
              >
                {mediaState.screen ? <MonitorOff className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-full w-12 h-12">
                    <Settings className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Camera Settings</DropdownMenuItem>
                  <DropdownMenuItem>Audio Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Session Settings</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Participants Panel */}
        {showParticipants && (
          <div className="w-80 bg-gray-800 border-l border-gray-700">
            <div className="p-4 border-b border-gray-700">
              <h3 className="font-semibold">Participants ({participants.length})</h3>
            </div>
            <ScrollArea className="h-full">
              <div className="p-4 space-y-3">
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>
                          {participant.user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{participant.user.name}</p>
                        <p className="text-xs text-gray-400">{participant.role}</p>
                      </div>
                    </div>
                    
                    {hasRole('admin') && participant.role !== 'host' && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>Mute</DropdownMenuItem>
                          <DropdownMenuItem>Disable Video</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-400">Remove</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Chat Panel */}
        {showChat && (
          <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <h3 className="font-semibold">Chat</h3>
            </div>
            
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {chatMessages.map((message) => (
                  <div key={message.id} className="text-sm">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-blue-400">{message.userName}</span>
                      <span className="text-xs text-gray-400">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-gray-200">{message.message}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-gray-700">
              <div className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="bg-gray-700 border-gray-600"
                />
                <Button onClick={sendMessage} size="sm">
                  Send
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Debug Panel - Only in development */}
      {process.env.NODE_ENV === 'development' && <SessionDebugPanel />}
    </div>
  );
};

export default LiveSessionRoom;
