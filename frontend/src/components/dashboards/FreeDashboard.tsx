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
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Navigate, useLocation } from "react-router-dom";
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
} from "lucide-react";
import { authService } from "@/services/authService";
import { PaymentForm } from "@/components/PaymentForm";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

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
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<{
    name: string;
    amount: number;
  } | null>(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const { toast } = useToast();
  const location = useLocation();
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
      setCourses(coursesData);
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
    setSelectedProgram({ name: program, amount });
    setPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    setPaymentModalOpen(false);
    toast({
      title: "Welcome!",
      description:
        "Your enrollment was successful. Admin will approve soon. Refresh to check status.",
    });
    loadCommunityContent(); // Refresh to check if approved
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
            <div className="flex flex-wrap gap-16 mx-auto mb-8 max-w-full items-center justify-center">
              <div className="flex-1 min-w-[300px] max-w-sm">
                <Card className="relative overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-primary/10" />
                  <CardHeader className="relative">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                      >
                        <Crown className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                      <div className="text-2xl font-bold text-primary">$50</div>
                    </div>
                    <CardTitle className="text-xl">
                      6-Month Academy Program
                    </CardTitle>
                    <CardDescription>
                      Complete beginner-to-advanced forex trading education with
                      structured lessons and mentorship.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-primary" />
                        <span className="text-sm">
                          6 months of structured video lessons
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-sm">Weekly live Zoom calls</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span className="text-sm">
                          Hands-on trading exercises
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-primary" />
                        <span className="text-sm">
                          Final project & certification
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="cta"
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                      onClick={() => handleUpgrade("academy", 5000)}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Upgrade to Academy
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="flex-1 min-w-[300px] max-w-sm">
                <Card className="relative overflow-hidden border-2 border-secondary/20 hover:border-secondary/40 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-secondary/10" />
                  <CardHeader className="relative">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      >
                        <Star className="w-3 h-3 mr-1" />
                        Elite
                      </Badge>
                      <div className="text-2xl font-bold text-secondary">
                        $100
                      </div>
                    </div>
                    <CardTitle className="text-xl">
                      Monthly Mentorship Program
                    </CardTitle>
                    <CardDescription>
                      Personalized 1:1 coaching, VIP signals, and exclusive
                      trading room access.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-secondary" />
                        <span className="text-sm">
                          1:1 weekly mentorship calls
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-secondary" />
                        <span className="text-sm">VIP trading signals</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-secondary" />
                        <span className="text-sm">
                          Private mentorship group
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-secondary" />
                        <span className="text-sm">Custom trading plan</span>
                      </div>
                    </div>
                    <Button
                      variant="cta"
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      onClick={() => handleUpgrade("mentorship", 10000)}
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Join Mentorship
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content?.freeCourses?.map((course, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Free</Badge>
                    <div className="text-sm font-medium">0:45</div>
                  </div>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Watch Now
                  </Button>
                </CardContent>
              </Card>
            )) || (
              <Card className="col-span-full">
                <CardContent className="text-center py-8">
                  <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Free courses will appear here once available.
                  </p>
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

        <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
          <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-transparent border-none shadow-none">
            {selectedProgram && (
              <PaymentForm
                amount={selectedProgram.amount}
                program={selectedProgram.name}
                onSuccess={handlePaymentSuccess}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
