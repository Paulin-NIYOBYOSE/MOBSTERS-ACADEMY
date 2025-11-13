import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Video, 
  Clock, 
  Users, 
  Calendar,
  Play,
  AlertCircle,
} from 'lucide-react';
import { LiveSessionData } from '@/services/liveSessionService';
import { format } from 'date-fns';

interface LiveSessionCardProps {
  session: LiveSessionData;
  onJoinSession: (sessionId: number) => void;
  isJoining?: boolean;
}

export const LiveSessionCard: React.FC<LiveSessionCardProps> = ({
  session,
  onJoinSession,
  isJoining = false,
}) => {
  const safeParseDate = (dateString: string | null | undefined): Date | null => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? null : date;
    } catch (error) {
      return null;
    }
  };

  const formatSessionDate = (dateString: string | null | undefined): string => {
    const date = safeParseDate(dateString);
    if (!date) return 'No date set';
    try {
      return format(date, 'MMM dd, yyyy • h:mm a');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getStatusBadge = (status: LiveSessionData['status']) => {
    const variants = {
      scheduled: 'secondary',
      live: 'destructive',
      ended: 'outline',
      cancelled: 'outline',
    } as const;

    const colors = {
      scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      live: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 animate-pulse',
      ended: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
      cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    };

    return (
      <Badge variant={variants[status]} className={colors[status]}>
        {status === 'live' && <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse" />}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const isLive = session.status === 'live';
  const isScheduled = session.status === 'scheduled';
  const canJoin = isLive || isScheduled;

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isLive ? 'bg-red-100 dark:bg-red-900' : 'bg-blue-100 dark:bg-blue-900'}`}>
              <Video className={`w-5 h-5 ${isLive ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`} />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">{session.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {session.description}
              </p>
            </div>
          </div>
          {getStatusBadge(session.status)}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Session Details */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatSessionDate(session.date)}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {session.duration || 60} min
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              Max {session.maxParticipants || 50}
            </div>
          </div>

          {/* Host Information */}
          {session.user && (
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Host:</span> {session.user.name}
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            {isLive && (
              <Button 
                onClick={() => onJoinSession(session.id)}
                disabled={isJoining}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                <Play className="w-4 h-4 mr-2" />
                {isJoining ? 'Joining...' : 'Join Live Session'}
              </Button>
            )}
            
            {isScheduled && (
              <Button 
                onClick={() => onJoinSession(session.id)}
                disabled={isJoining}
                variant="outline"
                className="w-full"
              >
                <Video className="w-4 h-4 mr-2" />
                {isJoining ? 'Joining...' : 'Join Session'}
              </Button>
            )}

            {!canJoin && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="w-4 h-4" />
                Session is {session.status}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveSessionCard;
