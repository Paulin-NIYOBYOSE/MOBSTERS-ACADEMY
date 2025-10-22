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
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400">Mobsters Forex Academy</span>
                </h1>
                <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">
                  Start your forex trading journey with our free community content
                  and explore our premium programs.
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
                className="border-green-600 dark:border-slate-600 text-green-700 dark:text-white hover:bg-green-50 dark:hover:bg-slate-800/50 backdrop-blur-sm transition-all duration-300 disabled:opacity-50"
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
                className="border-green-600 dark:border-slate-600 text-green-700 dark:text-white hover:bg-green-50 dark:hover:bg-slate-800/50 backdrop-blur-sm transition-all duration-300 disabled:opacity-50"
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
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600"></div>
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
                  
                  <CardHeader className="pb-6 pt-8 px-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="p-4 rounded-2xl shadow-xl bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent">
                          $100
                        </div>
                        <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                          /month
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors">
                      Monthly Mentorship
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                      Personalized 1:1 coaching, VIP signals, and exclusive trading room access.
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="px-8 pb-8">
                    <div className="space-y-4 mb-8">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center mt-0.5">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                          1:1 weekly mentorship calls
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center mt-0.5">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                          VIP trading signals
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center mt-0.5">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                          Private mentorship group
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center mt-0.5">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                          Custom trading plan
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 font-medium mb-8 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-lg">
                      <Star className="w-4 h-4" />
                      <span className="text-sm">Cancel anytime</span>
                    </div>
                    
                    <Button className="w-full h-12 text-base font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl" onClick={() => handleUpgrade("mentorship", 10000)}>
                      <Star className="w-5 h-5 mr-2" />
                      Join Mentorship
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card className="shadow-soft hover:shadow-medium transition-all duration-300 border-green-200 dark:border-green-800 card-glow hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                    <Play className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  Free Content Available
                </CardTitle>
                <CardDescription>
                  Get started with our free resources while you decide on a
                  premium program.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="text-center p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-green-200/50 dark:border-slate-700/50 hover:border-green-400/60 dark:hover:border-green-500/60 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl group">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-green-100/80 to-emerald-100/80 dark:from-green-900/30 dark:to-emerald-900/30 w-fit mx-auto mb-4 group-hover:from-green-200/80 group-hover:to-emerald-200/80 dark:group-hover:from-green-800/40 dark:group-hover:to-emerald-800/40 transition-all duration-300 shadow-lg">
                      <BookOpen className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h4 className="font-bold mb-2 text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">Basic Courses</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      Introduction to forex trading
                    </p>
                  </Card>
                  <Card className="text-center p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-green-200/50 dark:border-slate-700/50 hover:border-green-400/60 dark:hover:border-green-500/60 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl group">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-green-100/80 to-emerald-100/80 dark:from-green-900/30 dark:to-emerald-900/30 w-fit mx-auto mb-4 group-hover:from-green-200/80 group-hover:to-emerald-200/80 dark:group-hover:from-green-800/40 dark:group-hover:to-emerald-800/40 transition-all duration-300 shadow-lg">
                      <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h4 className="font-bold mb-2 text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">Market Signals</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      Daily market analysis
                    </p>
                  </Card>
                  <Card className="text-center p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-green-200/50 dark:border-slate-700/50 hover:border-green-400/60 dark:hover:border-green-500/60 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl group">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-green-100/80 to-emerald-100/80 dark:from-green-900/30 dark:to-emerald-900/30 w-fit mx-auto mb-4 group-hover:from-green-200/80 group-hover:to-emerald-200/80 dark:group-hover:from-green-800/40 dark:group-hover:to-emerald-800/40 transition-all duration-300 shadow-lg">
                      <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h4 className="font-bold mb-2 text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">Community</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      Connect with other traders
                    </p>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {section === "courses" && (
          <div className="space-y-12">
            {/* Free Courses Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Free Courses</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <Card
                      key={course.id}
                      className="relative overflow-hidden bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 hover:border-green-500/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl group"
                    >
                      {/* Course Thumbnail */}
                      <div className="relative h-48 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-slate-700 dark:to-slate-600 rounded-t-2xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 dark:from-black/50 to-transparent" />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-green-500 text-white px-3 py-1 text-sm font-medium">
                            Free
                          </Badge>
                        </div>
                        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm font-medium">
                          3m
                        </div>
                      </div>

                      {/* Course Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-gray-600 dark:text-slate-300 text-sm mb-6 leading-relaxed">
                          {course.description}
                        </p>

                        {/* Course Tags */}
                        <div className="flex gap-2 mb-6">
                          <Badge variant="secondary" className="bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 border-gray-300 dark:border-slate-600">
                            Beginner
                          </Badge>
                          <Badge variant="secondary" className="bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 border-gray-300 dark:border-slate-600">
                            Course
                          </Badge>
                          <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30">
                            Free
                          </Badge>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <Button 
                            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold border-2 border-green-400 hover:border-green-300 transition-all duration-200"
                            onClick={() => toggleCourseExpansion(course.id)}
                          >
                            Start Learning
                          </Button>
                          <Button 
                            variant="outline" 
                            className="border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 hover:bg-green-100 dark:hover:bg-green-700/20 hover:text-green-700 dark:hover:text-green-300 hover:border-green-500 transition-all duration-200"
                          >
                            Details
                          </Button>
                        </div>
                      </div>

                      {/* Expanded Content */}
                      {expandedCourses.has(course.id) && (
                        <div className="border-t border-gray-200 dark:border-slate-700 p-6">
                          {course.videos && course.videos.length > 0 ? (
                            <div className="space-y-4">
                              {course.videos.map((video: any, index: number) => (
                                <div
                                  key={video.id}
                                  className="flex items-center justify-between p-4 bg-gray-100 dark:bg-slate-700/50 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-200"
                                >
                                  <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white text-sm font-semibold">
                                      {index + 1}
                                    </div>
                                    <span className="text-base font-medium text-gray-900 dark:text-white">
                                      {video.title}
                                    </span>
                                  </div>
                                  <Button
                                    variant="cta"
                                    size="sm"
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
                                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600"
                                  >
                                    <Play className="w-4 h-4 mr-2" />
                                    Watch
                                  </Button>
                                </div>
                              ))}
                              {selectedVideo && (
                                <div className="mt-6 p-4 bg-slate-700/30 rounded-lg">
                                  <video
                                    src={selectedVideo}
                                    controls
                                    className="w-full h-auto rounded-lg"
                                    style={{ maxHeight: "400px" }}
                                    onError={(e) => {
                                      console.error("Video playback error:", e);
                                      toast({
                                        title: "Error",
                                        description: "Failed to play video. Please check the URL or try again.",
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
                              <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                              <p className="text-sm text-slate-400">
                                No videos available for this course yet.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </Card>
                  ))
                ) : (
                  <>
                    {/* Sample Free Course 1 */}
                    <Card className="relative overflow-hidden bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 hover:border-green-500/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl group">
                      <div className="relative h-48 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-slate-700 dark:to-slate-600 rounded-t-2xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 dark:from-black/50 to-transparent" />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-green-500 text-white px-3 py-1 text-sm font-medium">
                            Free
                          </Badge>
                        </div>
                        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm font-medium">
                          3m
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                          Free Beginner Trading Course
                        </h3>
                        <p className="text-gray-600 dark:text-slate-300 text-sm mb-6 leading-relaxed">
                          A step-by-step introduction to markets, risk and execution.
                        </p>
                        <div className="flex gap-2 mb-6">
                          <Badge variant="secondary" className="bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 border-gray-300 dark:border-slate-600">
                            Beginner
                          </Badge>
                          <Badge variant="secondary" className="bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 border-gray-300 dark:border-slate-600">
                            Course
                          </Badge>
                          <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30">
                            Free
                          </Badge>
                        </div>
                        <div className="flex gap-3">
                          <Button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold border-2 border-green-400 hover:border-green-300 transition-all duration-200">
                            Start Learning
                          </Button>
                          <Button variant="outline" className="border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 hover:bg-green-100 dark:hover:bg-green-700/20 hover:text-green-700 dark:hover:text-green-300 hover:border-green-500 transition-all duration-200">
                            Details
                          </Button>
                        </div>
                      </div>
                    </Card>

                    {/* Sample Free Course 2 */}
                    <Card className="relative overflow-hidden bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 hover:border-green-500/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl group">
                      <div className="relative h-48 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-slate-700 dark:to-slate-600 rounded-t-2xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 dark:from-black/50 to-transparent" />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-green-500 text-white px-3 py-1 text-sm font-medium">
                            Free
                          </Badge>
                        </div>
                        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm font-medium">
                          2m
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                          Free Prop Firm Series
                        </h3>
                        <p className="text-gray-600 dark:text-slate-300 text-sm mb-6 leading-relaxed">
                          Navigate challenges, risk rules and evaluation tactics.
                        </p>
                        <div className="flex gap-2 mb-6">
                          <Badge variant="secondary" className="bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 border-gray-300 dark:border-slate-600">
                            Beginner
                          </Badge>
                          <Badge variant="secondary" className="bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 border-gray-300 dark:border-slate-600">
                            Course
                          </Badge>
                          <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30">
                            Free
                          </Badge>
                        </div>
                        <div className="flex gap-3">
                          <Button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold border-2 border-green-400 hover:border-green-300 transition-all duration-200">
                            Start Series
                          </Button>
                          <Button variant="outline" className="border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 hover:bg-green-100 dark:hover:bg-green-700/20 hover:text-green-700 dark:hover:text-green-300 hover:border-green-500 transition-all duration-200">
                            Details
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </>
                )}
              </div>
            </div>

            {/* Paid Mentorships Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Paid Mentorships</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Standard Mentorship */}
                <Card className="relative overflow-hidden bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 hover:border-green-500/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl group">
                  <div className="relative h-48 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-slate-700 dark:to-slate-600 rounded-t-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 dark:from-black/50 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-emerald-500 text-white px-3 py-1 text-sm font-medium">
                        Premium
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm font-medium">
                      4m
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-3 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                      STANDARD MENTORSHIP
                    </h3>
                    <p className="text-gray-600 dark:text-slate-300 text-sm mb-6 leading-relaxed">
                      Foundations, scalping mastery, weekly zooms & support.
                    </p>
                    <div className="flex gap-2 mb-6">
                      <Badge variant="secondary" className="bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 border-gray-300 dark:border-slate-600">
                        Intermediate
                      </Badge>
                      <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                        Mentorship
                      </Badge>
                      <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30">
                        $ 149
                      </Badge>
                    </div>
                    <div className="flex gap-3">
                      <Button 
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold border-2 border-green-400 hover:border-green-300 transition-all duration-200"
                        onClick={() => handleUpgrade("mentorship", 14900)}
                      >
                        Enroll Now
                      </Button>
                      <Button variant="outline" className="border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 hover:bg-green-100 dark:hover:bg-green-700/20 hover:text-green-700 dark:hover:text-green-300 hover:border-green-500 transition-all duration-200">
                        Details
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Premium Mentorship */}
                <Card className="relative overflow-hidden bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 hover:border-green-400/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl group">
                  <div className="relative h-48 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-slate-700 dark:to-slate-600 rounded-t-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 dark:from-black/50 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-green-600 text-white px-3 py-1 text-sm font-medium">
                        Premium
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm font-medium">
                      4m
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-3 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors">
                      PREMIUM MENTORSHIP
                    </h3>
                    <p className="text-gray-600 dark:text-slate-300 text-sm mb-6 leading-relaxed">
                      Full stack mentorship + live teaching & community.
                    </p>
                    <div className="flex gap-2 mb-6">
                      <Badge variant="secondary" className="bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 border-gray-300 dark:border-slate-600">
                        Advanced
                      </Badge>
                      <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30">
                        Mentorship
                      </Badge>
                      <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                        $ 499
                      </Badge>
                    </div>
                    <div className="flex gap-3">
                      <Button 
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold border-2 border-green-500 hover:border-green-400 transition-all duration-200"
                        onClick={() => handleUpgrade("premium-mentorship", 49900)}
                      >
                        Enroll Now
                      </Button>
                      <Button variant="outline" className="border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 hover:bg-green-100 dark:hover:bg-green-700/20 hover:text-green-700 dark:hover:text-green-300 hover:border-green-500 transition-all duration-200">
                        Details
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {section === "signals" && (
          <div className="space-y-4">
            {content?.dailySignals?.map((signal, index) => (
              <Card key={index} className="shadow-soft hover:shadow-medium transition-all duration-300 border-green-200 dark:border-green-800 card-glow hover-lift hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                        <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      {signal.pair}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          signal.direction === "BUY"
                            ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                            : "bg-gradient-to-r from-red-500 to-red-600 text-white"
                        }
                      >
                        {signal.direction}
                      </Badge>
                      <Badge variant="outline" className="border-green-200 text-green-600 dark:border-green-700 dark:text-green-400">{signal.status}</Badge>
                    </div>
                  </div>
                  <CardDescription>
                    Sent {new Date(signal.timestamp).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="p-3 rounded-lg bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-100 dark:border-green-800">
                      <span className="text-muted-foreground">Entry: </span>
                      <span className="font-medium text-green-600 dark:text-green-400">{signal.entry}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-100 dark:border-green-800">
                      <span className="text-muted-foreground">
                        Take Profit:{" "}
                      </span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        {signal.takeProfit}
                      </span>
                    </div>
                    <div className="p-3 rounded-lg bg-gradient-to-r from-red-50/50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/20 border border-red-100 dark:border-red-800">
                      <span className="text-muted-foreground">Stop Loss: </span>
                      <span className="font-medium text-red-600 dark:text-red-400">
                        {signal.stopLoss}
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
            )) || (
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
        )}

        {section === "community" && (
          <Card className="shadow-soft hover:shadow-medium transition-all duration-300 border-green-200 dark:border-green-800 card-glow hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                  <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                Join Our Trading Community
              </CardTitle>
              <CardDescription>
                Connect with fellow traders and get exclusive updates.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full border-green-200 text-green-600 hover:bg-green-50 hover:border-green-400 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/20">
                Join Telegram Community
              </Button>
              <Button variant="outline" className="w-full border-green-200 text-green-600 hover:bg-green-50 hover:border-green-400 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/20">
                Join Discord Server
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
