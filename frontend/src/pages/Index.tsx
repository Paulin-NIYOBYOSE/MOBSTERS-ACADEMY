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
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 dark:from-slate-900/70 via-background/70 dark:via-slate-900/50 to-transparent"></div>
        
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
            
            <h1 className="text-5xl md:text-7xl font-bold text-foreground dark:text-white mb-6 leading-tight">
              Master Forex Trading with
              <span className="gradient-text block mt-2"> Mobsters Academy</span>
            </h1>
            
            <p className="text-xl text-foreground/90 dark:text-white/90 mb-8 leading-relaxed">
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
            
            <div className="flex flex-wrap gap-8 text-foreground/90 dark:text-white/90">
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
      <section className="py-20 bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-green-50/50 dark:from-slate-900/50 dark:via-slate-800/30 dark:to-slate-900/50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-green-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-green-200/50 dark:border-slate-700/50 hover:border-green-400/60 dark:hover:border-green-500/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-2 group-hover:from-green-500 group-hover:to-emerald-500 transition-all">2,500+</div>
                <div className="text-muted-foreground font-medium">Students Trained</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-green-200/50 dark:border-slate-700/50 hover:border-green-400/60 dark:hover:border-green-500/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-2 group-hover:from-green-500 group-hover:to-emerald-500 transition-all">89%</div>
                <div className="text-muted-foreground font-medium">Success Rate</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-green-200/50 dark:border-slate-700/50 hover:border-green-400/60 dark:hover:border-green-500/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-2 group-hover:from-green-500 group-hover:to-emerald-500 transition-all">24/7</div>
                <div className="text-muted-foreground font-medium">Support Available</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-green-200/50 dark:border-slate-700/50 hover:border-green-400/60 dark:hover:border-green-500/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-2 group-hover:from-green-500 group-hover:to-emerald-500 transition-all">5★</div>
                <div className="text-muted-foreground font-medium">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* From Learner To Market Leader Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-slate-900 dark:to-slate-800 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                  From Learner To Market
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400">
                    Leader
                  </span>
                </h2>
                
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                  <span className="text-yellow-600 dark:text-yellow-400 font-semibold">MobstersFX</span> has transformed knowledge into proven results. His journey is a 
                  testament that with the right mentorship, dedication, and discipline, 
                  financial independence is achievable.
                </p>
              </div>
              
              {/* Achievement Badges */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-yellow-400 font-medium text-sm">$250K+ in Payouts</span>
                </div>
                <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 font-medium text-sm">$1M+ in Funding</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-blue-400 font-medium text-sm">3+ Years Experience</span>
                </div>
              </div>
              
              {/* Trusted & Certified By */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Trusted & Certified By</h3>
                
                {/* Trading Results Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* FTMO Certificate Card */}
                  <a 
                    href="https://ftmo.com/en/certificates" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="relative bg-white/90 dark:bg-slate-800/80 backdrop-blur-sm border border-green-200/50 dark:border-slate-700/50 rounded-2xl p-6 hover:border-green-500/60 transition-all duration-300 group cursor-pointer hover:shadow-2xl hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider font-semibold">FTMO</div>
                      <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                        <div className="w-4 h-4 bg-green-500 dark:bg-green-400 rounded-sm"></div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">OVERALL REWARDS</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">$24,012.24</div>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                      <span className="group-hover:text-gray-700 dark:group-hover:text-gray-400 transition-colors">Verified Account</span>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-green-600 dark:text-green-400 font-medium">Live</span>
                      </div>
                    </div>
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </a>
                  
                  {/* Performance Card */}
                  <a 
                    href="https://ftmo.com/en/certificates" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="relative bg-gradient-to-br from-slate-200/95 to-slate-100/95 dark:from-slate-800/80 dark:to-slate-700/80 backdrop-blur-sm border border-slate-300/50 dark:border-slate-700/50 rounded-2xl p-6 hover:border-green-500/50 transition-all duration-300 group cursor-pointer hover:shadow-2xl hover:-translate-y-1"
                  >
                    <div className="text-6xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">92%</div>
                    <div className="text-sm text-gray-700 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-300 transition-colors font-medium">Win Rate</div>
                    <div className="absolute top-4 right-4">
                      <div className="w-3 h-3 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </a>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-green-600 hover:bg-green-700 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-white border border-green-600 dark:border-slate-600 backdrop-blur-sm transition-all duration-300">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Check My Trading Results
                </Button>
                <Button variant="outline" className="border-green-600 dark:border-slate-600 text-green-700 dark:text-white hover:bg-green-50 dark:hover:bg-slate-800/50 backdrop-blur-sm transition-all duration-300">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Watch My Interview
                </Button>
              </div>
            </div>
            
            {/* Right Content - Profile Image */}
            <div className="relative">
              <div className="relative">
                {/* Profile Image Container */}
                <div className="relative w-full max-w-md mx-auto">
                  <div className="aspect-[4/5] bg-gradient-to-br from-green-100 to-emerald-200 dark:from-slate-700 dark:to-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                    {/* Placeholder for profile image - replace with actual image */}
                    <div className="w-full h-full bg-gradient-to-br from-green-200 to-emerald-300 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center">
                      <div className="text-6xl text-green-600 dark:text-slate-400">👤</div>
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-500/30 dark:bg-green-500/20 rounded-full blur-xl"></div>
                  <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-emerald-500/20 dark:bg-emerald-500/10 rounded-full blur-2xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-24 px-6 bg-gradient-to-br from-background via-green-50/20 to-emerald-50/20 dark:from-background dark:via-slate-900/50 dark:to-slate-800/30 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-green-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-green-400/5 rounded-full blur-xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400">Trading Journey</span>
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              From comprehensive academy training to ongoing mentorship and free community access - 
              we have the perfect program for your trading goals.
            </p>
          </div>
          
          <ProgramCards />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-background via-green-50/20 to-emerald-50/20 dark:from-background dark:via-slate-900/50 dark:to-slate-800/30 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-green-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 left-1/4 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Mobsters Academy</span>?
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
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-green-200/50 dark:border-slate-700/50 hover:border-green-400/60 dark:hover:border-green-500/60 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group rounded-2xl"
              >
                <CardHeader>
                  <div className="mb-4 p-4 rounded-2xl bg-gradient-to-br from-green-100/80 to-emerald-100/80 dark:from-green-900/30 dark:to-emerald-900/30 w-fit group-hover:from-green-200/80 group-hover:to-emerald-200/80 dark:group-hover:from-green-800/40 dark:group-hover:to-emerald-800/40 transition-all duration-300 shadow-lg">
                    <feature.icon className="w-8 h-8 text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/90 transition-colors">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* CTA Section */}
    <section className="relative py-24 px-6 overflow-hidden bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-green-50/50 dark:from-slate-900/50 dark:via-slate-800/30 dark:to-slate-900/50">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-56 h-56 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-green-400/5 rounded-full blur-xl"></div>
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-green-200/50 dark:border-slate-700/50 shadow-lg">
            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Limited Time Offer</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 text-balance leading-tight">
            Ready to Start Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400">Trading Journey?</span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto text-pretty leading-relaxed">
            Join our next cohort starting December 2024. Transform your financial future with expert guidance.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            size="lg"
            className="bg-green-600 hover:bg-green-700 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-white border border-green-600 dark:border-slate-600 backdrop-blur-sm px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            onClick={handleEnrollClick}
          >
            <Zap className="mr-2 w-5 h-5" />
            Enroll Now - $497
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="border-green-600 dark:border-slate-600 text-green-700 dark:text-white hover:bg-green-50 dark:hover:bg-slate-800/50 backdrop-blur-sm px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300"
          >
            <Clock className="mr-2 w-5 h-5" />
            Join Waitlist
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="flex flex-col items-center gap-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border border-green-200/50 dark:border-slate-700/50 hover:border-green-400/60 dark:hover:border-green-500/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
            <div className="w-16 h-16 bg-gradient-to-br from-green-100/80 to-emerald-100/80 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl flex items-center justify-center group-hover:from-green-200/80 group-hover:to-emerald-200/80 dark:group-hover:from-green-800/40 dark:group-hover:to-emerald-800/40 transition-all duration-300 shadow-lg">
              <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-gray-900 dark:text-white font-bold text-lg">30-Day Money Back</span>
            <span className="text-gray-600 dark:text-gray-300 text-sm text-center leading-relaxed">Risk-free guarantee</span>
          </div>

          <div className="flex flex-col items-center gap-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border border-green-200/50 dark:border-slate-700/50 hover:border-green-400/60 dark:hover:border-green-500/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
            <div className="w-16 h-16 bg-gradient-to-br from-green-100/80 to-emerald-100/80 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl flex items-center justify-center group-hover:from-green-200/80 group-hover:to-emerald-200/80 dark:group-hover:from-green-800/40 dark:group-hover:to-emerald-800/40 transition-all duration-300 shadow-lg">
              <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-gray-900 dark:text-white font-bold text-lg">Only 50 Seats</span>
            <span className="text-gray-600 dark:text-gray-300 text-sm text-center leading-relaxed">Limited availability</span>
          </div>

          <div className="flex flex-col items-center gap-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border border-green-200/50 dark:border-slate-700/50 hover:border-green-400/60 dark:hover:border-green-500/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
            <div className="w-16 h-16 bg-gradient-to-br from-green-100/80 to-emerald-100/80 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl flex items-center justify-center group-hover:from-green-200/80 group-hover:to-emerald-200/80 dark:group-hover:from-green-800/40 dark:group-hover:to-emerald-800/40 transition-all duration-300 shadow-lg">
              <Star className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-gray-900 dark:text-white font-bold text-lg">Expert Mentorship</span>
            <span className="text-gray-600 dark:text-gray-300 text-sm text-center leading-relaxed">1-on-1 guidance included</span>
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