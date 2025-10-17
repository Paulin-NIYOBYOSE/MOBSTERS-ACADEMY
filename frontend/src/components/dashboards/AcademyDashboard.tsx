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
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import { Navigate, useLocation } from "react-router-dom";
import ReactPlayer from "react-player";

interface CourseVideo {
  id: number;
  title: string;
  videoUrl: string;
  completed: boolean;
}

interface Course {
  id: number;
  title: string;
  description: string;
  progress: number;
  completed: boolean;
  videos: CourseVideo[];
}

interface AcademyContent {
  courses: Course[];
  liveSession: any;
  assignments: any[];
  tradingJournal: any;
  progress: any;
}

export const AcademyDashboard: React.FC = () => {
  const [content, setContent] = useState<AcademyContent | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [signals, setSignals] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [expandedCourses, setExpandedCourses] = useState<Set<number>>(
    new Set()
  );
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const { toast } = useToast();
  const location = useLocation();
  const baseUrl = "http://localhost:3000"; // Backend server URL

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
      const coursesWithVideos = await Promise.all(
        coursesData.map(async (course: any) => {
          const videos = await authService.getCourseVideos(course.id);
          return { ...course, videos: videos || [] };
        })
      );
      setCourses(coursesWithVideos);
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

  const overallProgress = content?.progress?.overallProgress || 0;

  const pathParts = location.pathname.split("/").filter(Boolean);
  const section =
    pathParts[0] === "dashboard" ? pathParts[1] || "overview" : pathParts[1];

  if (pathParts[0] === "academy" && !section) {
    return <Navigate to="/dashboard" replace />;
  }

  const renderOverview = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Completed Lessons
          </CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {content?.progress?.completedLessons || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            of {content?.progress?.totalLessons || 0} total
          </p>
        </CardContent>
      </Card>

      <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Assignments
          </CardTitle>
          <FileText className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {content?.assignments?.filter((a: any) => a.submitted).length || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            of {content?.assignments?.length || 0} submitted
          </p>
        </CardContent>
      </Card>

      <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Next Live Session
          </CardTitle>
          <Calendar className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-sm font-bold text-gray-900 dark:text-white">
            {content?.liveSession?.title || "No upcoming session"}
          </div>
          <p className="text-xs text-muted-foreground">
            {content?.liveSession?.scheduledTime
              ? new Date(content.liveSession.scheduledTime).toLocaleDateString()
              : "Check schedule"}
          </p>
        </CardContent>
      </Card>

      <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Trading Journal
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {content?.tradingJournal?.totalTrades || 0}
          </div>
          <p className="text-xs text-muted-foreground">Trades logged</p>
        </CardContent>
      </Card>
    </div>
  );

  const renderCourses = () => (
    <div className="space-y-8">
      {courses.length > 0 ? (
        courses.map((course) => (
          <Card
            key={course.id}
            className="relative overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-900 rounded-xl"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
            <CardHeader className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <BookOpen className="w-6 h-6 text-blue-500 dark:text-blue-300" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="mt-2 text-base text-gray-600 dark:text-gray-300">
                      {course.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge
                    variant={course.completed ? "default" : "secondary"}
                    className={`px-3 py-1 text-sm font-semibold ${
                      course.completed
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                    }`}
                  >
                    {course.completed ? "Completed" : `${course.progress}%`}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleCourseExpansion(course.id)}
                    className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
                  >
                    {expandedCourses.has(course.id) ? (
                      <ChevronUp className="w-6 h-6" />
                    ) : (
                      <ChevronDown className="w-6 h-6" />
                    )}
                  </Button>
                </div>
              </div>
              <Progress
                value={course.progress}
                className="mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full"
              />
            </CardHeader>
            {expandedCourses.has(course.id) && (
              <CardContent className="p-6 pt-0">
                {course.videos.length > 0 ? (
                  <div className="space-y-4">
                    {course.videos.map((video: CourseVideo, index: number) => (
                      <div
                        key={video.id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                            {index + 1}.
                          </span>
                          <span className="text-base font-medium text-gray-900 dark:text-white">
                            {video.title}
                          </span>
                          {video.completed && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                        </div>
                        <Button
                          variant="cta"
                          size="sm"
                          onClick={() => {
                            // Handle different URL formats
                            let videoUrl = video.videoUrl;
                            if (!videoUrl.startsWith('http')) {
                              // Remove /uploads prefix if present since static assets are served from uploads root
                              if (videoUrl.startsWith('/uploads/')) {
                                videoUrl = videoUrl.replace('/uploads/', '/');
                              }
                              // If it's a relative path, prepend the base URL
                              videoUrl = `${baseUrl}${videoUrl.startsWith('/') ? '' : '/'}${videoUrl}`;
                            }
                            console.log("Playing video:", videoUrl, "Original videoUrl:", video.videoUrl);
                            console.log("Video object:", video);
                            setSelectedVideo(videoUrl);
                          }}
                          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          {video.completed ? "Replay" : "Watch"}
                        </Button>
                      </div>
                    ))}
                    {selectedVideo && (
                      <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-inner">
                        <div className="relative">
                          <div className="mb-2 text-xs text-gray-500 break-all">
                            Video URL: {selectedVideo}
                          </div>
                          <video
                            src={selectedVideo}
                            controls
                            className="w-full h-auto rounded-lg"
                            style={{ maxHeight: "400px" }}
                            onError={(e) => {
                              console.error("Video playback error:", e);
                              console.error("Failed video URL:", selectedVideo);
                              toast({
                                title: "Video Error",
                                description: `Failed to load video. URL: ${selectedVideo}`,
                                variant: "destructive",
                              });
                            }}
                            onLoadStart={() => {
                              console.log("Video loading started:", selectedVideo);
                            }}
                            onCanPlay={() => {
                              console.log("Video can play:", selectedVideo);
                            }}
                          >
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No videos available for this course.
                    </p>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        ))
      ) : (
        <Card className="border-none shadow-lg bg-white dark:bg-gray-900 rounded-xl">
          <CardContent className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
              Course content will appear here once available.
            </p>
            <Button
              variant="outline"
              className="mt-4 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
              onClick={loadAcademyContent}
            >
              Refresh Courses
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderLive = () => (
    <div className="space-y-4">
      {sessions.length > 0 ? (
        sessions.map((session, index) => (
          <Card
            key={index}
            className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                <Calendar className="w-5 h-5 text-purple-500" />
                {session.title}
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                {session.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Scheduled {new Date(session.date).toLocaleDateString()} at{" "}
                  {new Date(session.date).toLocaleTimeString()}
                </p>
                <Button
                  variant="cta"
                  className="bg-purple-500 hover:bg-purple-600 text-white"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Join Session
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card className="border-none shadow-lg bg-white dark:bg-gray-900 rounded-xl">
          <CardContent className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
              Live session schedule will appear here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderAssignments = () => (
    <div className="space-y-4">
      {content?.assignments?.length ? (
        content.assignments.map((assignment: any, index: number) => (
          <Card
            key={index}
            className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800"
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                  {assignment.title}
                </CardTitle>
                <Badge
                  variant={assignment.submitted ? "default" : "outline"}
                  className={
                    assignment.submitted
                      ? "bg-green-500 text-white"
                      : "border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-300"
                  }
                >
                  {assignment.submitted ? "Submitted" : "Pending"}
                </Badge>
              </div>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                {assignment.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                </div>
                <Button
                  variant={assignment.submitted ? "outline" : "cta"}
                  className={
                    assignment.submitted
                      ? "border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-300"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }
                >
                  {assignment.submitted
                    ? "View Submission"
                    : "Submit Assignment"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card className="border-none shadow-lg bg-white dark:bg-gray-900 rounded-xl">
          <CardContent className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
              Assignments will appear here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderJournal = () => (
    <Card className="border-none shadow-lg bg-white dark:bg-gray-900 rounded-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
          <TrendingUp className="w-5 h-5 text-green-500" />
          Trading Journal
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-300">
          Track your trades and analyze your performance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <Award className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
            Trading journal interface will appear here.
          </p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50/30 via-background to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 min-h-full">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  Academy{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
                    Dashboard
                  </span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
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
                className="border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {loading ? "Refreshing..." : "Refresh"}
              </Button>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </div>
            </div>
          </div>

          <Card className="border-none shadow-lg bg-white dark:bg-gray-900 rounded-xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                  Overall Progress
                </CardTitle>
                <Badge
                  variant="secondary"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold"
                >
                  {overallProgress}% Complete
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Progress
                value={overallProgress}
                className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Keep up the great work! You're making excellent progress.
              </p>
            </CardContent>
          </Card>
        </div>

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
