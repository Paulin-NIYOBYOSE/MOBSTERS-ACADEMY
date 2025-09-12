"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, CheckCircle, Zap, TrendingUp, Crown, Sparkles } from "lucide-react"

export const ProgramCards = () => {
  const programs = [
    {
      id: "academy",
      title: "6-Month Academy",
      price: "$199",
      originalPrice: "$229",
      badge: "BEGINNERS",
      description: "Complete forex mastery program",
      features: [
        "Full beginner to advanced course",
        "Weekly beginner mentorship calls",
        "Trading physcology lessons",
        "Risk management modules",
        "Weekly live analyis",
        "Access to private like-minded traders",
        "My full trading plan",
      ],
      icon: Crown,
      popular: true,
    },
    {
      id: "mentorship",
      title: "Monthly Mentorship",
      price: "$49",
      priceUnit: "/month",
      badge: "STRUGGLING TRADERS",
      description: "Advanced strategy development",
      features: [
        "My full trading plan",
        "Prop firm passing strategy",
        "Risk management and physcology modules",
        "Pre-weekly marktet analyis",
        "Well structured signals",
      ],
      icon: Sparkles,
      popular: false,
    },
    {
      id: "community",
      title: "Basic Access",
      price: "Free",
      badge: null,
      description: "Limited access",
      features: ["Free signals", "Community chat", "Free physcology tips"],
      icon: MessageSquare,
      popular: false,
    },
  ]

  const handleEnrollClick = (programId: string) => {
    if (programId === "community") {
      alert("Redirecting to basic community signup...")
    } else {
      alert(`Enrolling in ${programId}... Payment integration coming soon!`)
    }
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
      {programs.map((program, index) => (
        <Card
          key={program.id}
          className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${
            program.popular
              ? "border-2 border-primary shadow-2xl shadow-primary/25 scale-105"
              : program.id === "community"
                ? "border border-muted shadow-sm opacity-80"
                : "border border-border shadow-lg hover:shadow-xl"
          }`}
        >
          {program.badge && (
            <div
              className={`absolute -right-10 top-4 rotate-45 w-28 py-1 text-[9.5px] font-bold text-center z-10 ${
                program.popular ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
              }`}
            >
              {program.badge}
            </div>
          )}

          <CardHeader
            className={`${
              program.id === "academy"
                ? "bg-gradient-to-br from-primary via-primary to-accent text-primary-foreground"
                : program.id === "mentorship"
                  ? "bg-gradient-to-br from-secondary via-accent to-primary text-secondary-foreground"
                  : "bg-muted text-muted-foreground"
            } p-6 text-center`}
          >
            <div className="flex flex-col items-center mb-4">
              <program.icon
                className={`w-12 h-12 mb-3 ${program.id === "community" ? "text-muted-foreground" : "text-current"}`}
              />
              <div className="space-y-1">
                <div
                  className={`text-3xl font-bold ${program.id === "community" ? "text-muted-foreground" : "text-current"}`}
                >
                  {program.price}
                  {program.priceUnit && <span className="text-lg font-normal">{program.priceUnit}</span>}
                </div>
                {program.originalPrice && (
                  <div className="text-sm line-through opacity-75">{program.originalPrice}</div>
                )}
              </div>
            </div>
            <CardTitle
              className={`text-xl font-bold mb-2 ${program.id === "community" ? "text-muted-foreground" : "text-current"}`}
            >
              {program.title}
            </CardTitle>
            <CardDescription
              className={`${program.id === "community" ? "text-muted-foreground" : "text-current opacity-90"}`}
            >
              {program.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            <div className="space-y-3 mb-6">
              {program.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle
                    className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                      program.id === "community" ? "text-muted-foreground" : "text-primary"
                    }`}
                  />
                  <span
                    className={`text-sm ${program.id === "community" ? "text-muted-foreground" : "text-foreground"}`}
                  >
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {program.id === "academy" && (
                <Button
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 shadow-lg"
                  onClick={() => handleEnrollClick(program.id)}
                >
                  <Zap className="mr-2 w-4 h-4" />
                  Start Academy Now
                </Button>
              )}

              {program.id === "mentorship" && (
                <Button
                  size="lg"
                  className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold py-3 shadow-lg"
                  onClick={() => handleEnrollClick(program.id)}
                >
                  <TrendingUp className="mr-2 w-4 h-4" />
                  Join Mentorship
                </Button>
              )}

              {program.id === "community" && (
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full border-muted text-muted-foreground hover:bg-muted/50 py-3 bg-transparent"
                  onClick={() => handleEnrollClick(program.id)}
                >
                  <MessageSquare className="mr-2 w-4 h-4" />
                  Join Basic
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
