import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Users,
  CheckCircle,
  BarChart3,
  MessageSquare,
  Target,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { ProgramCards } from "@/components/ProgramCards";
import dashboardImg from "@/assets/dashboard.png"; // adjust filename

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Award, BookOpen, Star, Clock, Shield, Zap } from "lucide-react";
import heroImage from "@/assets/hero-forex-academy.jpg";

const Index = () => {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
        }
      });
    }, observerOptions);

    // Observe all scroll animation elements
    const scrollElements = document.querySelectorAll(
      ".scroll-fade-in, .scroll-slide-left, .scroll-slide-right, .scroll-scale-up"
    );
    scrollElements.forEach((el) => observer.observe(el));

    return () => {
      scrollElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const handleEnrollClick = () => {
    // Scroll to programs section
    document.getElementById("programs")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleJoinCommunityClick = () => {
    // Placeholder for community signup
    alert("Community signup feature coming soon!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section - Enhanced Modern Design */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background/95 to-background/90 mt-16 sm:mt-20">
        {/* Dynamic Background Image with Enhanced Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/85 to-background/75 dark:from-slate-900/95 dark:via-slate-900/85 dark:to-slate-800/75" />

        {/* Enhanced Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Primary Gradient Orbs with Enhanced Glow */}
          <div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-radial from-primary/15 via-primary/10 to-transparent rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: "4s" }}
          />
          <div
            className="absolute top-1/2 right-1/4 w-48 h-48 bg-gradient-radial from-emerald-500/12 via-primary/8 to-transparent rounded-full blur-2xl animate-pulse"
            style={{ animationDuration: "5s", animationDelay: "1s" }}
          />
          <div
            className="absolute bottom-1/4 left-1/2 w-40 h-40 bg-gradient-radial from-green-400/10 via-emerald-400/8 to-transparent rounded-full blur-xl animate-pulse"
            style={{ animationDuration: "6s", animationDelay: "2s" }}
          />

          {/* Accent Light Orbs */}
          <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-gradient-radial from-yellow-400/15 to-transparent rounded-full blur-2xl floating-animation" />
          <div
            className="absolute bottom-1/3 left-1/3 w-36 h-36 bg-gradient-radial from-blue-400/10 to-transparent rounded-full blur-xl floating-animation"
            style={{ animationDelay: "2s" }}
          />

          {/* Modern Light Beams */}
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent transform rotate-12 slow-drift" />
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-emerald-400/15 to-transparent transform -rotate-12 slow-drift-reverse" />

          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:50px_50px] dark:bg-[linear-gradient(rgba(34,197,94,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.05)_1px,transparent_1px)]" />
        </div>

        {/* Main Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-0 sm:px-1 py-8 sm:py-12 lg:py-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 2xl:gap-20 items-center">
            {/* Left Column - Main Content */}
            <div className="text-center lg:text-left space-y-6">
              {/* Announcement Badge */}
              <div className="scroll-fade-in">
                <Badge className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-emerald-500/10 border border-primary/20 text-primary hover:shadow-glow transition-all duration-300 hover:scale-105">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  🎯 Limited Cohort Opening - December 2024
                </Badge>
              </div>

              {/* Main Headline */}
              <div className="space-y-4 scroll-slide-left">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight">
                  Turn Charts into
                  <span className="block bg-gradient-to-r from-primary via-emerald-500 to-primary bg-clip-text text-transparent animate-pulse">
                    Cash Flow
                  </span>
                  <span className="block text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-muted-foreground font-medium mt-2">
                    with Market Mobsters
                  </span>
                </h1>
              </div>

              {/* Subtitle */}
              <div className="scroll-slide-right">
                <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  From zero to market legend in just 6 months. Our proven system
                  has created
                  <span className="text-primary font-semibold">
                    {" "}
                    thousands of profitable traders
                  </span>{" "}
                  who live the life most only dream of.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start scroll-scale-up">
                <Button
                  size="lg"
                  onClick={handleEnrollClick}
                  className="group relative overflow-hidden bg-gradient-to-r from-primary to-emerald-500 hover:from-primary-dark hover:to-emerald-600 text-white border-0 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-glow-lg transform hover:scale-105 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <TrendingUp className="mr-2 w-6 h-6" />
                  Start Your Journey
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleJoinCommunityClick}
                  className="group border-2 border-primary/30 hover:border-primary hover:bg-primary/5 text-foreground px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm hover:shadow-md transform hover:scale-105 transition-all duration-300"
                >
                  <Users className="mr-2 w-6 h-6" />
                  Join Free Community
                </Button>
              </div>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start scroll-fade-in">
                {[
                  { icon: CheckCircle, text: "6-Month Structured Program" },
                  { icon: CheckCircle, text: "Weekly Live Sessions" },
                  { icon: CheckCircle, text: "Personal Trading Plan" },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 dark:bg-slate-800/30 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-full hover:bg-white/20 dark:hover:bg-slate-800/50 transition-all duration-300 hover:scale-105"
                  >
                    <feature.icon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground/80">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Visual Elements */}
            <div className="relative lg:block hidden">
              <div className="scroll-scale-up">
                {/* Main Visual Card */}
                <div className="relative z-50">
                  {/* Floating Stats Cards */}
                  <div
                    className="absolute -top-24 -left-24 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 z-60"
                    style={{ animation: "pulse 4s ease-in-out infinite" }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-foreground">
                          80%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Win rate strategies
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="absolute -bottom-24 -right-24 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 z-60"
                    style={{
                      animation: "pulse 4s ease-in-out infinite",
                      animationDelay: "2s",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-foreground">
                          Weekly
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Live sessions
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Central Chart Visual */}
                  <div className="relative z-70">
                    <div className="absolute inset-0 bg-white dark:bg-slate-800 rounded-3xl opacity-95"></div>
                    <div className="relative bg-gradient-to-br from-white/95 to-white/90 dark:from-slate-800/95 dark:to-slate-900/90 backdrop-blur-xl border border-white/30 dark:border-slate-700/50 rounded-3xl p-8 shadow-2xl">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-8 h-8 text-primary" />
                            <div>
                              <div className="font-semibold text-foreground">
                                Advanced Trading Journal
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Track your progress
                              </div>
                            </div>
                          </div>
                          <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            Verified
                          </Badge>
                        </div>

                        {/* Dashboard Image filling the remaining space */}
                        <div className="relative w-full h-full">
                          <img
                            src={dashboardImg}
                            alt="Dashboard"
                            className="object-cover w-full h-full rounded-xl"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Programs Section */}
      <section
        id="programs"
        className="py-24 px-0.5 sm:px-1 bg-gradient-to-br from-background via-green-50/20 to-emerald-50/20 dark:from-background dark:via-slate-900/50 dark:to-slate-800/30 relative overflow-hidden"
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-green-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-green-400/5 rounded-full blur-xl"></div>

          {/* Crossing light beams */}
          <div className="absolute top-0 left-1/3 w-1 h-full bg-gradient-to-b from-green-300/12 via-transparent to-emerald-300/8 transform rotate-10 slow-drift"></div>
          <div className="absolute top-0 right-1/3 w-1 h-full bg-gradient-to-b from-emerald-300/12 via-transparent to-green-300/8 transform -rotate-10 slow-drift-reverse"></div>
          <div className="absolute left-0 top-1/3 w-full h-1 bg-gradient-to-r from-green-200/6 via-emerald-300/12 to-transparent transform rotate-1 slow-horizontal-drift"></div>
          <div className="absolute right-0 bottom-1/3 w-full h-1 bg-gradient-to-l from-emerald-200/6 via-green-300/10 to-transparent transform -rotate-1 slow-horizontal-drift-reverse"></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Choose Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400">
                Trading Journey
              </span>
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              From comprehensive academy training to ongoing mentorship and free
              community access - we have the perfect program for your trading
              goals.
            </p>
          </div>

          <ProgramCards />
        </div>
      </section>

      {/* Comprehensive Academy Services Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-0.5 sm:px-1 bg-gradient-to-br from-background via-accent/30 to-background relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-gradient-radial from-primary/15 via-primary/10 to-transparent rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-radial from-emerald-500/10 via-emerald-400/5 to-transparent rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 scroll-fade-in">
            <Badge className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-emerald-500/10 border border-primary/20 text-primary mb-6">
              <TrendingUp className="w-4 h-4" />
              Comprehensive Trading Education
            </Badge>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center leading-tight mb-6 scroll-fade-in">
              Unlock Your Financial Freedom with
              <span className="block bg-gradient-to-r from-primary via-emerald-500 to-primary bg-clip-text text-transparent">
                Mobsters Academy Programs
              </span>
            </h1>

            <p
              className="text-lg sm:text-xl text-muted-foreground text-center max-w-3xl mx-auto mb-10 scroll-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              Imagine trading with confidence, building wealth on your terms,
              and finally breaking free from financial uncertainty. Our programs
              give you the roadmap, proven strategies, and community support to
              become a disciplined, profitable trader and design the life you’ve
              always dreamed of.
            </p>
          </div>

          {/* Services Grid */}

          {/* Call to Action */}
          <div className="text-center scroll-scale-up">
            <div className="bg-gradient-to-r from-primary/10 via-emerald-500/10 to-primary/10 border border-primary/20 rounded-2xl p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                Ready to Transform Your Trading Career?
              </h3>
              <p className="text-muted-foreground mb-6 text-lg">
                Join the Mobsters Academy to access structured programs, live
                mentorship, and tools to finally trade consistently and
                profitably.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={handleEnrollClick}
                  className="bg-gradient-to-r from-primary to-emerald-500 hover:from-primary-dark hover:to-emerald-600 text-white border-0 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-glow-lg transform hover:scale-105 transition-all duration-300"
                >
                  <TrendingUp className="mr-2 w-6 h-6" />
                  Start Your Journey Today
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleJoinCommunityClick}
                  className="border-2 border-primary/30 hover:border-primary hover:bg-primary/5 text-foreground px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm hover:shadow-md transform hover:scale-105 transition-all duration-300"
                >
                  <Users className="mr-2 w-6 h-6" />
                  Explore Free Resources
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-0.5 sm:px-1 bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-green-50/50 dark:from-slate-900/50 dark:via-slate-800/30 dark:to-slate-900/50 relative overflow-hidden">
        {/* Enhanced background lighting elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* ...all existing background effects remain unchanged */}
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <div className="text-center group scroll-fade-in">
              <div className="glass-card rounded-xl p-6 hover-lift">
                <div className="heading-md gradient-text mb-2">2,500+</div>
                <div className="body-sm text-muted-foreground font-medium">
                  Traders Trained
                </div>
              </div>
            </div>
            <div
              className="text-center group scroll-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="glass-card rounded-xl p-6 hover-lift">
                <div className="heading-md gradient-text mb-2">89%</div>
                <div className="body-sm text-muted-foreground font-medium">
                  Consistent Success Rate
                </div>
              </div>
            </div>
            <div
              className="text-center group scroll-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-green-200/50 dark:border-slate-700/50 hover:border-green-400/60 dark:hover:border-green-500/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 shimmer-effect">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-2 group-hover:from-green-500 group-hover:to-emerald-500 transition-all glow-pulse">
                  24/7
                </div>
                <div className="text-muted-foreground font-medium text-sm sm:text-base">
                  Support & Mentorship
                </div>
              </div>
            </div>
            <div
              className="text-center group scroll-fade-in"
              style={{ animationDelay: "0.6s" }}
            >
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-green-200/50 dark:border-slate-700/50 hover:border-green-400/60 dark:hover:border-green-500/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 shimmer-effect">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-2 group-hover:from-green-500 group-hover:to-emerald-500 transition-all glow-pulse">
                  5★
                </div>
                <div className="text-muted-foreground font-medium text-sm sm:text-base">
                  Average Student Rating
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* From Learner To Market Leader Section */}
      <section className="py-24 px-0.5 sm:px-1 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-slate-900 dark:to-slate-800 relative overflow-hidden">
        {/* Background lighting elements remain unchanged */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* ...all existing background divs unchanged */}
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight scroll-slide-left">
                  From Learner To Market
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400">
                    Leader
                  </span>
                </h2>

                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8 scroll-slide-right">
                  <span className="text-yellow-600 dark:text-yellow-400 font-semibold">
                    Mobsters Academy
                  </span>{" "}
                  turns aspiring traders into profitable market leaders. With
                  structured mentorship, advanced strategies, and disciplined
                  trading routines, our students achieve consistent results and
                  financial freedom.
                </p>
              </div>

              {/* Achievement Badges */}
              <div className="flex flex-wrap gap-4 scroll-fade-in">
                <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-yellow-400 font-medium text-sm">
                    $250K+ in Payouts
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 font-medium text-sm">
                    $1M+ in Funding
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-blue-400 font-medium text-sm">
                    3+ Years of Mentorship Experience
                  </span>
                </div>
              </div>

              {/* Trusted & Certified By */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Trusted & Certified By
                </h3>

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
                      <div className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider font-semibold">
                        FTMO
                      </div>
                      <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                        <div className="w-4 h-4 bg-green-500 dark:bg-green-400 rounded-sm"></div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                      Overall Rewards
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      $24,012.24
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                      <span className="group-hover:text-gray-700 dark:group-hover:text-gray-400 transition-colors">
                        Verified Account
                      </span>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          Live
                        </span>
                      </div>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </a>

                  {/* Performance Card */}
                  <a
                    href="https://ftmo.com/en/certificates"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative bg-gradient-to-br from-slate-200/95 to-slate-100/95 dark:from-slate-800/80 dark:to-slate-700/80 backdrop-blur-sm border border-slate-300/50 dark:border-slate-700/50 rounded-2xl p-6 hover:border-green-500/50 transition-all duration-300 group cursor-pointer hover:shadow-2xl hover:-translate-y-1"
                  >
                    <div className="text-6xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      92%
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-300 transition-colors font-medium">
                      Win Rate
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="w-3 h-3 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"></div>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </a>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-green-600 hover:bg-green-700 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-white border border-green-600 dark:border-slate-600 backdrop-blur-sm transition-all duration-300">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  See Real Trading Results
                </Button>
                <Button
                  variant="outline"
                  className="border-green-600 dark:border-slate-600 text-green-700 dark:text-white hover:bg-green-50 dark:hover:bg-slate-800/50 backdrop-blur-sm transition-all duration-300"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Watch Our Students' Success Stories
                </Button>
              </div>
            </div>

            {/* Right Content - Profile Image remains unchanged */}
            <div className="relative">
              <div className="relative">
                {/* Profile Image Container unchanged */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-0.5 sm:px-1 bg-gradient-to-br from-background via-green-50/20 to-emerald-50/20 dark:from-background dark:via-slate-900/50 dark:to-slate-800/30 relative overflow-hidden">
        {/* Background decorative elements remain unchanged */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* ...existing background divs */}
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Why Choose{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                Mobsters Academy
              </span>
              ?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our structured approach, mentorship, and practical training ensure
              you master the market and achieve consistent trading success.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Structured Learning Path",
                description:
                  "Step-by-step curriculum from beginner to expert trading strategies, ensuring mastery and confidence.",
              },
              {
                icon: Users,
                title: "Live Expert Mentorship",
                description:
                  "Weekly sessions with professional traders sharing real-time insights, market analysis, and winning strategies.",
              },
              {
                icon: Target,
                title: "Hands-On Trading Practice",
                description:
                  "Apply your skills in demo accounts and real markets, reinforcing learning through practical experience.",
              },
              {
                icon: BarChart3,
                title: "Risk Management Excellence",
                description:
                  "Learn advanced risk management techniques to protect your capital and trade with confidence.",
              },
              {
                icon: MessageSquare,
                title: "Community & Peer Support",
                description:
                  "Join our exclusive student community to share ideas, strategies, and get feedback from mentors.",
              },
              {
                icon: Award,
                title: "Certification & Recognition",
                description:
                  "Complete your trading program and earn a professional certification recognized in the trading industry.",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-green-200/50 dark:border-slate-700/50 hover:border-green-400/60 dark:hover:border-green-500/60 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group rounded-2xl"
              >
                <CardHeader>
                  <div className="mb-4 p-4 rounded-2xl bg-gradient-to-br from-green-100/80 to-emerald-100/80 dark:from-green-900/30 dark:to-emerald-900/30 w-fit group-hover:from-green-200/80 group-hover:to-emerald-200/80 dark:group-hover:from-green-800/40 dark:group-hover:to-emerald-800/40 transition-all duration-300 shadow-lg">
                    <feature.icon className="w-8 h-8 text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors font-bold">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/90 transition-colors">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* CTA Section */}
      <section className="relative py-24 px-0.5 sm:px-1 overflow-hidden bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-green-50/50 dark:from-slate-900/50 dark:via-slate-800/30 dark:to-slate-900/50">
        {/* Background lighting & decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Central orbs */}
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-br from-green-400/15 via-emerald-500/25 to-green-600/15 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-gradient-to-br from-emerald-400/20 via-green-500/30 to-emerald-600/20 rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: "1.5s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 w-48 h-48 bg-gradient-to-br from-green-300/10 via-emerald-400/20 to-green-500/10 rounded-full blur-xl animate-pulse transform -translate-x-1/2 -translate-y-1/2"
            style={{ animationDelay: "3s" }}
          ></div>

          {/* Radial light beams */}
          <div className="absolute top-1/2 left-1/2 w-96 h-1 bg-gradient-to-r from-transparent via-green-400/20 to-transparent transform -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-1 bg-gradient-to-r from-transparent via-emerald-400/15 to-transparent transform -translate-x-1/2 -translate-y-1/2 -rotate-45"></div>

          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-yellow-400/10 to-transparent rounded-full blur-xl"></div>
          <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-blue-400/8 to-transparent rounded-full blur-xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400/6 to-transparent rounded-full blur-xl"></div>
          <div className="absolute bottom-0 right-0 w-36 h-36 bg-gradient-to-tl from-pink-400/8 to-transparent rounded-full blur-xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Header & CTA text */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-green-200/50 dark:border-slate-700/50 shadow-lg">
              <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Limited Time Offer
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 text-balance leading-tight">
              Ready to Start Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400">
                Trading Journey?
              </span>
            </h2>

            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto text-pretty leading-relaxed">
              Join our next cohort starting December 2024. Transform your
              financial future with expert guidance.
            </p>
          </div>

          {/* Action buttons */}
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

          {/* Guarantee / Features grid */}
          {/* CTA Section — Perks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: Shield, // could replace with a different icon, e.g. ChartLine or Lightning
                title: "Lifetime Course Access",
                subtitle: "Replay lessons anytime",
              },
              {
                icon: Users,
                title: "Trader Community Access",
                subtitle: "Connect & learn with peers",
              },
              {
                icon: Star,
                title: "Weekly Market Breakdown",
                subtitle: "Stay ahead of market moves",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border border-green-200/50 dark:border-slate-700/50 hover:border-green-400/60 dark:hover:border-green-500/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-100/80 to-emerald-100/80 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl flex items-center justify-center group-hover:from-green-200/80 group-hover:to-emerald-200/80 dark:group-hover:from-green-800/40 dark:group-hover:to-emerald-800/40 transition-all duration-300 shadow-lg">
                  <item.icon className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-gray-900 dark:text-white font-bold text-lg">
                  {item.title}
                </span>
                <span className="text-gray-600 dark:text-gray-300 text-sm text-center leading-relaxed">
                  {item.subtitle}
                </span>
              </div>
            ))}
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
