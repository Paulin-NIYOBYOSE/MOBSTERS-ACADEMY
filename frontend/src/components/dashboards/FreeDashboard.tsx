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
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  Play,
  BookOpen,
  Users,
  Star,
  Crown,
  Zap,
  TrendingUp,
  Calendar,
  MessageCircle,
  Award,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import ReactPlayer from "react-player";

interface CommunityContent {
  freeCourses: any[];
  dailySignals: any[];
  marketRecaps: any[];
  communityLinks: any;
}

export const FreeDashboard: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [signals, setSignals] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState<{
    name: string;
    amount: number;
  } | null>(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [expandedCourses, setExpandedCourses] = useState<Set<number>>(new Set());
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const { toast } = useToast();
  const baseUrl = "http://localhost:3000"; // Backend server URL
  const location = useLocation();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const hasPending = (program: "academy" | "mentorship") =>
    (myRequests || []).some(
      (r: any) => r.program === program && r.status === "pending"
    );

  useEffect(() => {
    loadCommunityContent();
    const interval = setInterval(() => {
      loadCommunityContent();
      setLastRefresh(new Date());
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Poll role requests every 20s to pick up status changes quickly
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const reqs = await authService.getMyRoleRequests().catch(() => []);
        setMyRequests(reqs || []);
        // If any request approved, refresh user to switch dashboard
        if ((reqs || []).some((r: any) => r.status === "approved")) {
          await refreshUser();
        }
      } catch {}
    }, 20000);
    return () => clearInterval(interval);
  }, [refreshUser]);

  const loadCommunityContent = async () => {
    try {
      const [coursesData, signalsData, sessionsData, myReq] = await Promise.all(
        [
          authService.getCourses(),
          authService.getSignals(),
          authService.getLiveSessions(),
          authService.getMyRoleRequests().catch(() => []),
        ]
      );
      
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
      
      setCourses(coursesWithVideos);
      setSignals(signalsData);
      setSessions(sessionsData);
      setMyRequests(myReq || []);
    } catch (error) {
      console.error("Failed to load community content:", error);
      toast({
        title: "Error",
        description: "Failed to load content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = (program: string, amount: number) => {
    // Navigate to dedicated payment page
    const params = new URLSearchParams({
      amount: amount.toString(),
      program: program,
    });
    navigate(`/payment?${params.toString()}`);
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

  // Compose content object from state
  const content: CommunityContent = {
    freeCourses: courses,
    dailySignals: signals,
    marketRecaps: [],
    communityLinks: {},
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Determine section from URL: /dashboard/<section>
  const pathParts = location.pathname.split("/").filter(Boolean);
  const section =
    pathParts[0] === "dashboard" && !pathParts[1] ? "overview" : pathParts[1];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Welcome to{" "}
                <span className="text-primary">Mobsters Forex Academy</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Start your forex trading journey with our free community content
                and explore our premium programs.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  loadCommunityContent();
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
        </div>

        {/* Testing: Request Roles without Payment */}
        {section === "overview" && (
          <Card className="mb-6 border-dashed">
            <CardHeader>
              <CardTitle>Request Program Access (Testing)</CardTitle>
              <CardDescription>
                Submit a role request for Academy or Mentorship without payment.
                Admin can approve in Users panel.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                disabled={hasPending("academy")}
                onClick={async () => {
                  try {
                    console.log("Requesting academy role...");
                    await authService.requestRole("academy");
                    console.log("Academy role request submitted");
                    toast({
                      title: "Request Sent",
                      description:
                        "Academy role request submitted. You will be upgraded after admin approval.",
                    });
                    await refreshUser();
                    const reqs = await authService
                      .getMyRoleRequests()
                      .catch(() => []);
                    console.log("My role requests:", reqs);
                    setMyRequests(reqs || []);
                  } catch (e) {
                    console.error("Failed to request academy role:", e);
                    toast({
                      title: "Error",
                      description: "Failed to submit request.",
                      variant: "destructive",
                    });
                  }
                }}
              >
                Request Academy Role
              </Button>
              <Button
                variant="outline"
                disabled={hasPending("mentorship")}
                onClick={async () => {
                  try {
                    console.log("Requesting mentorship role...");
                    await authService.requestRole("mentorship");
                    console.log("Mentorship role request submitted");
                    toast({
                      title: "Request Sent",
                      description:
                        "Mentorship role request submitted. You will be upgraded after admin approval.",
                    });
                    await refreshUser();
                    const reqs = await authService
                      .getMyRoleRequests()
                      .catch(() => []);
                    console.log("My role requests:", reqs);
                    setMyRequests(reqs || []);
                  } catch (e) {
                    console.error("Failed to request mentorship role:", e);
                    toast({
                      title: "Error",
                      description: "Failed to submit request.",
                      variant: "destructive",
                    });
                  }
                }}
              >
                Request Mentorship Role
              </Button>
            </CardContent>
          </Card>
        )}

        {section === "overview" && (
          <div className="space-y-6">
            {/* {myRequests && myRequests.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Role Requests</CardTitle>
                  <CardDescription>Track status of your program access requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-3">
                    {myRequests.map((r, i) => (
                      <div key={i} className="flex items-center justify-between rounded-md border p-3">
                        <div>
                          <div className="text-sm font-medium capitalize">{r.program}</div>
                          <div className="text-xs text-muted-foreground">Status: {r.status}</div>
                        </div>
                        <Badge
                          variant={r.status === 'approved' ? 'default' : r.status === 'rejected' ? 'destructive' : 'secondary'}
                        >
                          {r.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )} */}
            <div className="grid lg:grid-cols-2 gap-8 mx-auto mb-12 max-w-6xl">
              <div className="w-full">
                <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white dark:bg-gray-900/95 backdrop-blur-sm border-2 border-green-500 dark:border-green-400 shadow-xl dark:shadow-2xl dark:shadow-green-500/20">
                  <div className="absolute -top-3 right-4">
                    <Badge className="mt-4 px-3 py-1 shadow-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                      <Crown className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-xl shadow-lg bg-gradient-to-br from-green-500 to-emerald-500 dark:from-green-400 dark:to-emerald-400">
                        <Award className="w-7 h-7 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                          $50
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900 dark:text-gray-100 mb-2">
                      6-Month Academy Program
                    </CardTitle>
                    <CardDescription className="text-slate-600 dark:text-gray-300 text-base">
                      Complete beginner-to-advanced forex trading education with
                      structured lessons and mentorship.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3 mb-6">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-700 dark:text-gray-300 leading-relaxed font-medium">
                          6 months of structured video lessons
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-700 dark:text-gray-300 leading-relaxed font-medium">
                          Weekly live Zoom calls
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-700 dark:text-gray-300 leading-relaxed font-medium">
                          Hands-on trading exercises
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-700 dark:text-gray-300 leading-relaxed font-medium">
                          Final project & certification
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 font-medium mb-6 text-green-600 dark:text-green-400">
                      <Star className="w-4 h-4" />
                      <span className="text-sm">
                        Limited to 50 students per cohort
                      </span>
                    </div>
                    <Button
                      className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                      onClick={() => handleUpgrade("academy", 5000)}
                    >
                      <Zap className="w-5 h-5 mr-2" />
                      Upgrade to Academy - $50
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="w-full">
                <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white dark:bg-gray-900/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-500 hover:shadow-lg dark:hover:shadow-xl">
                  <div className="absolute -top-3 right-4">
                    <Badge className="mt-3 px-3 py-1 shadow-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Ongoing Support
                    </Badge>
                  </div>
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-xl shadow-lg bg-gradient-to-br from-green-500 to-emerald-500 dark:from-green-400 dark:to-emerald-400">
                        <Users className="w-7 h-7 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-slate-900 dark:text-gray-100">
                          $100
                          <span className="text-lg font-normal text-slate-600 dark:text-gray-400">
                            /month
                          </span>
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900 dark:text-gray-100 mb-2">
                      Monthly Mentorship Program
                    </CardTitle>
                    <CardDescription className="text-slate-600 dark:text-gray-300 text-base">
                      Personalized 1:1 coaching, VIP signals, and exclusive
                      trading room access.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3 mb-6">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-700 dark:text-gray-300 leading-relaxed font-medium">
                          1:1 weekly mentorship calls
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-700 dark:text-gray-300 leading-relaxed font-medium">
                          VIP trading signals
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-700 dark:text-gray-300 leading-relaxed font-medium">
                          Private mentorship group
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-700 dark:text-gray-300 leading-relaxed font-medium">
                          Custom trading plan
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 font-medium mb-6 text-green-600 dark:text-green-400">
                      <Star className="w-4 h-4" />
                      <span className="text-sm">Cancel anytime</span>
                    </div>
                    <Button
                      className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                      onClick={() => handleUpgrade("mentorship", 10000)}
                    >
                      <Star className="w-5 h-5 mr-2" />
                      Join Mentorship - $100
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="w-5 h-5 text-primary" />
                  Free Content Available
                </CardTitle>
                <CardDescription>
                  Get started with our free resources while you decide on a
                  premium program.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Basic Courses</h4>
                    <p className="text-sm text-muted-foreground">
                      Introduction to forex trading
                    </p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Market Signals</h4>
                    <p className="text-sm text-muted-foreground">
                      Daily market analysis
                    </p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Community</h4>
                    <p className="text-sm text-muted-foreground">
                      Connect with other traders
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {section === "courses" && (
          <div className="space-y-8">
            {courses.length > 0 ? (
              courses.map((course) => (
                <Card
                  key={course.id}
                  className="relative overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-900 rounded-xl"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-blue-500" />
                  <CardHeader className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                          <BookOpen className="w-6 h-6 text-green-500 dark:text-green-300" />
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
                        <Badge className="px-3 py-1 text-sm font-semibold bg-green-500 text-white">
                          Free
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleCourseExpansion(course.id)}
                          className="text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-300 transition-colors duration-200"
                        >
                          {expandedCourses.has(course.id) ? (
                            <ChevronUp className="w-6 h-6" />
                          ) : (
                            <ChevronDown className="w-6 h-6" />
                          )}
                        </Button>
                      </div>
                    </div>
                    {course.videos && course.videos.length > 0 && (
                      <Progress
                        value={0}
                        className="mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full"
                      />
                    )}
                  </CardHeader>
                  {expandedCourses.has(course.id) && (
                    <CardContent className="p-6 pt-0">
                      {course.videos && course.videos.length > 0 ? (
                        <div className="space-y-4">
                          {course.videos.map((video: any, index: number) => (
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
                                className="bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 transition-all duration-200"
                              >
                                <Play className="w-4 h-4 mr-2" />
                                Watch
                              </Button>
                            </div>
                          ))}
                          {selectedVideo && (
                            <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-inner">
                              <video
                                src={selectedVideo}
                                controls
                                className="w-full h-auto rounded-lg"
                                style={{ maxHeight: "400px" }}
                                onError={(e) => {
                                  console.error("Video playback error:", e);
                                  toast({
                                    title: "Error",
                                    description:
                                      "Failed to play video. Please check the URL or try again.",
                                    variant: "destructive",
                                  });
                                }}
                              >
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <BookOpen className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            No videos available for this course yet.
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
                    Free courses will appear here once available.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4 text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300"
                    onClick={loadCommunityContent}
                  >
                    Refresh Courses
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {section === "signals" && (
          <div className="space-y-4">
            {content?.dailySignals?.map((signal, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{signal.pair}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          signal.direction === "BUY"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }
                      >
                        {signal.direction}
                      </Badge>
                      <Badge variant="outline">{signal.status}</Badge>
                    </div>
                  </div>
                  <CardDescription>
                    Sent {new Date(signal.timestamp).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Entry: </span>
                      <span className="font-medium">{signal.entry}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Take Profit:{" "}
                      </span>
                      <span className="font-medium text-green-500">
                        {signal.takeProfit}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Stop Loss: </span>
                      <span className="font-medium text-red-500">
                        {signal.stopLoss}
                      </span>
                    </div>
                  </div>
                  {signal.analysis && (
                    <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm">{signal.analysis}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )) || (
              <Card>
                <CardContent className="text-center py-8">
                  <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Daily signals will appear here.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {section === "community" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Join Our Trading Community
              </CardTitle>
              <CardDescription>
                Connect with fellow traders and get exclusive updates.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full">
                Join Telegram Community
              </Button>
              <Button variant="outline" className="w-full">
                Join Discord Server
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
