import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  Video,
  Settings,
  Plus,
  Edit,
  Trash2,
  Copy,
  Play,
  Pause,
  Square,
  MoreVertical,
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import liveSessionService, { LiveSessionData, CreateSessionRequest } from '@/services/liveSessionService';

interface SessionSchedulerProps {
  onSessionCreated?: (session: LiveSessionData) => void;
  onSessionUpdated?: (session: LiveSessionData) => void;
  onSessionDeleted?: (sessionId: number) => void;
}

export const SessionScheduler: React.FC<SessionSchedulerProps> = ({
  onSessionCreated,
  onSessionUpdated,
  onSessionDeleted,
}) => {
  const { user, hasRole } = useAuth();
  const { toast } = useToast();

  // State
  const [sessions, setSessions] = useState<LiveSessionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<LiveSessionData | null>(null);

  // Form state
  const [formData, setFormData] = useState<CreateSessionRequest>({
    title: '',
    description: '',
    scheduledTime: '',
    duration: 60,
    maxParticipants: 50,
    roleAccess: ['academy_student'],
    autoRecord: false,
  });

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await liveSessionService.getSessions();
      setSessions(data);
    } catch (error) {
      console.error('Failed to load sessions:', error);
      toast({
        title: "Error",
        description: "Failed to load sessions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async () => {
    try {
      if (!selectedDate || !selectedTime) {
        toast({
          title: "Validation Error",
          description: "Please select date and time",
          variant: "destructive",
        });
        return;
      }

      const scheduledDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':');
      scheduledDateTime.setHours(parseInt(hours), parseInt(minutes));

      const sessionData: CreateSessionRequest = {
        ...formData,
        scheduledTime: scheduledDateTime.toISOString(),
      };

      const newSession = await liveSessionService.createSession(sessionData);
      setSessions(prev => [...prev, newSession]);
      
      toast({
        title: "Success",
        description: "Session scheduled successfully",
      });

      setIsCreateDialogOpen(false);
      resetForm();
      onSessionCreated?.(newSession);

    } catch (error) {
      console.error('Failed to create session:', error);
      toast({
        title: "Error",
        description: "Failed to schedule session",
        variant: "destructive",
      });
    }
  };

  const handleUpdateSession = async () => {
    if (!editingSession) return;

    try {
      const scheduledDateTime = selectedDate ? new Date(selectedDate) : (safeParseDate(editingSession.date) || new Date());
      if (selectedTime) {
        const [hours, minutes] = selectedTime.split(':');
        scheduledDateTime.setHours(parseInt(hours), parseInt(minutes));
      }

      const updatedSession = await liveSessionService.updateSession(editingSession.id, {
        ...formData,
        scheduledTime: scheduledDateTime.toISOString(),
      });

      setSessions(prev => prev.map(s => s.id === editingSession.id ? updatedSession : s));
      
      toast({
        title: "Success",
        description: "Session updated successfully",
      });

      setEditingSession(null);
      resetForm();
      onSessionUpdated?.(updatedSession);

    } catch (error) {
      console.error('Failed to update session:', error);
      toast({
        title: "Error",
        description: "Failed to update session",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSession = async (sessionId: number) => {
    try {
      await liveSessionService.deleteSession(sessionId);
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      
      toast({
        title: "Success",
        description: "Session deleted successfully",
      });

      onSessionDeleted?.(sessionId);

    } catch (error) {
      console.error('Failed to delete session:', error);
      toast({
        title: "Error",
        description: "Failed to delete session",
        variant: "destructive",
      });
    }
  };

  const handleStartSession = async (sessionId: number) => {
    try {
      const updatedSession = await liveSessionService.startSession(sessionId);
      setSessions(prev => prev.map(s => s.id === sessionId ? updatedSession : s));
      
      toast({
        title: "Session Started",
        description: "Live session is now active",
      });

      // Navigate to session
      window.open(`/session/${sessionId}`, '_blank');

    } catch (error) {
      console.error('Failed to start session:', error);
      toast({
        title: "Error",
        description: "Failed to start session",
        variant: "destructive",
      });
    }
  };

  const handleEndSession = async (sessionId: number) => {
    try {
      const updatedSession = await liveSessionService.endSession(sessionId);
      setSessions(prev => prev.map(s => s.id === sessionId ? updatedSession : s));
      
      toast({
        title: "Session Ended",
        description: "Live session has been ended",
      });

    } catch (error) {
      console.error('Failed to end session:', error);
      toast({
        title: "Error",
        description: "Failed to end session",
        variant: "destructive",
      });
    }
  };

  const copySessionLink = (sessionId: number) => {
    const link = liveSessionService.generateSessionUrl(sessionId);
    navigator.clipboard.writeText(link);
    toast({
      title: "Link Copied",
      description: "Session link copied to clipboard",
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      scheduledTime: '',
      duration: 60,
      maxParticipants: 50,
      roleAccess: ['academy_student'],
      autoRecord: false,
    });
    setSelectedDate(undefined);
    setSelectedTime('');
  };

  const openEditDialog = (session: LiveSessionData) => {
    setEditingSession(session);
    setFormData({
      title: session.title,
      description: session.description,
      scheduledTime: session.date,
      duration: session.duration || 60,
      maxParticipants: session.maxParticipants || 50,
      roleAccess: session.roleAccess,
      autoRecord: false,
    });

    const sessionDate = safeParseDate(session.date);
    if (sessionDate) {
      setSelectedDate(sessionDate);
      try {
        setSelectedTime(format(sessionDate, 'HH:mm'));
      } catch (error) {
        console.warn('Error formatting time for editing:', session.date);
        setSelectedTime('');
      }
    }
  };

  const safeParseDate = (dateValue: any): Date | null => {
    if (!dateValue) return null;
    
    // Handle different types of date values
    let dateString: string;
    if (typeof dateValue === 'string') {
      dateString = dateValue;
    } else if (typeof dateValue === 'number') {
      dateString = new Date(dateValue).toISOString();
    } else if (dateValue instanceof Date) {
      return isNaN(dateValue.getTime()) ? null : dateValue;
    } else {
      console.warn('Unexpected date value type:', typeof dateValue, dateValue);
      return null;
    }
    
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? null : date;
    } catch (error) {
      console.warn('Invalid date string:', dateString, error);
      return null;
    }
  };

  const formatSessionDate = (dateValue: any): string => {
    const date = safeParseDate(dateValue);
    if (!date) return 'No date set';
    try {
      return format(date, 'PPP p');
    } catch (error) {
      console.error('Error formatting date:', dateValue, error);
      return 'Invalid date';
    }
  };

  const getStatusBadge = (status: LiveSessionData['status']) => {
    const variants = {
      scheduled: 'secondary',
      live: 'default',
      ended: 'outline',
      cancelled: 'destructive',
    } as const;

    const colors = {
      scheduled: 'bg-blue-100 text-blue-800',
      live: 'bg-green-100 text-green-800',
      ended: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };

    return (
      <Badge variant={variants[status]} className={colors[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return [`${hour}:00`, `${hour}:30`];
  }).flat();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Live Sessions</h2>
          <p className="text-muted-foreground">Schedule and manage live trading sessions</p>
        </div>
        
        {hasRole('admin') && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Schedule Session
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Schedule New Session</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Session Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Advanced Trading Strategies"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                      min="15"
                      max="480"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Session description and agenda..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {selectedDate ? format(selectedDate, 'PPP') : 'Select date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxParticipants">Max Participants</Label>
                    <Input
                      id="maxParticipants"
                      type="number"
                      value={formData.maxParticipants}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) }))}
                      min="1"
                      max="500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Access Level</Label>
                    <Select
                      value={formData.roleAccess[0]}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, roleAccess: [value] }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="academy_student">Academy Students</SelectItem>
                        <SelectItem value="mentorship_student">Mentorship Students</SelectItem>
                        <SelectItem value="community_student">All Students</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="autoRecord"
                    checked={formData.autoRecord}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, autoRecord: !!checked }))}
                  />
                  <Label htmlFor="autoRecord">Auto-record session</Label>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateSession}>
                    Schedule Session
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Sessions List */}
      <div className="grid gap-4">
        {sessions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Sessions Scheduled
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Schedule your first live trading session to get started.
              </p>
              {hasRole('admin') && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Session
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          sessions.map((session) => {
            try {
              return (
            <Card key={session.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <Video className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{session.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {formatSessionDate(session.date)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getStatusBadge(session.status)}
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {session.status === 'scheduled' && (
                          <DropdownMenuItem onClick={() => handleStartSession(session.id)}>
                            <Play className="w-4 h-4 mr-2" />
                            Start Session
                          </DropdownMenuItem>
                        )}
                        
                        {session.status === 'live' && (
                          <DropdownMenuItem onClick={() => handleEndSession(session.id)}>
                            <Square className="w-4 h-4 mr-2" />
                            End Session
                          </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuItem onClick={() => copySessionLink(session.id)}>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Link
                        </DropdownMenuItem>
                        
                        {hasRole('admin') && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => openEditDialog(session)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteSession(session.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {session.description}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {session.duration || 60} minutes
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    Max {session.maxParticipants || 50} participants
                  </div>
                  <div className="flex items-center gap-1">
                    <Settings className="w-4 h-4" />
                    {session.roleAccess.join(', ')}
                  </div>
                </div>
                
                {session.status === 'live' && (
                  <div className="mt-4">
                    <Button 
                      onClick={() => window.open(`/session/${session.id}`, '_blank')}
                      className="w-full"
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Join Live Session
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
              );
            } catch (error) {
              console.error('Error rendering session:', session.id, error);
              return (
                <Card key={session.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <p className="text-red-500">Error loading session: {session.title || 'Unknown'}</p>
                  </CardContent>
                </Card>
              );
            }
          })
        )}
      </div>

      {/* Edit Dialog */}
      {editingSession && (
        <Dialog open={!!editingSession} onOpenChange={() => setEditingSession(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Session</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Same form fields as create dialog */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Session Title</Label>
                  <Input
                    id="edit-title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-duration">Duration (minutes)</Label>
                  <Input
                    id="edit-duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setEditingSession(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateSession}>
                  Update Session
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default SessionScheduler;
