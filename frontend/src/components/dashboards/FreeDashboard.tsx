import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
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
  Award
} from 'lucide-react';
import { authService } from '@/services/authService';
import { PaymentForm } from '@/components/PaymentForm';
import { useToast } from '@/hooks/use-toast';

interface CommunityContent {
  freeCourses: any[];
  dailySignals: any[];
  marketRecaps: any[];
  communityLinks: any;
}

export const FreeDashboard: React.FC = () => {
  const [content, setContent] = useState<CommunityContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<{ name: string; amount: number } | null>(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const { toast } = useToast();

  useEffect(() => {
    loadCommunityContent();
    
    // Set up auto-refresh every 5 minutes
    const interval = setInterval(() => {
      loadCommunityContent();
      setLastRefresh(new Date());
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const loadCommunityContent = async () => {
    try {
      const data = await authService.getCommunityContent();
      setContent(data);
    } catch (error) {
      console.error('Failed to load community content:', error);
      toast({
        title: 'Error',
        description: 'Failed to load content. Please try again.',
        variant: 'destructive',
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
      title: 'Welcome!',
      description: 'Your enrollment was successful. Redirecting to your new dashboard...',
    });
    
    // Refresh page to update user roles and redirect to appropriate dashboard
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Welcome to <span className="text-primary">Mobsters Forex Academy</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Start your forex trading journey with our free community content and explore our premium programs.
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
                {loading ? 'Refreshing...' : 'Refresh'}
              </Button>
              <div className="text-sm text-muted-foreground">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">Free Courses</TabsTrigger>
            <TabsTrigger value="signals">Daily Signals</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Upgrade Cards */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Academy Program */}
              <Card className="relative overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-primary/10" />
                <CardHeader className="relative">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                    <div className="text-2xl font-bold text-primary">$50</div>
                  </div>
                  <CardTitle className="text-xl">6-Month Academy Program</CardTitle>
                  <CardDescription>
                    Complete beginner-to-advanced forex trading education with structured lessons and mentorship.
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary" />
                      <span className="text-sm">6 months of structured video lessons</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="text-sm">Weekly live Zoom calls</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      <span className="text-sm">Hands-on trading exercises</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-primary" />
                      <span className="text-sm">Final project & certification</span>
                    </div>
                  </div>
                  <Button 
                    variant="cta" 
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    onClick={() => handleUpgrade('academy', 5000)}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Upgrade to Academy
                  </Button>
                </CardContent>
              </Card>

              {/* Mentorship Program */}
              <Card className="relative overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-teal-500/10 to-primary/10" />
                <CardHeader className="relative">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Elite
                    </Badge>
                    <div className="text-2xl font-bold text-primary">$100</div>
                  </div>
                  <CardTitle className="text-xl">Monthly Mentorship Program</CardTitle>
                  <CardDescription>
                    Advanced trading strategies and personalized mentorship for experienced traders.
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="text-sm">Weekly live mentorship calls</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      <span className="text-sm">Advanced strategy library</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-primary" />
                      <span className="text-sm">Free educational signals</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-primary" />
                      <span className="text-sm">Monthly trading challenges</span>
                    </div>
                  </div>
                  <Button 
                    variant="cta" 
                    className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                    onClick={() => handleUpgrade('mentorship', 10000)}
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Mentorship
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Free Content Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="w-5 h-5 text-primary" />
                  Free Content Available
                </CardTitle>
                <CardDescription>
                  Get started with our free resources while you decide on a premium program.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Basic Courses</h4>
                    <p className="text-sm text-muted-foreground">Introduction to forex trading</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Market Signals</h4>
                    <p className="text-sm text-muted-foreground">Daily market analysis</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Community</h4>
                    <p className="text-sm text-muted-foreground">Connect with other traders</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content?.freeCourses?.map((course, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Play className="w-4 h-4 text-primary" />
                      {course.title}
                    </CardTitle>
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
                    <p className="text-muted-foreground">Free courses will appear here once available.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="signals">
            <div className="space-y-4">
              {content?.dailySignals?.map((signal, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      Daily Signal #{index + 1}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{signal.content}</p>
                  </CardContent>
                </Card>
              )) || (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">Daily signals will appear here.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="community">
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
          </TabsContent>
        </Tabs>

        {/* Payment Modal */}
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