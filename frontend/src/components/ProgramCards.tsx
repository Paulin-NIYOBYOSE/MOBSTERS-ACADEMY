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
} from "lucide-react";
import { link } from "fs";

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
    <div className="grid lg:grid-cols-3 gap-6 max-w-7xl mx-auto" id="programs">
      {programs.map((program) => (
        <Card
          key={program.id}
          className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
            program.popular
              ? "border-2 border-primary shadow-lg scale-105"
              : "border border-border hover:border-primary/50"
          }`}
        >
          {program.badge && (
            <div className="absolute top-1 right-4">
              <Badge
                variant={program.popular ? "default" : "secondary"}
                className={
                  program.popular ? "bg-primary text-primary-foreground" : ""
                }
              >
                {program.badge}
              </Badge>
            </div>
          )}

          <CardHeader className="pb-4">
            <div className="flex items-start justify-between mb-4">
              <div
                className={`p-3 rounded-lg ${
                  program.popular ? "bg-primary/10" : "bg-muted"
                }`}
              >
                <program.icon
                  className={`w-6 h-6 ${
                    program.popular ? "text-primary" : "text-muted-foreground"
                  }`}
                />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-foreground">
                  {program.price}
                  {program.priceUnit && (
                    <span className="text-lg font-normal text-muted-foreground">
                      {program.priceUnit}
                    </span>
                  )}
                </div>
                {program.originalPrice && (
                  <div className="text-sm line-through text-red-500">
                    {program.originalPrice}
                  </div>
                )}
              </div>
            </div>

            <CardTitle className="text-xl font-bold text-foreground mb-1">
              {program.title}
            </CardTitle>
            <p className="text-muted-foreground text-sm">{program.subtitle}</p>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="space-y-3 mb-6">
              {program.keyFeatures.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-card-foreground leading-relaxed">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 text-primary font-medium mb-6">
              <Star className="w-4 h-4" />
              <span className="text-sm">{program.highlight}</span>
            </div>

            <div className="space-y-3">
              {program.id === "academy" && (
                <>
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    size="lg"
                    onClick={() => handleEnrollClick(program.id)}
                  >
                    <Zap className="mr-2 w-4 h-4" />
                    Enroll Now
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full border-primary text-primary hover:bg-primary/5 bg-transparent"
                    onClick={() => (window.location.href = "/register")}
                  >
                    <Clock className="mr-2 w-4 h-4" />
                    Join Waitlist
                  </Button>
                </>
              )}

              {program.id === "mentorship" && (
                <Button
                  className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                  size="lg"
                  onClick={() => handleEnrollClick(program.id)}
                >
                  <TrendingUp className="mr-2 w-4 h-4" />
                  Start Mentorship
                </Button>
              )}

              {program.id === "community" && (
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full border-accent text-accent hover:bg-accent/5 bg-transparent"
                  onClick={() => handleEnrollClick(program.id)}
                >
                  <Gift className="mr-2 w-4 h-4" />
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
