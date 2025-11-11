import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  MonitorOff,
  Phone,
  PhoneOff,
  Users,
  MessageCircle,
  Settings,
  MoreVertical,
  Send,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Copy,
  UserPlus,
  Hand,
  HandMetal,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';

interface Participant {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isMuted: boolean;
  isVideoOn: boolean;
  isHandRaised: boolean;
  isHost: boolean;
  joinedAt: Date;
}

interface ChatMessage {
  id: string;
  participantId: string;
  participantName: string;
  message: string;
  timestamp: Date;
  type: 'message' | 'system';
}

interface LiveSessionProps {
  sessionId: string;
  sessionTitle: string;
  isHost?: boolean;
  onLeave: () => void;
}

export const LiveSession: React.FC<LiveSessionProps> = ({
  sessionId,
  sessionTitle,
  isHost = false,
  onLeave,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Media states
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);

  // UI states
  const [showParticipants, setShowParticipants] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  // Session data
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  // Refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideosRef = useRef<{ [key: string]: HTMLVideoElement }>({});
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionsRef = useRef<{ [key: string]: RTCPeerConnection }>({});
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // WebSocket for signaling
  const wsRef = useRef<WebSocket | null>(null);

  // Initialize session
  useEffect(() => {
    initializeSession();
    return () => {
      cleanup();
    };
  }, [sessionId]);

  // Session timer
  useEffect(() => {
    if (isConnected) {
      const timer = setInterval(() => {
        setSessionDuration(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isConnected]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const initializeSession = async () => {
    try {
      // Initialize WebSocket connection
      const wsUrl = `ws://localhost:8081/session/${sessionId}`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        setIsConnected(true);
        toast({
          title: "Connected",
          description: "Successfully joined the live session",
        });
      };

      wsRef.current.onmessage = handleWebSocketMessage;
      wsRef.current.onclose = () => setIsConnected(false);
      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast({
          title: "Connection Error",
          description: "Failed to connect to the session",
          variant: "destructive",
        });
      };

      // Get user media
      await initializeMedia();

    } catch (error) {
      console.error('Failed to initialize session:', error);
      toast({
        title: "Initialization Error",
        description: "Failed to initialize the session",
        variant: "destructive",
      });
    }
  };

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: { echoCancellation: true, noiseSuppression: true }
      });

      localStreamRef.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Add current user as participant
      const currentParticipant: Participant = {
        id: user?.id?.toString() || 'local',
        name: user?.name || 'You',
        email: user?.email || '',
        avatar: undefined, // User avatar not available in current User type
        isMuted: false,
        isVideoOn: true,
        isHandRaised: false,
        isHost,
        joinedAt: new Date(),
      };

      setParticipants([currentParticipant]);

    } catch (error) {
      console.error('Failed to get user media:', error);
      toast({
        title: "Media Error",
        description: "Failed to access camera/microphone",
        variant: "destructive",
      });
    }
  };

  const handleWebSocketMessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data);
    
    switch (data.type) {
      case 'participant-joined':
        handleParticipantJoined(data.participant);
        break;
      case 'participant-left':
        handleParticipantLeft(data.participantId);
        break;
      case 'chat-message':
        handleChatMessage(data.message);
        break;
      case 'hand-raised':
        handleHandRaised(data.participantId, data.isRaised);
        break;
      case 'media-state-changed':
        handleMediaStateChanged(data.participantId, data.state);
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  };

  const handleParticipantJoined = (participant: Participant) => {
    setParticipants(prev => [...prev, participant]);
    addChatMessage({
      id: Date.now().toString(),
      participantId: 'system',
      participantName: 'System',
      message: `${participant.name} joined the session`,
      timestamp: new Date(),
      type: 'system',
    });
  };

  const handleParticipantLeft = (participantId: string) => {
    setParticipants(prev => {
      const participant = prev.find(p => p.id === participantId);
      if (participant) {
        addChatMessage({
          id: Date.now().toString(),
          participantId: 'system',
          participantName: 'System',
          message: `${participant.name} left the session`,
          timestamp: new Date(),
          type: 'system',
        });
      }
      return prev.filter(p => p.id !== participantId);
    });
  };

  const handleChatMessage = (message: ChatMessage) => {
    setChatMessages(prev => [...prev, message]);
  };

  const handleHandRaised = (participantId: string, isRaised: boolean) => {
    setParticipants(prev => 
      prev.map(p => 
        p.id === participantId ? { ...p, isHandRaised: isRaised } : p
      )
    );
  };

  const handleMediaStateChanged = (participantId: string, state: { isMuted?: boolean; isVideoOn?: boolean }) => {
    setParticipants(prev => 
      prev.map(p => 
        p.id === participantId ? { ...p, ...state } : p
      )
    );
  };

  const addChatMessage = (message: ChatMessage) => {
    setChatMessages(prev => [...prev, message]);
  };

  const toggleMute = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = isMuted;
        setIsMuted(!isMuted);
        
        // Broadcast state change
        if (wsRef.current) {
          wsRef.current.send(JSON.stringify({
            type: 'media-state-changed',
            participantId: user?.id?.toString(),
            state: { isMuted: !isMuted }
          }));
        }
      }
    }
  }, [isMuted, user?.id]);

  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn;
        setIsVideoOn(!isVideoOn);
        
        // Broadcast state change
        if (wsRef.current) {
          wsRef.current.send(JSON.stringify({
            type: 'media-state-changed',
            participantId: user?.id?.toString(),
            state: { isVideoOn: !isVideoOn }
          }));
        }
      }
    }
  }, [isVideoOn, user?.id]);

  const toggleScreenShare = useCallback(async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        
        // Replace video track with screen share
        if (localStreamRef.current) {
          const videoTrack = screenStream.getVideoTracks()[0];
          const sender = Object.values(peerConnectionsRef.current)[0]?.getSenders().find(
            s => s.track?.kind === 'video'
          );
          
          if (sender) {
            await sender.replaceTrack(videoTrack);
          }
        }
        
        setIsScreenSharing(true);
        
        screenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          // Switch back to camera
          initializeMedia();
        };
        
      } else {
        // Stop screen sharing and switch back to camera
        await initializeMedia();
        setIsScreenSharing(false);
      }
    } catch (error) {
      console.error('Screen sharing error:', error);
      toast({
        title: "Screen Share Error",
        description: "Failed to start screen sharing",
        variant: "destructive",
      });
    }
  }, [isScreenSharing]);

  const toggleHandRaise = useCallback(() => {
    const newState = !isHandRaised;
    setIsHandRaised(newState);
    
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({
        type: 'hand-raised',
        participantId: user?.id?.toString(),
        isRaised: newState
      }));
    }
  }, [isHandRaised, user?.id]);

  const sendChatMessage = useCallback(() => {
    if (chatMessage.trim() && wsRef.current) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        participantId: user?.id?.toString() || 'local',
        participantName: user?.name || 'You',
        message: chatMessage.trim(),
        timestamp: new Date(),
        type: 'message',
      };

      wsRef.current.send(JSON.stringify({
        type: 'chat-message',
        message
      }));

      setChatMessage('');
    }
  }, [chatMessage, user]);

  const leaveSession = useCallback(() => {
    cleanup();
    onLeave();
  }, [onLeave]);

  const cleanup = () => {
    // Close WebSocket
    if (wsRef.current) {
      wsRef.current.close();
    }

    // Stop local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }

    // Close peer connections
    Object.values(peerConnectionsRef.current).forEach(pc => pc.close());
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const copySessionLink = () => {
    const link = `${window.location.origin}/session/${sessionId}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link Copied",
      description: "Session link copied to clipboard",
    });
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 p-4 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">{sessionTitle}</h1>
          <Badge variant="secondary" className="bg-green-600">
            {isConnected ? 'Connected' : 'Connecting...'}
          </Badge>
          <span className="text-sm text-gray-400">
            {formatDuration(sessionDuration)}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowParticipants(!showParticipants)}
          >
            <Users className="w-4 h-4 mr-2" />
            {participants.length}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={copySessionLink}>
                <Copy className="w-4 h-4 mr-2" />
                Copy Session Link
              </DropdownMenuItem>
              <DropdownMenuItem>
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Participants
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Area */}
        <div className="flex-1 relative">
          {/* Main Video */}
          <div className="h-full bg-gray-800 flex items-center justify-center">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            
            {/* Video Controls Overlay */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-black/50 rounded-lg p-2">
              <Button
                variant={isMuted ? "destructive" : "secondary"}
                size="sm"
                onClick={toggleMute}
              >
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
              
              <Button
                variant={!isVideoOn ? "destructive" : "secondary"}
                size="sm"
                onClick={toggleVideo}
              >
                {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </Button>
              
              <Button
                variant={isScreenSharing ? "default" : "secondary"}
                size="sm"
                onClick={toggleScreenShare}
              >
                {isScreenSharing ? <MonitorOff className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
              </Button>
              
              <Button
                variant={isHandRaised ? "default" : "secondary"}
                size="sm"
                onClick={toggleHandRaise}
              >
                {isHandRaised ? <HandMetal className="w-4 h-4" /> : <Hand className="w-4 h-4" />}
              </Button>
              
              <Separator orientation="vertical" className="h-6" />
              
              <Button
                variant="destructive"
                size="sm"
                onClick={leaveSession}
              >
                <PhoneOff className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          {/* Participants Panel */}
          {showParticipants && (
            <div className="flex-1 border-b border-gray-700">
              <div className="p-4 border-b border-gray-700">
                <h3 className="font-semibold flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Participants ({participants.length})
                </h3>
              </div>
              
              <ScrollArea className="h-48">
                <div className="p-2 space-y-2">
                  {participants.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700"
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={participant.avatar} />
                        <AvatarFallback>
                          {participant.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {participant.name}
                          {participant.isHost && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              Host
                            </Badge>
                          )}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {participant.isHandRaised && (
                          <Hand className="w-4 h-4 text-yellow-400" />
                        )}
                        {participant.isMuted ? (
                          <MicOff className="w-4 h-4 text-red-400" />
                        ) : (
                          <Mic className="w-4 h-4 text-green-400" />
                        )}
                        {participant.isVideoOn ? (
                          <Video className="w-4 h-4 text-green-400" />
                        ) : (
                          <VideoOff className="w-4 h-4 text-red-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Chat Panel */}
          {showChat && (
            <div className="flex-1 flex flex-col">
              <div className="p-4 border-b border-gray-700">
                <h3 className="font-semibold flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Chat
                </h3>
              </div>
              
              <ScrollArea className="flex-1 p-2" ref={chatScrollRef}>
                <div className="space-y-2">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-2 rounded-lg ${
                        message.type === 'system'
                          ? 'bg-gray-700 text-gray-300 text-center text-sm'
                          : 'bg-gray-700'
                      }`}
                    >
                      {message.type === 'message' ? (
                        <>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">
                              {message.participantName}
                            </span>
                            <span className="text-xs text-gray-400">
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm">{message.message}</p>
                        </>
                      ) : (
                        <p className="text-sm">{message.message}</p>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t border-gray-700">
                <div className="flex gap-2">
                  <Input
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Type a message..."
                    onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                    className="bg-gray-700 border-gray-600"
                  />
                  <Button size="sm" onClick={sendChatMessage}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveSession;
