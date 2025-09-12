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
        <div className="relative max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <Badge className="mb-6 bg-primary/20 text-primary-dark border-primary/30">
              🎯 Limited Cohort Opening - December 2024
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
              Master Forex Trading with
              <span className="bg-gradient-primary bg-clip-text text-transparent"> Mobsters Academy</span>
            </h1>
            
            <p className="text-xl text-primary-foreground/80 mb-8 leading-relaxed">
              Transform from beginner to professional trader with our comprehensive 6-month program. 
              Join thousands of successful traders who've mastered the markets.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button variant="cta" size="xl" onClick={handleEnrollClick}>
                <TrendingUp className="mr-2" />
                Enroll in Academy
              </Button>
              <Button variant="outline-primary" size="xl" onClick={handleJoinCommunityClick}>
                <Users className="mr-2" />
                Join Free Community
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-8 text-primary-foreground/90">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span>6-Month Structured Program</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span>Weekly Live Sessions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span>Personal Trading Plan</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-accent/80">
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
      <section id="programs" className="py-24 px-6 bg-accent/30">
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
      <section className="py-24 px-6 bg-gradient-card bg-accent/50">
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
              <Card key={index} className="shadow-soft hover:shadow-medium transition-all duration-300 border-border/50">
                <CardHeader>
                  <feature.icon className="w-12 h-12 text-primary mb-4" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* CTA Section */}
<section className="relative py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.1),transparent_50%)] bg-[radial-gradient(circle_at_70%_80%,rgba(5,150,105,0.08),transparent_50%)]" />

      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,#059669_1px,transparent_1px)] bg-[length:24px_24px]" />

      <div className="relative max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <TrendingUp className="w-4 h-4" />
            Next Cohort Starting December 2024
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Ready to Start Your{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
              Trading Journey?
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-pretty max-w-3xl mx-auto">
            Join our exclusive forex trading program and transform your financial future with expert guidance and proven
            strategies.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            size="lg"
            className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white shadow-lg shadow-emerald-500/25 px-8 py-6 text-lg font-semibold"
            onClick={handleEnrollClick}
          >
            <Zap className="mr-2 w-5 h-5" />
            Enroll Now - $497
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 px-8 py-6 text-lg font-semibold bg-transparent"
          >
            <Clock className="mr-2 w-5 h-5" />
            Join Waitlist
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="flex flex-col items-center gap-3 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-emerald-100 shadow-sm">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-foreground mb-1">Money Back Guarantee</h3>
              <p className="text-sm text-muted-foreground">30-day full refund policy</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-emerald-100 shadow-sm">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-foreground mb-1">Limited Seats</h3>
              <p className="text-sm text-muted-foreground">Beginner menotship happnes only twice a year, book yours early</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-emerald-100 shadow-sm">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-foreground mb-1">Expert Support</h3>
              <p className="text-sm text-muted-foreground">Direct access to mentors</p>
            </div>
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