"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
import { useLocation, useNavigate } from "react-router-dom";
import {
  Play,
  BookOpen,
  Users,
  Star,
  Crown,
  Zap,
  TrendingUp,
  MessageCircle,
  Award,
  CheckCircle,
  Eye,
  PlayCircle,
  BarChart3,
  ThumbsUp,
  User,
  Timer,
  ArrowUpRight,
  Target,
} from "lucide-react";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { CourseViewer } from "@/components/CourseViewer";

interface CommunityContent {
  freeCourses: any[];
  dailySignals: any[];
  marketRecaps: any[];
  communityLinks: any;
}

interface Course {
  id: number;
  title: string;
  description: string;
  progress?: number;
  completed?: boolean;
  videos?: any[];
  thumbnailUrl?: string;
  duration?: number;
  level?: string;
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
  const [expandedCourses, setExpandedCourses] = useState<Set<number>>(
    new Set()
  );
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [viewingCourse, setViewingCourse] = useState<any | null>(null);
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
            console.error(
              `Failed to load videos for course ${course.id}:`,
              error
            );
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

  // If viewing a course, show the CourseViewer
  if (viewingCourse) {
    return (
      <CourseViewer
        course={viewingCourse}
        onBack={() => setViewingCourse(null)}
      />
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-green-50/50 dark:from-slate-900/50 dark:via-slate-800/30 dark:to-slate-900/50 min-h-full relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-green-400/5 rounded-full blur-xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0">
                <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-3 text-gray-900 dark:text-white">
                  Welcome to{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400">
                    Mobsters Forex Academy
                  </span>
                </h1>
                <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">
                  Start your forex trading journey with our free community
                  content and explore our premium programs.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <Button
                className="bg-green-600 hover:bg-green-700 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-white border border-green-600 dark:border-slate-600 backdrop-blur-sm transition-all duration-300 shadow-lg hover:shadow-xl"
                size="sm"
                onClick={() => {
                  loadCommunityContent();
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
        </div>

        {/* Testing: Request Roles without Payment */}
        {section === "overview" && (
          <Card className="mb-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-dashed border-green-300/60 dark:border-green-700/60 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
                <div className="p-2 rounded-xl bg-gradient-to-br from-green-100/80 to-emerald-100/80 dark:from-green-900/30 dark:to-emerald-900/30 group-hover:from-green-200/80 group-hover:to-emerald-200/80 dark:group-hover:from-green-800/40 dark:group-hover:to-emerald-800/40 transition-all duration-300">
                  <Zap className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                Request Program Access (Testing)
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Submit a role request for Academy or Mentorship without payment.
                Admin can approve in Users panel.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <Button
                className="border-green-600 dark:border-slate-600 text-green-700 dark:text-white hover:bg-green-50 dark:hover:bg-slate-800/50 backdrop-blur-sm transition-all duration-300 disabled:opacity-50 bg-transparent"
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
                className="border-green-600 dark:border-slate-600 text-green-700 dark:text-white hover:bg-green-50 dark:hover:bg-slate-800/50 backdrop-blur-sm transition-all duration-300 disabled:opacity-50 bg-transparent"
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
          <div className="space-y-8">
            {/* Modern Analytics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Free Courses Card */}
              <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-50/80 via-green-50/60 to-teal-50/80 dark:from-emerald-950/40 dark:via-green-950/30 dark:to-teal-950/40 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <ArrowUpRight className="w-4 h-4" />
                      <span className="text-xs font-medium">+12%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {courses.length || 8}
                    </p>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Free Courses
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      Beginner-friendly trading courses
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Daily Signals Card */}
              <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50/80 via-cyan-50/60 to-sky-50/80 dark:from-blue-950/40 dark:via-cyan-950/30 dark:to-sky-950/40 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-500 to-sky-600 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                      <ArrowUpRight className="w-4 h-4" />
                      <span className="text-xs font-medium">+8%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {signals.length || 15}
                    </p>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Daily Signals
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      Market analysis & insights
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Community Members Card */}
              <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50/80 via-violet-50/60 to-indigo-50/80 dark:from-purple-950/40 dark:via-violet-950/30 dark:to-indigo-950/40 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-violet-500/5 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 via-violet-500 to-indigo-600 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                      <ArrowUpRight className="w-4 h-4" />
                      <span className="text-xs font-medium">+24%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      2.4K
                    </p>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Community Members
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      Active trading community
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Signal Accuracy Card */}
              <Card className="relative overflow-hidden bg-gradient-to-br from-orange-50/80 via-amber-50/60 to-yellow-50/80 dark:from-orange-950/40 dark:via-amber-950/30 dark:to-yellow-950/40 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-600 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                      <ArrowUpRight className="w-4 h-4" />
                      <span className="text-xs font-medium">+5%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      87%
                    </p>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Signal Accuracy
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      Proven track record
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Modern Program Cards - Only in Overview */}
            <div className="grid lg:grid-cols-3 gap-8 mx-auto mb-16 max-w-7xl">
              {/* Free Community Card */}
              <div className="w-full">
                <Card className="relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-green-200/50 dark:border-slate-700/50 hover:border-green-400/60 dark:hover:border-green-500/60 shadow-lg rounded-2xl group">
                  
                  {/* Decorative background elements */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600"></div>
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
                  
                  <CardHeader className="pb-6 pt-8 px-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="p-4 rounded-2xl shadow-xl bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300">
                        <MessageCircle className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 bg-clip-text text-transparent">
                          Free
                        </div>
                        <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                          Forever
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors">
                      Free Community
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                      Join our vibrant trading community with daily signals and beginner-friendly resources.
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="px-8 pb-8">
                    <div className="space-y-4 mb-8">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center mt-0.5">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                          Daily forex signals & market analysis
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center mt-0.5">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                          Access to community discussions
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center mt-0.5">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                          Beginner trading resources
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center mt-0.5">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                          Weekly market recaps
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 font-medium mb-8 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-lg">
                      <Star className="w-4 h-4" />
                      <span className="text-sm">No commitment required</span>
                    </div>
                    
                    <Button className="w-full h-12 text-base font-semibold bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl" disabled>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Current Plan - Active
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Academy Program Card */}
              <div className="w-full">
                <Card className="relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-2 border-green-400/60 dark:border-green-500/60 hover:border-green-500/80 dark:hover:border-green-400/80 shadow-xl rounded-2xl group scale-105 z-10">
                  
                  {/* Decorative background elements */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600"></div>
                  <div className="absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br from-green-400/30 to-emerald-500/30 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
                  <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-emerald-400/20 to-green-500/20 rounded-full blur-xl group-hover:scale-110 transition-transform duration-700"></div>
                  
                  <CardHeader className="pb-6 pt-8 px-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="p-4 rounded-2xl shadow-xl bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300">
                        <Award className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent">
                          $50
                        </div>
                        <div className="text-sm line-through text-red-500 dark:text-red-400 font-medium">
                          $97
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors">
                      6-Month Academy
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                      Complete beginner-to-advanced forex education with structured lessons and mentorship.
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="px-8 pb-8">
                    <div className="space-y-4 mb-8">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center mt-0.5">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                          6 months of structured video lessons
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center mt-0.5">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                          Weekly live Zoom calls
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center mt-0.5">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                          Hands-on trading exercises
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center mt-0.5">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                          Final project & certification
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 font-medium mb-8 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-lg">
                      <Star className="w-4 h-4" />
                      <span className="text-sm">Limited to 50 students per cohort</span>
                    </div>
                    
                    <Button className="w-full h-12 text-base font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl" onClick={() => handleUpgrade("academy", 5000)}>
                      <Zap className="w-5 h-5 mr-2" />
                      Upgrade to Academy
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Mentorship Program Card */}
              <div className="w-full">
                <Card className="relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-green-200/50 dark:border-slate-700/50 hover:border-green-400/60 dark:hover:border-green-500/60 shadow-lg rounded-2xl group">
                  
                  {/* Decorative background elements */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-indigo-500 to-purple-600"></div>
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-indigo-500/20 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
                  
                  <CardHeader className="pb-6 pt-8 px-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="p-4 rounded-2xl shadow-xl bg-gradient-to-br from-purple-500 via-indigo-500 to-purple-600 group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300">
                        <Crown className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent">
                          $150
                        </div>
                        <div className="text-sm line-through text-red-500 dark:text-red-400 font-medium">
                          $297
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
                      Elite Mentorship
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                      Personal mentoring with advanced strategies, premium signals, and exclusive access.
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="px-8 pb-8">
                    <div className="space-y-4 mb-8">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center mt-0.5">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                          1-on-1 mentorship sessions
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center mt-0.5">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                          Premium trading signals
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center mt-0.5">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                          Advanced trading strategies
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center mt-0.5">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                          Exclusive VIP community access
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 font-medium mb-8 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-4 py-2 rounded-lg">
                      <Crown className="w-4 h-4" />
                      <span className="text-sm">Elite tier - Limited spots</span>
                    </div>
                    
                    <Button className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl" onClick={() => handleUpgrade("mentorship", 15000)}>
                      <Crown className="w-5 h-5 mr-2" />
                      Upgrade to Mentorship
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {myRequests && myRequests.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Your Role Requests</CardTitle>
              <CardDescription>
                Track status of your program access requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3">
                {myRequests.map((r, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <div>
                      <p className="font-medium">{r.program} Program</p>
                      <p className="text-sm text-muted-foreground">
                        Requested {new Date(r.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge
                      variant={
                        r.status === "approved"
                          ? "default"
                          : r.status === "rejected"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {r.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {section === "courses" && (
          <div className="space-y-12">
            {/* Free Courses Section */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 shadow-xl">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                    Free Courses
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    Start your forex trading journey with our comprehensive free courses
                  </p>
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <Card
                      key={course.id}
                      className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-0"
                    >
                      {/* Course Thumbnail */}
                      <div className="relative h-48 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 overflow-hidden">
                        {course.thumbnailUrl ? (
                          <img
                            src={course.thumbnailUrl || "/placeholder.svg"}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="w-16 h-16 text-white/80" />
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
                          <Badge className="bg-indigo-600/90 text-white border-0 backdrop-blur-sm">
                            {course.videos?.length || 0} videos
                          </Badge>
                        </div>

                        {/* Free Badge */}
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-emerald-600/90 text-white border-0 backdrop-blur-sm">
                            Free
                          </Badge>
                        </div>

                        {/* Duration */}
                        <div className="absolute bottom-4 right-4">
                          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-white text-xs">
                            <Timer className="w-3 h-3" />
                            {course.duration ? `${course.duration}min` : "45min"}
                          </div>
                        </div>
                      </div>

                      {/* Course Content */}
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {/* Course Title & Description */}
                          <div>
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
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
                                <span>Expert</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-500" />
                                <span>4.9</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                <span>2.1k</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <BarChart3 className="w-3 h-3" />
                              <span>Beginner</span>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-600 dark:text-gray-400">Progress</span>
                              <span className="font-medium text-green-600 dark:text-green-400">
                                {course.progress || 0}%
                              </span>
                            </div>
                            <Progress value={course.progress || 0} className="h-2" />
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 pt-2">
                            <Button
                              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0"
                              onClick={() => setViewingCourse(course)}
                            >
                              <Play className="w-4 h-4 mr-2" />
                              {course.progress > 0 ? "Continue" : "Start Free"}
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 bg-transparent"
                            >
                              <ThumbsUp className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      No courses available at the moment.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {section === "signals" && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Daily Trading Signals
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Get expert market analysis and trading opportunities
              </p>
            </div>
            
            <div className="grid gap-6">
              {signals.length > 0 ? (
                signals.map((signal, index) => (
                  <Card key={index} className="shadow-soft hover:shadow-medium transition-all duration-300 border-green-200 dark:border-green-800 card-glow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-lg mb-2">{signal.pair}</h3>
                          <div className="flex items-center gap-4 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              signal.type === 'BUY' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}>
                              {signal.type}
                            </span>
                            <span className="text-muted-foreground">
                              Entry: {signal.entry}
                            </span>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {signal.timeframe}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Stop Loss</p>
                          <p className="font-medium">{signal.stopLoss}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Take Profit 1</p>
                          <p className="font-medium">{signal.takeProfit1}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Take Profit 2</p>
                          <p className="font-medium">{signal.takeProfit2}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Risk/Reward</p>
                          <span className="font-medium text-green-600 dark:text-green-400">
                            1:{signal.riskReward}
                          </span>
                        </div>
                      </div>
                      
                      {signal.analysis && (
                        <div className="mt-4 p-3 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-100 dark:border-green-800">
                          <p className="text-sm">{signal.analysis}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="shadow-soft hover:shadow-medium transition-all duration-300 border-green-200 dark:border-green-800 card-glow">
                  <CardContent className="text-center py-8">
                    <div className="p-4 rounded-full bg-green-100 dark:bg-green-900 w-fit mx-auto mb-4">
                      <MessageCircle className="w-16 h-16 text-green-500 dark:text-green-400" />
                    </div>
                    <p className="text-muted-foreground">
                      Daily signals will appear here.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {section === "community" && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Trading Community
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Connect with fellow traders and share insights
              </p>
            </div>
            
            <Card className="shadow-soft hover:shadow-medium transition-all duration-300 border-green-200 dark:border-green-800 card-glow">
              <CardContent className="text-center py-12">
                <div className="p-4 rounded-full bg-green-100 dark:bg-green-900 w-fit mx-auto mb-4">
                  <Users className="w-16 h-16 text-green-500 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Join Our Community</h3>
                <p className="text-muted-foreground mb-6">
                  Connect with other traders, share strategies, and learn together.
                </p>
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Join Discord Community
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
