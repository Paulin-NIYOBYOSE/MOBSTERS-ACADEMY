import React, { useState, useEffect } from 'react';
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
  Users,
  Clock,
  Calendar,
  Settings,
  AlertCircle,
  CheckCircle,
  Loader2,
  Monitor,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import liveSessionService, { LiveSessionData, JoinSessionResponse } from '@/services/liveSessionService';
import LiveSession from './LiveSession';

interface DeviceTest {
  camera: boolean;
  microphone: boolean;
  speakers: boolean;
}

export const SessionJoin: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // State
  const [session, setSession] = useState<LiveSessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [deviceTest, setDeviceTest] = useState<DeviceTest>({
    camera: false,
    microphone: false,
    speakers: false,
  });
  const [previewStream, setPreviewStream] = useState<MediaStream | null>(null);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  // Refs
  const videoPreviewRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (sessionId) {
      loadSession();
      testDevices();
      initializePreview();
    }

    return () => {
      if (previewStream) {
        previewStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [sessionId]);

  const loadSession = async () => {
    try {
      setLoading(true);
      const sessionData = await liveSessionService.getSession(parseInt(sessionId!));
      setSession(sessionData);

      // Check if session is accessible
      if (sessionData.status === 'ended' || sessionData.status === 'cancelled') {
        toast({
          title: "Session Unavailable",
          description: "This session has ended or been cancelled",
          variant: "destructive",
        });
        navigate('/dashboard');
        return;
      }

      // Check if user has access
      if (!hasSessionAccess(sessionData)) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to join this session",
          variant: "destructive",
        });
        navigate('/dashboard');
        return;
      }

    } catch (error) {
      console.error('Failed to load session:', error);
      toast({
        title: "Error",
        description: "Failed to load session details",
        variant: "destructive",
      });
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const testDevices = async () => {
    try {
      const permissions = await liveSessionService.checkMediaPermissions();
      setDeviceTest({
        ...permissions,
        speakers: permissions.screen // Use screen as fallback for speakers
      });
    } catch (error) {
      console.error('Device test failed:', error);
    }
  };

  const initializePreview = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      setPreviewStream(stream);
      
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
      }

      // Update device test results
      setDeviceTest(prev => ({
        ...prev,
        camera: stream.getVideoTracks().length > 0,
        microphone: stream.getAudioTracks().length > 0,
      }));

    } catch (error) {
      console.error('Failed to initialize preview:', error);
      toast({
        title: "Media Access Error",
        description: "Please allow camera and microphone access",
        variant: "destructive",
      });
    }
  };

  const hasSessionAccess = (sessionData: LiveSessionData): boolean => {
    if (!user) return false;
    
    // Admin can always join
    if (user.roles?.includes('admin')) return true;
    
    // Check role access
    return sessionData.roleAccess.some(role => user.roles?.includes(role));
  };

  const handleJoinSession = async () => {
    if (!session || !user) return;

    try {
      setJoining(true);

      // Join session via API
      const joinResponse: JoinSessionResponse = await liveSessionService.joinSession(session.id);
      
      toast({
        title: "Joining Session",
        description: "Connecting to the live session...",
      });

      setHasJoined(true);

    } catch (error) {
      console.error('Failed to join session:', error);
      toast({
        title: "Join Failed",
        description: "Failed to join the session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setJoining(false);
    }
  };

  const toggleVideo = () => {
    if (previewStream) {
      const videoTrack = previewStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn;
        setIsVideoOn(!isVideoOn);
      }
    }
  };

  const toggleMute = () => {
    if (previewStream) {
      const audioTrack = previewStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = isMuted;
        setIsMuted(!isMuted);
      }
    }
  };

  const handleLeaveSession = () => {
    if (previewStream) {
      previewStream.getTracks().forEach(track => track.stop());
    }
    setHasJoined(false);
    navigate('/dashboard');
  };

  const formatSessionTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const getSessionStatus = () => {
    if (!session) return null;

    const now = new Date();
    const sessionTime = new Date(session.scheduledTime);
    const timeDiff = sessionTime.getTime() - now.getTime();

    if (session.status === 'live') {
      return { type: 'live', message: 'Session is live now' };
    } else if (timeDiff > 0) {
      const minutes = Math.floor(timeDiff / (1000 * 60));
      if (minutes < 60) {
        return { type: 'upcoming', message: `Starting in ${minutes} minutes` };
      } else {
        const hours = Math.floor(minutes / 60);
        return { type: 'upcoming', message: `Starting in ${hours} hours` };
      }
    } else {
      return { type: 'ended', message: 'Session has ended' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading session...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Session Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The session you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (hasJoined) {
    return (
      <LiveSession
        sessionId={sessionId!}
        sessionTitle={session.title}
        isHost={session.hostId === user?.id}
        onLeave={handleLeaveSession}
      />
    );
  }

  const sessionStatus = getSessionStatus();
  const { date, time } = formatSessionTime(session.scheduledTime);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Session Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Video className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{session.title}</CardTitle>
                    {sessionStatus && (
                      <Badge 
                        variant={sessionStatus.type === 'live' ? 'default' : 'secondary'}
                        className={sessionStatus.type === 'live' ? 'bg-green-600' : ''}
                      >
                        {sessionStatus.message}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{session.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>Max {session.maxParticipants || 50} participants</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-muted-foreground" />
                    <span>{session.duration || 60} minutes</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Device Check */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Device Check</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    <span>Camera</span>
                  </div>
                  {deviceTest.camera ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4" />
                    <span>Microphone</span>
                  </div>
                  {deviceTest.microphone ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4" />
                    <span>Screen Sharing</span>
                  </div>
                  {deviceTest.speakers ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Video Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Video Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                  {isVideoOn ? (
                    <video
                      ref={videoPreviewRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center text-white">
                        <VideoOff className="w-12 h-12 mx-auto mb-2" />
                        <p>Camera is off</p>
                      </div>
                    </div>
                  )}
                  
                  {/* User Info Overlay */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/50 rounded-lg px-3 py-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs">
                        {user?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-white text-sm">{user?.name} (You)</span>
                    {isMuted && <MicOff className="w-4 h-4 text-red-400" />}
                  </div>
                </div>
                
                {/* Preview Controls */}
                <div className="flex justify-center gap-2 mt-4">
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
                </div>
              </CardContent>
            </Card>

            {/* Join Button */}
            <Card>
              <CardContent className="pt-6">
                {session.status === 'live' || sessionStatus?.type === 'upcoming' ? (
                  <Button
                    onClick={handleJoinSession}
                    disabled={joining || !deviceTest.camera || !deviceTest.microphone}
                    className="w-full"
                    size="lg"
                  >
                    {joining ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Joining...
                      </>
                    ) : (
                      <>
                        <Video className="w-4 h-4 mr-2" />
                        Join Session
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">
                      This session is not currently available
                    </p>
                    <Button variant="outline" onClick={() => navigate('/dashboard')}>
                      Back to Dashboard
                    </Button>
                  </div>
                )}
                
                {(!deviceTest.camera || !deviceTest.microphone) && (
                  <p className="text-sm text-red-600 mt-2 text-center">
                    Please allow camera and microphone access to join
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionJoin;
