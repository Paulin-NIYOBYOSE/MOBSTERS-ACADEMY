"use client";
import { useState } from "react";
import { ArrowUpRight, Play, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { PricingPlans } from "@/lib/pricing";

export default function Home() {
  // Filter to only show mentorship plans
  const mentorshipPlans = PricingPlans.filter(plan => plan.type === "mentorship");

  const features = [
    {
      title: "Live Trading Sessions",
      description: "Access live market data and execute trades instantly",
      icon: "/video.svg",
    },
    {
      title: "Live Video Calls",
      description: "Weekly interactive sessions with trading experts",
      icon: "/video.svg",
    },
    {
      title: "Traders Support Group",
      description: "Join a team of 1000+ like-minded traders",
      icon: "/video.svg",
    },
    {
      title: "Weekly A+ Setups",
      description: "We provide market weekly analysis every Sunday",
      icon: "/video.svg",
    },
    {
      title: "Trading Competitions",
      description: "We award top traders monthly based on performance metrics",
      icon: "/video.svg",
    },
  ];

  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);

  const advisors = [
    {
      name: "Niyobyose Paulin",
      role: "Trading Expert",
      image: "/Paulin.png",
    },
    {
      name: "Niyobyose Paulin",
      role: "Trading Expert",
      image: "/Paulin.png",
    },
    {
      name: "Niyobyose Paulin",
      role: "Trading Expert",
      image: "/Paulin.png",
    },
    {
      name: "Niyobyose Paulin",
      role: "Trading Expert",
      image: "/Paulin.png",
    },
  ];

  return (
    <div className="bg-[#002419] text-white md:px-20">
      {/* Hero Section */}
      <section className="container mx-auto p-4 mt-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Born To Trade{" "}
              <span className="text-[#00DC82]">Built to flex</span>
            </h1>
            <p className="text-gray-300 text-xl">
              Master the charts, rule the market, and stack your wealth with
              Forex Mobsters. Learn strategy, precision, and pro-level trading
              to turn risks into rewards. Join us and level up your forex game!
            </p>
            <div className="flex flex-wrap gap-6">
              <Button
                size="lg"
                className="bg-[#00DC82] text-[#002419] hover:bg-[#00DC82]/90 text-lg"
              >
                Get Started <ArrowUpRight className="ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg">
                <Play className="mr-2" /> Watch Video
              </Button>
            </div>
          </div>
          <div className="relative h-[500px] border-[#63f7b9]">
            <Image
              src="/hero.png"
              alt="Trading Platform"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* Company Section */}
      <section className="container mx-auto p-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">
              Meet Our Company Unless Miss The Opportunity
            </h2>
            <p className="text-gray-300 text-xl">
              Forex Mobsters Academy offers expert training in forex trading,
              covering market analysis, risk management, trading psychology, and
              live trading sessions. We equip traders with the skills and
              strategies needed to navigate the markets profitably and
              confidently.
            </p>
            <Button
              size="lg"
              className="bg-[#00DC82] text-[#002419] hover:bg-[#00DC82]/90 text-lg"
            >
              Learn More <ArrowRight className="ml-2" />
            </Button>
          </div>
          <div className="relative h-[500px]">
            <Image
              src="/candles.svg"
              alt="Company Overview"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto p-4 my-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">What We Offer</h2>
          <p className="text-gray-300 text-xl">
            Comprehensive trading education and support
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-[#003626] p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  width={40}
                  height={40}
                  className="mr-4"
                />
                <h3 className="text-2xl font-bold">{feature.title}</h3>
              </div>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto p-4 my-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Our Mentorship Programs
          </h2>
          <p className="text-gray-300 text-xl">
            Choose the perfect mentorship for your trading journey
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2 justify-center">
          {mentorshipPlans.map((plan, index) => (
            <div
              key={index}
              className={`bg-[#003626] p-8 rounded-lg transition-all duration-300 ${
                hoveredPlan === index ? "border-2 border-[#00DC82] transform scale-105" : "border border-[#003626]"
              }`}
              onMouseEnter={() => setHoveredPlan(index)}
              onMouseLeave={() => setHoveredPlan(null)}
            >
              <h3 className="text-3xl font-bold mb-4">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-5xl font-bold">${plan.price}</span>
                {plan.duration && (
                  <span className="text-gray-300 text-xl">/{plan.duration}</span>
                )}
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start text-lg">
                    <CheckCircle2 className="text-[#00DC82] mr-2 mt-1 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                size="lg"
                className={`w-full text-lg transition-colors ${
                  hoveredPlan === index
                    ? "bg-[#00DC82] text-[#002419] hover:bg-[#00DC82]/90"
                    : "bg-[#002419] text-white hover:bg-[#002419]/90 border border-[#00DC82]"
                }`}
              >
                Join Now
              </Button>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center mt-10">
          <Button
            variant="outline"
            className="text-lg border-[#00DC82] text-[#00DC82] hover:bg-[#00DC82]/10"
          >
            Compare All Plans
          </Button>
        </div>
      </section>

      {/* Advisors Section */}
      <section className="container mx-auto p-4 my-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Trading Experts</h2>
          <p className="text-gray-300 text-xl">
            Learn from experienced professionals in the field
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {advisors.map((advisor, index) => (
            <div key={index} className="bg-[#003626] rounded-lg overflow-hidden text-center p-6">
              <div className="relative h-48 w-48 mx-auto mb-4 rounded-full overflow-hidden border-2 border-[#00DC82]">
                <Image
                  src={advisor.image}
                  alt={advisor.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold">{advisor.name}</h3>
              <p className="text-gray-300">{advisor.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="container mx-auto md:px-4 my-16">
        <div className="bg-[#003626] rounded-lg p-12 md:p-16">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Subscribe To Our Newsletter
            </h2>
            <p className="text-gray-300 text-xl mb-10">
              Stay updated with our latest trading insights, market analysis, and exclusive offers
            </p>
            <div className="flex flex-col md:flex-row gap-6">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-lg bg-[#002419] text-white text-lg border border-gray-600 focus:outline-none focus:border-[#00DC82]"
              />
              <Button
                size="lg"
                className="bg-[#00DC82] text-[#002419] hover:bg-[#00DC82]/90 text-lg"
              >
                Subscribe Now
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}