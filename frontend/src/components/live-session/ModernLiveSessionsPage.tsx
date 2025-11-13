import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Users,
  Video,
  Play,
  Search,
  Filter,
  Plus,
  Sparkles,
  TrendingUp,
  Globe,
  Star,
  Eye,
  MessageSquare,
  Share2,
  BookOpen,
  Zap,
  ChevronRight,
  Live,
  Timer,
  UserCheck,
  Settings,
  MoreHorizontal,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import liveSessionService, { LiveSessionData } from '@/services/liveSessionService';

interface SessionStats {
  totalSessions: number;
  liveSessions: number;
  totalParticipants: number;
  avgRating: number;
}

export const ModernLiveSessionsPage: React.FC = () => {
  const { user, hasRole } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [sessions, setSessions] = useState<LiveSessionData[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<LiveSessionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [stats, setStats] = useState<SessionStats>({
    totalSessions: 0,
    liveSessions: 0,
    totalParticipants: 0,
    avgRating: 4.8,
  });

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    filterSessions();
  }, [sessions, searchQuery, activeTab]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await liveSessionService.getUpcomingAndLiveSessions();
      setSessions(data);
      
      // Calculate stats
      const liveSessions = data.filter(s => s.status === 'live').length;
      const totalParticipants = data.reduce((sum, s) => sum + (s._count?.participants || 0), 0);
      
      setStats({
        totalSessions: data.length,
        liveSessions,
        totalParticipants,
        avgRating: 4.8,
      });
    } catch (error) {
      console.error('Failed to load sessions:', error);
      toast({
        title: "Error",
        description: "Failed to load live sessions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterSessions = () => {
    let filtered = sessions;

    // Filter by tab
    if (activeTab === 'live') {
      filtered = filtered.filter(s => s.status === 'live');
    } else if (activeTab === 'upcoming') {
      filtered = filtered.filter(s => s.status === 'scheduled');
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(s =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredSessions(filtered);
  };

  const getSessionStatus = (session: LiveSessionData) => {
    if (session.status === 'live') {
      return { label: 'LIVE', color: 'bg-red-500 text-white', icon: Live };
    }
    
    if (session.status === 'scheduled') {
      const now = new Date();
      const sessionTime = new Date(session.date);
      const timeDiff = sessionTime.getTime() - now.getTime();
      const minutesUntil = Math.floor(timeDiff / (1000 * 60));
      
      if (minutesUntil <= 15 && minutesUntil > 0) {
        return { label: 'Starting Soon', color: 'bg-orange-500 text-white', icon: Timer };
      } else if (minutesUntil > 0) {
        return { label: 'Scheduled', color: 'bg-blue-500 text-white', icon: Calendar };
      }
    }
    
    return { label: 'Ended', color: 'bg-gray-500 text-white', icon: Clock };
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
      }),
    };
  };

  const joinSession = (sessionId: number) => {
    navigate(`/session/${sessionId}`);
  };

  const createNewSession = () => {
    // Navigate to session creation page or open modal
    toast({
      title: "Coming Soon",
      description: "Session creation interface will be available soon",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-600 dark:text-slate-400">Loading live sessions...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Live Trading Sessions
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
                Join expert-led sessions and learn from the best traders
              </p>
            </div>
            
            {hasRole('admin') && (
              <Button 
                onClick={createNewSession}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                size="lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Session
              </Button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Sessions</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalSessions}</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Live Now</p>
                  <p className="text-3xl font-bold text-red-600">{stats.liveSessions}</p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <Live className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Participants</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalParticipants}</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Avg Rating</p>
                  <div className="flex items-center space-x-1">
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.avgRating}</p>
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  </div>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                  <TrendingUp className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="mb-8 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    placeholder="Search sessions by title or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
                  />
                </div>
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                <TabsList className="bg-slate-100 dark:bg-slate-700">
                  <TabsTrigger value="all" className="px-6">All Sessions</TabsTrigger>
                  <TabsTrigger value="live" className="px-6">Live</TabsTrigger>
                  <TabsTrigger value="upcoming" className="px-6">Upcoming</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Sessions Grid */}
        {filteredSessions.length === 0 ? (
          <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-full">
                  <Video className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">No Sessions Found</h3>
                <p className="text-slate-600 dark:text-slate-400 max-w-md">
                  {searchQuery 
                    ? "No sessions match your search criteria. Try adjusting your search terms."
                    : "There are no live sessions available at the moment. Check back later!"
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredSessions.map((session) => {
              const status = getSessionStatus(session);
              const { date, time } = formatDateTime(session.date);
              const StatusIcon = status.icon;

              return (
                <Card key={session.id} className="group bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={`${status.color} px-3 py-1 text-xs font-semibold`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {status.label}
                          </Badge>
                          {session.status === 'live' && (
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                              <span className="text-xs text-red-600 font-medium">LIVE</span>
                            </div>
                          )}
                        </div>
                        <CardTitle className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                          {session.title}
                        </CardTitle>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Share2 className="w-4 h-4 mr-2" />
                            Share Session
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {hasRole('admin') && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Settings className="w-4 h-4 mr-2" />
                                Manage Session
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2">
                      {session.description}
                    </p>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 text-slate-600 dark:text-slate-400">
                          <Calendar className="w-4 h-4" />
                          <span>{date}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-slate-600 dark:text-slate-400">
                          <Clock className="w-4 h-4" />
                          <span>{time}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs">
                              {session.user?.name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {session.user?.name}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-1 text-slate-600 dark:text-slate-400">
                          <Users className="w-4 h-4" />
                          <span className="text-sm">{session._count?.participants || 0}</span>
                        </div>
                      </div>

                      <Button
                        onClick={() => joinSession(session.id)}
                        className={`${
                          session.status === 'live'
                            ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                            : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                        } text-white shadow-lg group-hover:shadow-xl transition-all duration-300`}
                        size="sm"
                      >
                        {session.status === 'live' ? (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Join Live
                          </>
                        ) : (
                          <>
                            <ChevronRight className="w-4 h-4 mr-2" />
                            View Session
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernLiveSessionsPage;
