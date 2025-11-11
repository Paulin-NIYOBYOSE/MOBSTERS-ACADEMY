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
  ArrowUpRight,
  Clock,
  Target,
  Activity,
  Star,
  GraduationCap,
  PlayCircle,
  Eye,
  ThumbsUp,
  BarChart3,
  User,
  Timer,
} from "lucide-react";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import { Navigate, useLocation } from "react-router-dom";
import ReactPlayer from "react-player";
import { CourseViewer } from "@/components/CourseViewer";
import TradingJournal from "@/components/trading-journal/TradingJournal";

interface CourseVideo {
  id: number;
  title: string;
  videoUrl: string;
  completed: boolean;
  duration?: number;
}

interface Course {
  id: number;
  title: string;
  description: string;
  progress: number;
  completed: boolean;
  videos: CourseVideo[];
  thumbnailUrl?: string;
  duration?: number;
  level?: string;
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
  const [viewingCourse, setViewingCourse] = useState<Course | null>(null);
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
        {/* Completed Lessons */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed Lessons
            </CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <CheckCircle className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{content?.progress?.completedLessons || 12}</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>of {content?.progress?.totalLessons || 24} total</span>
            </div>
          </CardContent>
        </Card>

        {/* Assignments */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Assignments
            </CardTitle>
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <FileText className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{content?.assignments?.filter((a: any) => a.submitted).length || 8}</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>of {content?.assignments?.length || 12} submitted</span>
            </div>
          </CardContent>
        </Card>

        {/* Course Progress */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Course Progress
            </CardTitle>
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Target className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallProgress}%</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>+15% this week</span>
            </div>
          </CardContent>
        </Card>

        {/* Trading Journal */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Trading Journal
            </CardTitle>
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{content?.tradingJournal?.totalTrades || 47}</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>trades logged</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Next Live Session
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{content?.liveSession?.title || "Advanced Strategies"}</div>
            <p className="text-xs text-muted-foreground">
              {content?.liveSession?.scheduledTime
                ? new Date(content.liveSession.scheduledTime).toLocaleDateString()
                : "Tomorrow 3:00 PM"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Study Streak
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">12 days</div>
            <p className="text-xs text-muted-foreground">Keep it up!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Certificates Earned
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">3</div>
            <p className="text-xs text-muted-foreground">out of 6 available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Course Rating
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">4.8/5</div>
            <p className="text-xs text-muted-foreground">from your feedback</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Panel */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Progress Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Learning Progress
            </CardTitle>
            <CardDescription>Your weekly study activity and progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-muted-foreground">{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
              
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">24</div>
                  <div className="text-xs text-muted-foreground">Videos Watched</div>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div className="text-lg font-bold text-green-600">8</div>
                  <div className="text-xs text-muted-foreground">Assignments Done</div>
                </div>
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">5</div>
                  <div className="text-xs text-muted-foreground">Live Sessions</div>
                </div>
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
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-800">Continue Learning</p>
                  <p className="text-xs text-blue-600">Resume last video</p>
                </div>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Play className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800">New Assignment</p>
                  <p className="text-xs text-green-600">Due in 3 days</p>
                </div>
                <Button size="sm" variant="outline" className="text-green-600 border-green-200">
                  View
                </Button>
              </div>
            </div>

            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-800">Live Session</p>
                  <p className="text-xs text-purple-600">Tomorrow 3:00 PM</p>
                </div>
                <Button size="sm" variant="outline" className="text-purple-600 border-purple-200">
                  Join
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );

  const renderCourses = () => (
    <div className="space-y-8">
      {courses.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-0"
            >
              {/* Course Thumbnail */}
              <div className="relative h-48 bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 overflow-hidden">
                {course.thumbnailUrl ? (
                  <img 
                    src={course.thumbnailUrl} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <GraduationCap className="w-16 h-16 text-white/80" />
                  </div>
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
                    <PlayCircle className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                {/* Course Stats */}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-blue-600/90 text-white border-0 backdrop-blur-sm">
                    {course.videos?.length || 0} videos
                  </Badge>
                </div>
                
                {/* Progress Badge */}
                <div className="absolute top-4 right-4">
                  <Badge 
                    className={`border-0 backdrop-blur-sm ${
                      course.completed 
                        ? "bg-green-600/90 text-white" 
                        : "bg-orange-600/90 text-white"
                    }`}
                  >
                    {course.completed ? "Completed" : `${course.progress || 0}% Done`}
                  </Badge>
                </div>
                
                {/* Duration */}
                <div className="absolute bottom-4 right-4">
                  <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-white text-xs">
                    <Timer className="w-3 h-3" />
                    {course.duration ? `${course.duration}min` : "2h 30m"}
                  </div>
                </div>
              </div>
              
              {/* Course Content */}
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Course Title & Description */}
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                      {course.description}
                    </p>
                  </div>
                  
                  {/* Course Meta */}
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>Instructor</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span>4.8</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>1.2k</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <BarChart3 className="w-3 h-3" />
                      <span>{course.level || "Beginner"}</span>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">Progress</span>
                      <span className="font-medium text-blue-600 dark:text-blue-400">{course.progress || 0}%</span>
                    </div>
                    <Progress 
                      value={course.progress || 0} 
                      className="h-2 bg-gray-200 dark:bg-gray-700"
                    />
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                      onClick={() => setViewingCourse(course)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {course.progress > 0 ? "Continue" : "Start Course"}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
              
              {/* Expanded Video List */}
              {expandedCourses.has(course.id) && (
                <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800/50">
                  <div className="p-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <PlayCircle className="w-5 h-5 text-blue-600" />
                      Course Content ({course.videos?.length || 0} videos)
                    </h4>
                    
                    {course.videos && course.videos.length > 0 ? (
                      <div className="space-y-3">
                        {course.videos.map((video: CourseVideo, index: number) => (
                          <div
                            key={video.id}
                            className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors duration-200 cursor-pointer group/video"
                            onClick={() => {
                              let videoUrl = video.videoUrl;
                              if (!videoUrl.startsWith('http')) {
                                if (videoUrl.startsWith('/uploads/')) {
                                  videoUrl = videoUrl.replace('/uploads/', '/');
                                }
                                videoUrl = `${baseUrl}${videoUrl.startsWith('/') ? '' : '/'}${videoUrl}`;
                              }
                              setSelectedVideo(videoUrl);
                            }}
                          >
                            {/* Video Thumbnail */}
                            <div className="relative w-16 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex-shrink-0 overflow-hidden">
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Play className="w-4 h-4 text-white" />
                              </div>
                              <div className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-1 rounded">
                                {video.duration ? `${video.duration}:00` : `${5 + (index % 10)}:00`}
                              </div>
                            </div>
                            
                            {/* Video Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-blue-600 dark:text-blue-400 flex-shrink-0">
                                  {index + 1}.
                                </span>
                                <h5 className="font-medium text-gray-900 dark:text-white truncate group-hover/video:text-blue-600 dark:group-hover/video:text-blue-400">
                                  {video.title}
                                </h5>
                              </div>
                              <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                                <span>Video • {video.duration ? `${video.duration} min` : `${5 + (index % 10)} min`}</span>
                                {video.completed && (
                                  <div className="flex items-center gap-1 text-green-600">
                                    <CheckCircle className="w-3 h-3" />
                                    <span>Completed</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Play Button */}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="opacity-0 group-hover/video:opacity-100 transition-opacity"
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <PlayCircle className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          No videos available for this course yet.
                        </p>
                      </div>
                    )}
                    
                    {/* Video Player */}
                    {selectedVideo && (
                      <div className="mt-6 p-4 bg-black rounded-xl">
                        <video
                          src={selectedVideo}
                          controls
                          className="w-full h-auto rounded-lg"
                          style={{ maxHeight: "400px" }}
                          onError={(e) => {
                            console.error("Video playback error:", e);
                            toast({
                              title: "Video Error",
                              description: "Failed to load video. Please try again.",
                              variant: "destructive",
                            });
                          }}
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
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
                  onClick={() => window.open(`/session/${session.id}`, '_blank')}
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
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <TradingJournal />
    </div>
  );

  // If journal section, render only the trading journal
  if (section === "journal") {
    return renderJournal();
  }

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-blue-50/50 dark:from-slate-900/50 dark:via-slate-800/30 dark:to-slate-900/50 min-h-full relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-blue-400/5 rounded-full blur-xl"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0">
                <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-3 text-gray-900 dark:text-white">
                  Academy{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">Dashboard</span>
                </h1>
                <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">
                  Your 6-month journey to forex trading mastery and professional development.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <Button
                className="bg-blue-600 hover:bg-blue-700 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-white border border-blue-600 dark:border-slate-600 backdrop-blur-sm transition-all duration-300 shadow-lg hover:shadow-xl"
                size="sm"
                onClick={() => {
                  loadAcademyContent();
                  setLastRefresh(new Date());
                }}
                disabled={loading}
              >
                {loading ? "Refreshing..." : "Refresh"}
              </Button>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-blue-200/50 dark:border-slate-700/50">
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
        </div>
      </div>
    </div>
  );
};
