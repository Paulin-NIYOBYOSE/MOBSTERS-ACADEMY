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
} from "lucide-react";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import { Navigate, useLocation } from "react-router-dom";

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
  const { toast } = useToast();
  const location = useLocation();

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
      setContent(contentData);
      setCourses(coursesData);
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

  const renderOverview = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="md:col-span-2 lg:col-span-1 border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-500" />
            Next Mentorship Call
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold">
                {content?.mentorshipSessions[0]?.title || "No upcoming session"}
              </h4>
              <p className="text-sm text-muted-foreground">
                {content?.mentorshipSessions[0]?.date
                  ? `${new Date(content.mentorshipSessions[0].date).toLocaleDateString()} at ${new Date(
                      content.mentorshipSessions[0].date
                    ).toLocaleTimeString()}`
                  : "Check schedule for updates"}
              </p>
            </div>
            <Button variant="cta">
              <Users className="w-4 h-4 mr-2" />
              Join Session
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-purple-500" />
            Featured Strategy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <h4 className="font-semibold">
              {content?.advancedStrategies[0]?.title || "No strategy available"}
            </h4>
            <p className="text-sm text-muted-foreground">
              {content?.advancedStrategies[0]?.description || "Check back for new strategies"}
            </p>
            <Button variant="cta" size="sm" className="w-full">
              Learn Strategy
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-500" />
            Active Challenge
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <h4 className="font-semibold">
              {content?.challenges[0]?.title || "No active challenge"}
            </h4>
            <p className="text-sm text-muted-foreground">
              {content?.challenges[0]?.description || "Join a challenge to compete!"}
            </p>
            <Button variant="cta" size="sm" className="w-full">
              View Challenge
            </Button>
          </div>
        </CardContent>
      </Card>
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
    <div className="p-6 bg-gradient-to-br from-green-50/30 via-background to-teal-50/30 dark:from-background dark:via-background dark:to-muted/30 min-h-full">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">
                  Elite{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-teal-500">
                    Mentorship
                  </span>
                </h1>
                <p className="text-muted-foreground text-lg">
                  Advanced trading strategies and personalized guidance.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  loadMentorshipContent();
                  setLastRefresh(new Date());
                }}
                disabled={loading}
              >
                {loading ? "Refreshing..." : "Refresh"}
              </Button>
              <div className="text-sm text-muted-foreground">
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
            </div>
      </div>
    </div>
  );
};
