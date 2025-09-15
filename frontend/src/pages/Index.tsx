import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { ProgramCards } from '@/components/ProgramCards';
import { Testimonials } from '@/components/Testimonials';
import { FAQ } from '@/components/FAQ';
import { Footer } from '@/components/Footer';
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  Calendar, 
  MessageSquare, 
  Award,
  CheckCircle,
  Star,
  Target,
  BarChart3,
  Clock,
  Zap,
  Shield
} from 'lucide-react';
import heroImage from '@/assets/hero-forex-academy.jpg';

const Index = () => {
  const handleEnrollClick = () => {
    // Scroll to programs section
    document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleJoinCommunityClick = () => {
    // Placeholder for community signup
    alert('Community signup feature coming soon!');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section 
        className="relative py-24 px-6 bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-transparent"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-3xl floating-animation"></div>
          <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-success/10 rounded-full blur-2xl floating-animation" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-1/4 left-1/2 w-20 h-20 bg-primary/5 rounded-full blur-xl floating-animation" style={{ animationDelay: '4s' }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <Badge className="mb-6 bg-primary/20 text-primary-dark border-primary/30 hover-lift">
              🎯 Limited Cohort Opening - December 2024
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
              Master Forex Trading with
              <span className="gradient-text block mt-2"> Mobsters Academy</span>
            </h1>
            
            <p className="text-xl text-primary-foreground/90 mb-8 leading-relaxed">
              Transform from beginner to professional trader with our comprehensive 6-month program. 
              Join thousands of successful traders who've mastered the markets.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button variant="cta" size="xl" onClick={handleEnrollClick} className="hover-lift">
                <TrendingUp className="mr-2" />
                Enroll in Academy
              </Button>
              <Button variant="outline-primary" size="xl" onClick={handleJoinCommunityClick} className="hover-lift">
                <Users className="mr-2" />
                Join Free Community
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-8 text-primary-foreground/90">
              <div className="flex items-center gap-2 hover-lift">
                <CheckCircle className="w-5 h-5 text-success" />
                <span>6-Month Structured Program</span>
              </div>
              <div className="flex items-center gap-2 hover-lift">
                <CheckCircle className="w-5 h-5 text-success" />
                <span>Weekly Live Sessions</span>
              </div>
              <div className="flex items-center gap-2 hover-lift">
                <CheckCircle className="w-5 h-5 text-success" />
                <span>Personal Trading Plan</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-accent/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">2,500+</div>
              <div className="text-muted-foreground">Students Trained</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">89%</div>
              <div className="text-muted-foreground">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Support Available</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">5★</div>
              <div className="text-muted-foreground">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Choose Your Trading Journey
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From comprehensive academy training to ongoing mentorship and free community access - 
              we have the perfect program for your trading goals.
            </p>
          </div>
          
          <ProgramCards />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-gradient-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Why Choose Mobsters Academy?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our proven methodology and comprehensive approach sets you up for trading success.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Structured Learning Path",
                description: "Progressive curriculum from basics to advanced strategies, carefully designed for optimal learning retention."
              },
              {
                icon: Users,
                title: "Live Expert Guidance",
                description: "Weekly live sessions with professional traders sharing real market insights and strategies."
              },
              {
                icon: Target,
                title: "Practical Application",
                description: "Hands-on demo trading exercises and real market analysis to build confidence."
              },
              {
                icon: BarChart3,
                title: "Risk Management Focus",
                description: "Comprehensive risk management tools and strategies to protect your trading capital."
              },
              {
                icon: MessageSquare,
                title: "Community Support",
                description: "Access to exclusive trading community with fellow students and mentors."
              },
              {
                icon: Award,
                title: "Certification Program",
                description: "Complete your trading plan project and receive professional trading certification."
              }
            ].map((feature, index) => (
              <Card 
                key={index} 
                className="shadow-soft hover:shadow-medium transition-all duration-300 border-border/50 card-glow hover-lift group"
              >
                <CardHeader>
                  <div className="mb-4 p-3 rounded-lg bg-primary/10 w-fit group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* CTA Section */}
    <section className="relative py-24 px-6 overflow-hidden bg-gradient-to-br from-background via-muted/50 to-background">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent" />

      <div className="relative max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-primary/20">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Limited Time Offer</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance leading-tight">
            Ready to Start Your
            <span className="block text-primary">Trading Journey?</span>
          </h2>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty leading-relaxed">
            Join our next cohort starting December 2024. Transform your financial future with expert guidance.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            onClick={handleEnrollClick}
          >
            <Zap className="mr-2 w-5 h-5" />
            Enroll Now - $497
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="border-primary text-primary hover:bg-primary/5 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 bg-transparent"
          >
            <Clock className="mr-2 w-5 h-5" />
            Join Waitlist
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="flex flex-col items-center gap-3 bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-colors duration-300">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <span className="text-card-foreground font-semibold">30-Day Money Back</span>
            <span className="text-muted-foreground text-sm text-center">Risk-free guarantee</span>
          </div>

          <div className="flex flex-col items-center gap-3 bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-colors duration-300">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <span className="text-card-foreground font-semibold">Only 50 Seats</span>
            <span className="text-muted-foreground text-sm text-center">Limited availability</span>
          </div>

          <div className="flex flex-col items-center gap-3 bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-colors duration-300">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-primary" />
            </div>
            <span className="text-card-foreground font-semibold">Expert Mentorship</span>
            <span className="text-muted-foreground text-sm text-center">1-on-1 guidance included</span>
          </div>
        </div>
      </div>
    </section>

      {/* FAQ Section */}
      <FAQ />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;