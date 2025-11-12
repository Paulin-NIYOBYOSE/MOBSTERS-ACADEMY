"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  Users,
  MessageSquare,
  CheckCircle,
  Star,
  Zap,
  TrendingUp,
  Gift,
  Clock,
  Sparkles,
} from "lucide-react";

export const ProgramCards = () => {
  const programs = [
    {
      id: "academy",
      title: "6-Month Academy",
      subtitle: "Complete Trading Education",
      price: "$497",
      originalPrice: "$697",
      badge: "Most Popular",
      keyFeatures: [
        "50+ hours of structured lessons",
        "Weekly live mentorship calls",
        "Trading certification included",
        "Lifetime access to materials",
      ],
      highlight: "Limited to 50 students per cohort",
      icon: Award,
      popular: true,
    },
    {
      id: "mentorship",
      title: "Monthly Mentorship",
      subtitle: "Ongoing Expert Support",
      price: "$97",
      priceUnit: "/month",
      badge: "Ongoing Support",
      keyFeatures: [
        "Weekly live strategy sessions",
        "Advanced trading indicators",
        "Daily market analysis",
        "Priority community support",
      ],
      highlight: "Cancel anytime",
      icon: Users,
      popular: false,
    },
    {
      id: "community",
      title: "Free Community",
      subtitle: "Daily Signals & Support",
      price: "Free",
      badge: "Get Started",
      keyFeatures: [
        "Daily forex signals",
        "Market analysis & tips",
        "Community discussions",
        "Beginner resources",
      ],
      highlight: "No commitment required",
      icon: MessageSquare,
      popular: false,
    },
  ];

  const handleEnrollClick = (programId: string) => {
    window.location.href = "/register";
    // if (programId === "community") {
    //   alert("Redirecting to community signup...")
    // } else {
    //   alert(`Enrolling in ${programId}... Payment integration coming soon!`)
    // }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto" id="programs">
      {programs.map((program) => (
        <Card
          key={program.id}
          className={`relative overflow-hidden group hover-lift ${
            program.popular
              ? "border-2 border-primary shadow-xl ring-2 ring-primary/20 lg:scale-105"
              : "card-modern hover:border-primary/30"
          }`}
        >
          {/* Gradient overlay for popular card */}
          {program.popular && (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />
          )}

          {program.badge && (
            <div className="absolute top-4 right-4 z-10">
              <Badge
                variant={program.popular ? "default" : "secondary"}
                className={`shadow-md ${
                  program.popular ? "bg-gradient-primary text-white border-0" : ""
                }`}
              >
                {program.popular && <Sparkles className="w-3 h-3 mr-1" />}
                {program.badge}
              </Badge>
            </div>
          )}

          <CardHeader className="pb-6 relative">
            <div className="flex items-start justify-between mb-6">
              <div
                className={`p-3 rounded-xl shadow-sm transition-all duration-300 group-hover:scale-110 ${
                  program.popular 
                    ? "bg-gradient-primary text-white" 
                    : "bg-accent"
                }`}
              >
                <program.icon
                  className={`w-7 h-7 ${
                    program.popular ? "text-white" : "text-primary"
                  }`}
                />
              </div>
              <div className="text-right">
                <div className="heading-sm text-foreground">
                  {program.price}
                  {program.priceUnit && (
                    <span className="text-base font-normal text-muted-foreground">
                      {program.priceUnit}
                    </span>
                  )}
                </div>
                {program.originalPrice && (
                  <div className="text-sm line-through text-destructive/70 font-medium">
                    {program.originalPrice}
                  </div>
                )}
              </div>
            </div>

            <CardTitle className="heading-xs mb-2">
              {program.title}
            </CardTitle>
            <p className="body-sm text-muted-foreground">{program.subtitle}</p>
          </CardHeader>

          <CardContent className="pt-0 relative">
            <div className="space-y-3 mb-6">
              {program.keyFeatures.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3 group/item">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0 transition-transform group-hover/item:scale-110" />
                  <span className="body-sm text-card-foreground leading-relaxed">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/50 mb-6">
              <Star className="w-4 h-4 text-primary fill-primary" />
              <span className="text-sm font-medium text-foreground">{program.highlight}</span>
            </div>

            <div className="space-y-2">
              {program.id === "academy" && (
                <>
                  <Button
                    className="w-full btn-modern bg-gradient-primary hover:shadow-glow text-white border-0 font-semibold"
                    size="lg"
                    onClick={() => handleEnrollClick(program.id)}
                  >
                    <Zap className="mr-2 w-5 h-5" />
                    Enroll Now
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full btn-modern border-primary/50 text-primary hover:bg-primary/5 hover:border-primary"
                    onClick={() => (window.location.href = "/register")}
                  >
                    <Clock className="mr-2 w-4 h-4" />
                    Join Waitlist
                  </Button>
                </>
              )}

              {program.id === "mentorship" && (
                <Button
                  className="w-full btn-modern bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary-light text-white border-0 font-semibold hover:shadow-glow"
                  size="lg"
                  onClick={() => handleEnrollClick(program.id)}
                >
                  <TrendingUp className="mr-2 w-5 h-5" />
                  Start Mentorship
                </Button>
              )}

              {program.id === "community" && (
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full btn-modern border-primary/50 text-primary hover:bg-primary/5 hover:border-primary font-semibold"
                  onClick={() => handleEnrollClick(program.id)}
                >
                  <Gift className="mr-2 w-5 h-5" />
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
