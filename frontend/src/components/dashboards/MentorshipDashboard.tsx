import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  TrendingUp,
  Calendar,
  MessageCircle,
  Award,
  Target,
  BarChart3,
  Star,
  Crown,
  Play,
  BookOpen,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  ArrowUpRight,
  Clock,
  Activity,
  Eye,
  PlayCircle,
  DollarSign,
  Zap,
} from "lucide-react";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import { Navigate, useLocation } from "react-router-dom";
import ReactPlayer from "react-player";
import { CourseViewer } from "@/components/CourseViewer";
import TradingJournal from "@/components/trading-journal/TradingJournal";

interface MentorshipContent {
  mentorshipSessions: any[];
  advancedStrategies: any[];
  signals: any[];
  challenges: any[];
  performance: any;
}

export const MentorshipDashboard: React.FC = () => {
  const [content, setContent] = useState<MentorshipContent | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [signals, setSignals] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [expandedCourses, setExpandedCourses] = useState<Set<number>>(new Set());
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [viewingCourse, setViewingCourse] = useState<any | null>(null);
  const { toast } = useToast();
  const location = useLocation();
  const baseUrl = "http://localhost:3000"; // Backend server URL

  useEffect(() => {
    loadMentorshipContent();
    const interval = setInterval(() => {
      loadMentorshipContent();
      setLastRefresh(new Date());
    }, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadMentorshipContent = async () => {
    try {
      const [contentData, coursesData, signalsData, sessionsData] =
        await Promise.all([
          authService.getMentorshipContent(),
          authService.getCourses(),
          authService.getSignals(),
          authService.getLiveSessions(),
        ]);
      
      // Fetch videos for each course
      const coursesWithVideos = await Promise.all(
        coursesData.map(async (course: any) => {
          try {
            const videos = await authService.getCourseVideos(course.id);
            return { ...course, videos: videos || [] };
          } catch (error) {
            console.error(`Failed to load videos for course ${course.id}:`, error);
            return { ...course, videos: [] };
          }
        })
      );
      
      setContent(contentData);
      setCourses(coursesWithVideos);
      setSignals(signalsData);
      setSessions(sessionsData);
    } catch (error) {
      console.error("Failed to load mentorship content:", error);
      toast({
        title: "Error",
        description: "Failed to load mentorship content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleCourseExpansion = (courseId: number) => {
    setExpandedCourses((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(courseId)) {
        newSet.delete(courseId);
      } else {
        newSet.add(courseId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Determine active section from URL and default redirect
  const pathParts = location.pathname.split("/").filter(Boolean);
  const section = pathParts[0] === "dashboard" ? (pathParts[1] || "overview") : pathParts[1];

  // Default redirect
  if (pathParts[0] === "mentorship" && !section) {
    return <Navigate to="/dashboard" replace />;
  }

  // If viewing a course, show the CourseViewer
  if (viewingCourse) {
    return (
      <CourseViewer 
        course={viewingCourse} 
        onBack={() => setViewingCourse(null)} 
      />
    );
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Win Rate */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Win Rate
            </CardTitle>
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Target className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{content?.performance?.winRate || "87%"}</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>+5% this month</span>
            </div>
          </CardContent>
        </Card>

        {/* P&L */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly P&L
            </CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <DollarSign className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{content?.performance?.profitLoss || "+$2,847"}</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>+23% from last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Trades */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Trades
            </CardTitle>
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <BarChart3 className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{content?.performance?.tradesCount || "156"}</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>this month</span>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard Rank */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Leaderboard Rank
            </CardTitle>
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Crown className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{content?.performance?.rankPosition || "#12"}</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>moved up 3 spots</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Next Mentorship Call
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{content?.mentorshipSessions[0]?.title || "Advanced Scalping"}</div>
            <p className="text-xs text-muted-foreground">
              {content?.mentorshipSessions[0]?.date
                ? new Date(content.mentorshipSessions[0].date).toLocaleDateString()
                : "Tomorrow 2:00 PM"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Strategies
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{content?.advancedStrategies?.length || 8}</div>
            <p className="text-xs text-muted-foreground">strategies mastered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Premium Signals
            </CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">24</div>
            <p className="text-xs text-muted-foreground">signals this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Challenge Progress
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">78%</div>
            <p className="text-xs text-muted-foreground">monthly challenge</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Analytics & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Performance Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Trading Performance
            </CardTitle>
            <CardDescription>Your monthly trading statistics and growth</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {content?.performance?.winRate || "87%"}
                </div>
                <p className="text-sm text-muted-foreground">Win Rate</p>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {content?.performance?.profitLoss || "+$2,847"}
                </div>
                <p className="text-sm text-muted-foreground">P&L</p>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {content?.performance?.tradesCount || "156"}
                </div>
                <p className="text-sm text-muted-foreground">Trades</p>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {content?.performance?.rankPosition || "#12"}
                </div>
                <p className="text-sm text-muted-foreground">Leaderboard</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800">Join Live Session</p>
                  <p className="text-xs text-green-600">Advanced Scalping</p>
                </div>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <Users className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-800">New Strategy</p>
                  <p className="text-xs text-purple-600">Fibonacci Retracements</p>
                </div>
                <Button size="sm" variant="outline" className="text-purple-600 border-purple-200">
                  Learn
                </Button>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-800">Premium Signals</p>
                  <p className="text-xs text-blue-600">3 new signals today</p>
                </div>
                <Button size="sm" variant="outline" className="text-blue-600 border-blue-200">
                  View
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderSessions = () => (
    <div className="space-y-4">
      {sessions.length > 0 ? (
        sessions.map((session, index) => (
          <Card key={index} className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-500" />
                {session.title}
              </CardTitle>
              <CardDescription>{session.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Scheduled {new Date(session.date).toLocaleDateString()} at {new Date(session.date).toLocaleTimeString()}
                </p>
                <Button variant="cta">
                  <Users className="w-4 h-4 mr-2" />
                  Join Session
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Live sessions will appear here.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderStrategies = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {content?.advancedStrategies?.length ? (
        content.advancedStrategies.map((strategy, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-purple-500" />
                {strategy.title}
              </CardTitle>
              <CardDescription>{strategy.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Win Rate:</span>
                  <span className="font-medium text-green-500">{strategy.winRate}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Risk Level:</span>
                  <Badge variant={strategy.riskLevel === "Low" ? "secondary" : "outline"}>
                    {strategy.riskLevel}
                  </Badge>
                </div>
                <Button variant="cta" size="sm" className="w-full">
                  Learn Strategy
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card className="col-span-full">
          <CardContent className="text-center py-8">
            <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Advanced strategies will appear here.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderSignals = () => (
    <div className="space-y-4">
      {signals.length ? (
        signals.map((signal, index) => (
          <Card key={index} className="border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{signal.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className={signal.direction === "BUY" ? "bg-green-500" : "bg-red-500"}>
                    {signal.direction}
                  </Badge>
                  <Badge variant="outline">{signal.status}</Badge>
                </div>
              </div>
              <CardDescription>Sent {new Date(signal.createdAt).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Entry: </span>
                  <span className="font-medium">{signal.entry}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Take Profit: </span>
                  <span className="font-medium text-green-500">{signal.takeProfit}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Stop Loss: </span>
                  <span className="font-medium text-red-500">{signal.stopLoss}</span>
                </div>
              </div>
              {signal.content && (
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm">{signal.content}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Premium signals will appear here.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderChallenges = () => (
    <div className="space-y-4">
      {content?.challenges?.length ? (
        content.challenges.map((challenge, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-500" />
                  {challenge.title}
                </CardTitle>
                <Badge variant={challenge.status === "active" ? "default" : "secondary"}>
                  {challenge.status}
                </Badge>
              </div>
              <CardDescription>{challenge.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Progress</span>
                  <span className="text-sm font-medium">{challenge.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full transition-all" style={{ width: `${challenge.progress}%` }}></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Reward: </span>
                    <span className="font-medium text-primary">{challenge.reward}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Ends: </span>
                    <span className="font-medium">{new Date(challenge.endDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Monthly challenges will appear here.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-br from-green-50/50 via-teal-50/30 to-green-50/50 dark:from-slate-900/50 dark:via-slate-800/30 dark:to-slate-900/50 min-h-full relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-green-400/5 rounded-full blur-xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-green-500 via-teal-500 to-green-600 rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0">
                <Crown className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-3 text-gray-900 dark:text-white">
                  Elite{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400">Mentorship</span>
                </h1>
                <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">
                  Advanced trading strategies and personalized guidance for elite traders.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <Button
                className="bg-green-600 hover:bg-green-700 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-white border border-green-600 dark:border-slate-600 backdrop-blur-sm transition-all duration-300 shadow-lg hover:shadow-xl"
                size="sm"
                onClick={() => {
                  loadMentorshipContent();
                  setLastRefresh(new Date());
                }}
                disabled={loading}
              >
                {loading ? "Refreshing..." : "Refresh"}
              </Button>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-green-200/50 dark:border-slate-700/50">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </div>
            </div>
          </div>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-500" />
                Your Performance This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">
                    {content?.performance?.winRate || "0%"}
                  </div>
                  <p className="text-sm text-muted-foreground">Win Rate</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">
                    {content?.performance?.profitLoss || "$0"}
                  </div>
                  <p className="text-sm text-muted-foreground">P&L</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">
                    {content?.performance?.tradesCount || "0"}
                  </div>
                  <p className="text-sm text-muted-foreground">Trades</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">
                    {content?.performance?.rankPosition || "N/A"}
                  </div>
                  <p className="text-sm text-muted-foreground">Leaderboard</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Render by route section */}
        <div className="space-y-6">
          {section === "overview" && renderOverview()}
          {section === "sessions" && renderSessions()}
          {section === "strategies" && renderStrategies()}
          {section === "signals" && renderSignals()}
          {section === "challenges" && renderChallenges()}
          {section === "journal" && <TradingJournal />}
            </div>
      </div>
    </div>
  );
};
