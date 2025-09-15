import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Users, 
  Calendar, 
  MessageSquare, 
  Award,
  CheckCircle,
  Star,
  Zap,
  TrendingUp,
  Target,
  Clock,
  Gift
} from 'lucide-react';

export const ProgramCards = () => {
  const programs = [
    {
      id: 'academy',
      title: '6-Month Academy Program',
      price: '$497',
      originalPrice: '$697',
      badge: 'Most Popular',
      badgeVariant: 'success' as const,
      description: 'Complete beginner-to-advanced forex trading education',
      features: [
        'Structured video lessons (50+ hours)',
        'Comprehensive PDFs and resources',
        'Weekly live Zoom calls with experts',
        'Hands-on demo trading exercises',
        'Interactive quizzes and assignments',
        'Personal trading journal templates',
        'Final project: Complete trading plan',
        'Trading certification upon completion',
        'Lifetime access to materials',
        '6-month mentorship included'
      ],
      highlights: [
        'Cohorts open Dec 2024 & June 2025',
        'Limited to 50 students per cohort',
        '30-day money back guarantee'
      ],
      icon: Award,
      gradient: 'bg-gradient-hero'
    },
    {
      id: 'mentorship',
      title: 'Monthly Mentorship',
      price: '$97/month',
      originalPrice: null,
      badge: 'Ongoing Support',
      badgeVariant: 'default' as const,
      description: 'Continuous learning and advanced strategy development',
      features: [
        'Weekly live mentorship calls',
        'Advanced strategy library access',
        'Free educational signals daily',
        'In-depth market analysis',
        'Risk management tools & calculators',
        'Monthly trading challenges',
        'Access to past academy content',
        'Priority support in community',
        'Advanced trading indicators',
        'Market recap sessions'
      ],
      highlights: [
        'Cancel anytime',
        'Join existing community',
        'Perfect for academy graduates'
      ],
      icon: Users,
      gradient: 'bg-gradient-primary'
    },
    {
      id: 'community',
      title: 'Free Community & Signals',
      price: 'Free',
      originalPrice: null,
      badge: 'Get Started',
      badgeVariant: 'secondary' as const,
      description: 'Join our trading community and receive daily market insights',
      features: [
        'Daily forex signals with explanations',
        'Market recap and analysis',
        'Motivational trading tips',
        'Private Telegram/Discord access',
        'Basic risk management guides',
        'Community support and discussions',
        'Weekly market outlook',
        'Beginner-friendly resources'
      ],
      highlights: [
        'No commitment required',
        'Instant access',
        'Perfect for beginners'
      ],
      icon: MessageSquare,
      gradient: 'bg-gradient-card'
    }
  ];

  const handleEnrollClick = (programId: string) => {
    if (programId === 'community') {
      // For free community
      alert('Redirecting to Telegram/Discord signup...');
    } else {
      // For paid programs - would integrate with Stripe
      alert(`Enrolling in ${programId}... Payment integration coming soon!`);
    }
  };

  const handleWaitlistClick = () => {
    alert('Joining waitlist... Feature coming soon!');
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {programs.map((program, index) => (
        <Card 
          key={program.id} 
          className={`relative overflow-hidden shadow-medium hover:shadow-strong transition-all duration-300 border-2 ${
            program.id === 'academy' ? 'border-primary scale-105 lg:scale-110' : 'border-border/50'
          }`}
        >
          {program.badge && (
            <div className="absolute -right-12 top-6 rotate-45 w-32 py-1 bg-primary text-primary-foreground text-sm font-bold text-center">
              {program.badge}
            </div>
          )}
          
          <CardHeader className={`${program.gradient} text-primary-foreground p-6`}>
            <div className="flex items-center justify-between mb-4">
              <program.icon className="w-12 h-12" />
              <div className="text-right">
                <div className="text-3xl font-bold">{program.price}</div>
                {program.originalPrice && (
                  <div className="text-sm line-through opacity-75">{program.originalPrice}</div>
                )}
              </div>
            </div>
            <CardTitle className="text-2xl font-bold mb-2">{program.title}</CardTitle>
            <CardDescription className="text-primary-foreground/90 text-lg">
              {program.description}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="space-y-4 mb-6">
              {program.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="space-y-3 mb-6">
              {program.highlights.map((highlight, idx) => (
                <div key={idx} className="flex items-center gap-2 text-primary font-medium">
                  <Star className="w-4 h-4" />
                  <span className="text-sm">{highlight}</span>
                </div>
              ))}
            </div>
            
            <div className="space-y-3">
              {program.id === 'academy' && (
                <>
                  <Button 
                    variant="cta" 
                    size="lg" 
                    className="w-full"
                    onClick={() => handleEnrollClick(program.id)}
                  >
                    <Zap className="mr-2" />
                    Enroll Now - Limited Seats
                  </Button>
                  <Button 
                    variant="outline-primary" 
                    size="lg" 
                    className="w-full"
                    onClick={handleWaitlistClick}
                  >
                    <Clock className="mr-2" />
                    Join Waitlist
                  </Button>
                </>
              )}
              
              {program.id === 'mentorship' && (
                <Button 
                  variant="premium" 
                  size="lg" 
                  className="w-full"
                  onClick={() => handleEnrollClick(program.id)}
                >
                  <TrendingUp className="mr-2" />
                  Start Mentorship
                </Button>
              )}
              
              {program.id === 'community' && (
                <Button 
                  variant="success" 
                  size="lg" 
                  className="w-full"
                  onClick={() => handleEnrollClick(program.id)}
                >
                  <Gift className="mr-2" />
                  Join Free Community
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};