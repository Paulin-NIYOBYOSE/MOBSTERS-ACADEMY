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
      const [coursesData, sessionsData, myReq] = await Promise.all(
        [
          authService.getCourses(),
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
                    Market Mobsters
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
              <Card className="relative overflow-hidden bg-gradient-to-br from-green-50/80 via-emerald-50/60 to-green-50/80 dark:from-green-950/40 dark:via-emerald-950/30 dark:to-green-950/40 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <ArrowUpRight className="w-4 h-4" />
                      <span className="text-xs font-medium">+8%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      15
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
              <Card className="relative overflow-hidden bg-gradient-to-br from-green-50/80 via-emerald-50/60 to-teal-50/80 dark:from-green-950/40 dark:via-emerald-950/30 dark:to-teal-950/40 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <ArrowUpRight className="w-4 h-4" />
                      <span className="text-xs font-medium">+24%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
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
              <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-50/80 via-green-50/60 to-teal-50/80 dark:from-emerald-950/40 dark:via-green-950/30 dark:to-teal-950/40 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <ArrowUpRight className="w-4 h-4" />
                      <span className="text-xs font-medium">+5%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto mb-16">
              {/* Free Community Card */}
              <Card className="relative overflow-hidden group hover-lift card-modern hover:border-primary/30">
                {/* Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <Badge variant="secondary" className="shadow-md">
                    Current Plan
                  </Badge>
                </div>

                <CardHeader className="pb-6 relative">
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-3 rounded-xl shadow-sm transition-all duration-300 group-hover:scale-110 bg-accent">
                      <MessageCircle className="w-7 h-7 text-primary" />
                    </div>
                    <div className="text-right">
                      <div className="heading-sm text-foreground">
                        Free
                      </div>
                    </div>
                  </div>

                  <CardTitle className="heading-xs mb-2">
                    Free Community
                  </CardTitle>
                  <p className="body-sm text-muted-foreground">Daily Signals & Support</p>
                </CardHeader>

                <CardContent className="pt-0 relative">
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3 group/item">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0 transition-transform group-hover/item:scale-110" />
                      <span className="body-sm text-card-foreground leading-relaxed">
                        Daily forex signals
                      </span>
                    </div>
                    <div className="flex items-start gap-3 group/item">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0 transition-transform group-hover/item:scale-110" />
                      <span className="body-sm text-card-foreground leading-relaxed">
                        Market analysis & tips
                      </span>
                    </div>
                    <div className="flex items-start gap-3 group/item">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0 transition-transform group-hover/item:scale-110" />
                      <span className="body-sm text-card-foreground leading-relaxed">
                        Community discussions
                      </span>
                    </div>
                    <div className="flex items-start gap-3 group/item">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0 transition-transform group-hover/item:scale-110" />
                      <span className="body-sm text-card-foreground leading-relaxed">
                        Beginner resources
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/50 mb-6">
                    <Star className="w-4 h-4 text-primary fill-primary" />
                    <span className="text-sm font-medium text-foreground">No commitment required</span>
                  </div>

                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full btn-modern border-primary/50 text-primary hover:bg-primary/5 hover:border-primary font-semibold"
                    disabled
                  >
                    <CheckCircle className="mr-2 w-5 h-5" />
                    Current Plan - Active
                  </Button>
                </CardContent>
              </Card>

              {/* Academy Program Card */}
              <Card className="relative overflow-hidden group hover-lift border-2 border-primary shadow-xl ring-2 ring-primary/20 lg:scale-105">
                {/* Gradient overlay for popular card */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />

                {/* Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <Badge variant="default" className="bg-gradient-primary text-white border-0 shadow-md">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>

                <CardHeader className="pb-6 relative">
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-3 rounded-xl shadow-sm transition-all duration-300 group-hover:scale-110 bg-gradient-primary text-white">
                      <Award className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="heading-sm text-foreground">
                        $497
                      </div>
                      <div className="text-sm line-through text-destructive/70 font-medium">
                        $697
                      </div>
                    </div>
                  </div>

                  <CardTitle className="heading-xs mb-2">
                    6-Month Academy
                  </CardTitle>
                  <p className="body-sm text-muted-foreground">Complete Trading Education</p>
                </CardHeader>

                <CardContent className="pt-0 relative">
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3 group/item">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0 transition-transform group-hover/item:scale-110" />
                      <span className="body-sm text-card-foreground leading-relaxed">
                        50+ hours of structured lessons
                      </span>
                    </div>
                    <div className="flex items-start gap-3 group/item">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0 transition-transform group-hover/item:scale-110" />
                      <span className="body-sm text-card-foreground leading-relaxed">
                        Weekly live mentorship calls
                      </span>
                    </div>
                    <div className="flex items-start gap-3 group/item">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0 transition-transform group-hover/item:scale-110" />
                      <span className="body-sm text-card-foreground leading-relaxed">
                        Trading certification included
                      </span>
                    </div>
                    <div className="flex items-start gap-3 group/item">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0 transition-transform group-hover/item:scale-110" />
                      <span className="body-sm text-card-foreground leading-relaxed">
                        Lifetime access to materials
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/50 mb-6">
                    <Star className="w-4 h-4 text-primary fill-primary" />
                    <span className="text-sm font-medium text-foreground">Limited to 50 students per cohort</span>
                  </div>

                  <Button
                    className="w-full btn-modern bg-gradient-primary hover:shadow-glow text-white border-0 font-semibold"
                    size="lg"
                    onClick={() => handleUpgrade("academy", 49700)}
                  >
                    <Zap className="mr-2 w-5 h-5" />
                    Enroll Now
                  </Button>
                </CardContent>
              </Card>

              {/* Mentorship Program Card */}
              <Card className="relative overflow-hidden group hover-lift card-modern hover:border-primary/30">
                {/* Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <Badge variant="secondary" className="shadow-md">
                    Ongoing Support
                  </Badge>
                </div>

                <CardHeader className="pb-6 relative">
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-3 rounded-xl shadow-sm transition-all duration-300 group-hover:scale-110 bg-accent">
                      <Users className="w-7 h-7 text-primary" />
                    </div>
                    <div className="text-right">
                      <div className="heading-sm text-foreground">
                        $97
                        <span className="text-base font-normal text-muted-foreground">
                          /month
                        </span>
                      </div>
                    </div>
                  </div>

                  <CardTitle className="heading-xs mb-2">
                    Monthly Mentorship
                  </CardTitle>
                  <p className="body-sm text-muted-foreground">Ongoing Expert Support</p>
                </CardHeader>

                <CardContent className="pt-0 relative">
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3 group/item">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0 transition-transform group-hover/item:scale-110" />
                      <span className="body-sm text-card-foreground leading-relaxed">
                        Weekly live strategy sessions
                      </span>
                    </div>
                    <div className="flex items-start gap-3 group/item">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0 transition-transform group-hover/item:scale-110" />
                      <span className="body-sm text-card-foreground leading-relaxed">
                        Advanced trading indicators
                      </span>
                    </div>
                    <div className="flex items-start gap-3 group/item">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0 transition-transform group-hover/item:scale-110" />
                      <span className="body-sm text-card-foreground leading-relaxed">
                        Daily market analysis
                      </span>
                    </div>
                    <div className="flex items-start gap-3 group/item">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0 transition-transform group-hover/item:scale-110" />
                      <span className="body-sm text-card-foreground leading-relaxed">
                        Priority community support
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/50 mb-6">
                    <Star className="w-4 h-4 text-primary fill-primary" />
                    <span className="text-sm font-medium text-foreground">Cancel anytime</span>
                  </div>

                  <Button
                    className="w-full btn-modern bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary-light text-white border-0 font-semibold hover:shadow-glow"
                    size="lg"
                    onClick={() => handleUpgrade("mentorship", 9700)}
                  >
                    <TrendingUp className="mr-2 w-5 h-5" />
                    Start Mentorship
                  </Button>
                </CardContent>
              </Card>

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
                          <p className="text-sm text-muted-foreground">
                            Requested {new Date(r.createdAt).toLocaleDateString()}
                          </p>
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
            </div>
          </div>
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
                      <div className="relative h-48 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 overflow-hidden">
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
                          <Badge className="bg-green-600/90 text-white border-0 backdrop-blur-sm">
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
