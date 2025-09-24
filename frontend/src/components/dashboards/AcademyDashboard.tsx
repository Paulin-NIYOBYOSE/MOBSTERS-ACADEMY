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
import {
  Play,
  BookOpen,
  Calendar,
  Users,
  CheckCircle,
  FileText,
  Award,
  TrendingUp,
  Download,
} from "lucide-react";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import { Navigate, useLocation } from "react-router-dom";

interface AcademyContent {
  courses: any[];
  liveSession: any;
  assignments: any[];
  tradingJournal: any;
  progress: any;
}

export const AcademyDashboard: React.FC = () => {
  const [content, setContent] = useState<AcademyContent | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [signals, setSignals] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    loadAcademyContent();
    const interval = setInterval(() => {
      loadAcademyContent();
      setLastRefresh(new Date());
    }, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadAcademyContent = async () => {
    try {
      const [contentData, coursesData, signalsData, sessionsData] =
        await Promise.all([
          authService.getAcademyContent(),
          authService.getCourses(),
          authService.getSignals(),
          authService.getLiveSessions(),
        ]);
      setContent(contentData);
      setCourses(coursesData);
      setSignals(signalsData);
      setSessions(sessionsData);
    } catch (error) {
      console.error("Failed to load academy content:", error);
      toast({
        title: "Error",
        description: "Failed to load academy content. Please try again.",
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

  const overallProgress = content?.progress?.overallProgress || 0;

  // Determine active section from URL: /academy/<section>
  const pathParts = location.pathname.split("/").filter(Boolean);
  const section = pathParts[0] === "dashboard" ? (pathParts[1] || "overview") : pathParts[1];

  // Default redirect: /academy -> /dashboard
  if (pathParts[0] === "academy" && !section) {
    return <Navigate to="/dashboard" replace />;
  }

  const renderOverview = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed Lessons</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {content?.progress?.completedLessons || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            of {content?.progress?.totalLessons || 0} total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Assignments</CardTitle>
          <FileText className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {content?.assignments?.filter((a: any) => a.submitted).length || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            of {content?.assignments?.length || 0} submitted
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Next Live Session</CardTitle>
          <Calendar className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-sm font-bold">
            {content?.liveSession?.title || "No upcoming session"}
          </div>
          <p className="text-xs text-muted-foreground">
            {content?.liveSession?.scheduledTime
              ? new Date(content.liveSession.scheduledTime).toLocaleDateString()
              : "Check schedule"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Trading Journal</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {content?.tradingJournal?.totalTrades || 0}
          </div>
          <p className="text-xs text-muted-foreground">Trades logged</p>
        </CardContent>
      </Card>
    </div>
  );

  const renderCourses = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.length > 0 ? (
        courses.map((course, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant={course.completed ? "default" : "secondary"}>
                  {course.completed ? "Completed" : "In Progress"}
                </Badge>
                <div className="text-sm font-medium">{course.progress}%</div>
              </div>
              <CardTitle className="text-lg">{course.title}</CardTitle>
              <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={course.progress} className="mb-4" />
              <div className="flex gap-2">
                <Button variant="cta" size="sm" className="flex-1">
                  <Play className="w-4 h-4 mr-2" />
                  {course.completed ? "Review" : "Continue"}
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card className="col-span-full">
          <CardContent className="text-center py-8">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Course content will appear here once available.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderLive = () => (
    <div className="space-y-4">
      {sessions.length > 0 ? (
        sessions.map((session, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-500" />
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
            <p className="text-muted-foreground">Live session schedule will appear here.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderAssignments = () => (
    <div className="space-y-4">
      {content?.assignments?.length ? (
        content.assignments.map((assignment: any, index: number) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{assignment.title}</CardTitle>
                <Badge variant={assignment.submitted ? "default" : "outline"}>
                  {assignment.submitted ? "Submitted" : "Pending"}
                </Badge>
              </div>
              <CardDescription>{assignment.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                </div>
                <Button variant={assignment.submitted ? "outline" : "cta"}>
                  {assignment.submitted ? "View Submission" : "Submit Assignment"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Assignments will appear here.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderJournal = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          Trading Journal
        </CardTitle>
        <CardDescription>Track your trades and analyze your performance.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Trading journal interface will appear here.</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50/30 via-background to-purple-50/30 dark:from-background dark:via-background dark:to-muted/30 min-h-full">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">
                  Academy{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
                    Dashboard
                  </span>
                </h1>
                <p className="text-muted-foreground text-lg">
                  Your 6-month journey to forex trading mastery.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  loadAcademyContent();
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

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Overall Progress</CardTitle>
                <Badge
                  variant="secondary"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                >
                  {overallProgress}% Complete
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={overallProgress} className="mb-2" />
              <p className="text-sm text-muted-foreground">
                Keep up the great work! You're making excellent progress.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Render by route section */}
        <div className="space-y-6">
          {section === "overview" && renderOverview()}
          {section === "courses" && renderCourses()}
          {section === "live" && renderLive()}
          {section === "assignments" && renderAssignments()}
          {section === "journal" && renderJournal()}
        </div>
      </div>
    </div>
  );
};
