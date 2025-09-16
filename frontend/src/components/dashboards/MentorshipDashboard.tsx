import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  MessageCircle, 
  Award, 
  Target,
  BarChart3,
  Star,
  Zap,
  Crown
} from 'lucide-react';
import { authService } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';

interface MentorshipContent {
  mentorshipSessions: any[];
  advancedStrategies: any[];
  signals: any[];
  challenges: any[];
  performance: any;
}

export const MentorshipDashboard: React.FC = () => {
  const [content, setContent] = useState<MentorshipContent | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadMentorshipContent();
  }, []);

  const loadMentorshipContent = async () => {
    try {
      const data = await authService.getMentorshipContent();
      setContent(data);
    } catch (error) {
      console.error('Failed to load mentorship content:', error);
      toast({
        title: 'Error',
        description: 'Failed to load mentorship content. Please try again.',
        variant: 'destructive',
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-background to-teal-50 dark:from-background dark:via-background dark:to-muted/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">
                Elite <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-teal-500">Mentorship</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Advanced trading strategies and personalized guidance.
              </p>
            </div>
          </div>

          {/* Performance Overview */}
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
                    {content?.performance?.winRate || '0%'}
                  </div>
                  <p className="text-sm text-muted-foreground">Win Rate</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">
                    {content?.performance?.profitLoss || '$0'}
                  </div>
                  <p className="text-sm text-muted-foreground">P&L</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">
                    {content?.performance?.tradesCount || '0'}
                  </div>
                  <p className="text-sm text-muted-foreground">Trades</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">
                    {content?.performance?.rankPosition || 'N/A'}
                  </div>
                  <p className="text-sm text-muted-foreground">Leaderboard</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sessions">Live Sessions</TabsTrigger>
            <TabsTrigger value="strategies">Strategies</TabsTrigger>
            <TabsTrigger value="signals">Premium Signals</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Upcoming Session */}
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
                      <h4 className="font-semibold">Advanced Risk Management</h4>
                      <p className="text-sm text-muted-foreground">
                        Tomorrow, 3:00 PM EST
                      </p>
                    </div>
                    <Button variant="cta" className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600">
                      <Users className="w-4 h-4 mr-2" />
                      Join Call
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Latest Signal */}
              <Card className="border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    Latest Signal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">EUR/USD</span>
                      <Badge className="bg-green-500 text-white">BUY</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Entry: 1.0850<br/>
                      TP: 1.0920<br/>
                      SL: 1.0800
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      View Analysis
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Active Challenge */}
              <Card className="border-purple-200 dark:border-purple-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-500" />
                    Monthly Challenge
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Consistency Challenge</h4>
                    <p className="text-sm text-muted-foreground">
                      Maintain 70%+ win rate
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                      <span className="text-sm font-medium">65%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                    <MessageCircle className="w-6 h-6 text-blue-500" />
                    <span>Ask Mentor</span>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                    <BarChart3 className="w-6 h-6 text-green-500" />
                    <span>View Analytics</span>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                    <Star className="w-6 h-6 text-yellow-500" />
                    <span>Rate Session</span>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                    <Award className="w-6 h-6 text-purple-500" />
                    <span>Leaderboard</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions">
            <div className="space-y-4">
              {content?.mentorshipSessions?.map((session, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{session.title}</CardTitle>
                      <Badge variant={session.status === 'upcoming' ? 'default' : 'secondary'}>
                        {session.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      {new Date(session.scheduledTime).toLocaleDateString()} at{' '}
                      {new Date(session.scheduledTime).toLocaleTimeString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">{session.description}</p>
                      <Button variant={session.status === 'upcoming' ? 'cta' : 'outline'}>
                        {session.status === 'upcoming' ? 'Join Session' : 'View Recording'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )) || (
                <Card>
                  <CardContent className="text-center py-8">
                    <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Mentorship sessions will appear here.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="strategies">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content?.advancedStrategies?.map((strategy, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Badge variant="secondary" className="w-fit mb-2">
                      {strategy.category}
                    </Badge>
                    <CardTitle className="text-lg">{strategy.title}</CardTitle>
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
                        <Badge variant={strategy.riskLevel === 'Low' ? 'secondary' : 'outline'}>
                          {strategy.riskLevel}
                        </Badge>
                      </div>
                      <Button variant="cta" size="sm" className="w-full">
                        Learn Strategy
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )) || (
                <Card className="col-span-full">
                  <CardContent className="text-center py-8">
                    <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Advanced strategies will appear here.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="signals">
            <div className="space-y-4">
              {content?.signals?.map((signal, index) => (
                <Card key={index} className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{signal.pair}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={signal.direction === 'BUY' ? 'bg-green-500' : 'bg-red-500'}>
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
                        <span className="text-muted-foreground">Take Profit: </span>
                        <span className="font-medium text-green-500">{signal.takeProfit}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Stop Loss: </span>
                        <span className="font-medium text-red-500">{signal.stopLoss}</span>
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
                    <p className="text-muted-foreground">Premium signals will appear here.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="challenges">
            <div className="space-y-4">
              {content?.challenges?.map((challenge, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="w-5 h-5 text-purple-500" />
                        {challenge.title}
                      </CardTitle>
                      <Badge variant={challenge.status === 'active' ? 'default' : 'secondary'}>
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
                        <div 
                          className="bg-purple-500 h-2 rounded-full transition-all"
                          style={{ width: `${challenge.progress}%` }}
                        ></div>
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
              )) || (
                <Card>
                  <CardContent className="text-center py-8">
                    <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Monthly challenges will appear here.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};