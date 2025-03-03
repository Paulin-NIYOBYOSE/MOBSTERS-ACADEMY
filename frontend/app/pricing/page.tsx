"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ServicesPage() {
  const router = useRouter();
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);

  const PricingPlans = [
    {
      name: "Basic Mentorship",
      price: "97",
      duration: "3 Months",
      features: [
        "✅ Full access to recorded videos",
        "✅ Sunday recap and Review",
        "✅ My Whole Strategy",
        "✅ My private community",
        "✅ 60 minutes group call for Q/A",
      ],
    },
    {
      name: "Pro Mentorship",
      price: "199",
      duration: "6 Months",
      features: [
        "✅ All Basic Plan features",
        "✅ 1-on-1 mentorship (30min/month)",
        "✅ Deep-dive analysis on student trades",
      ],
    },
    {
      name: "Elite Mentorship",
      price: "399",
      duration: "Lifetime",
      features: [
        "✅ All Pro Plan features",
        "✅ 1-on-1 mentorship twice a week",
        "✅ Personalized trading roadmap",
        "✅ Strategy for passing prop firms",
      ],
    },
    {
      name: "Signal Plan - 1 Month",
      price: "19",
      features: [
        "📈 Access to daily forex signals",
        "📩 Email notifications",
        "✅ Basic support",
      ],
    },
    {
      name: "Signal Plan - 3 Months",
      price: "55",
      features: [
        "📈 Access to daily forex signals",
        "📩 Email notifications",
        "✅ Priority support",
        "📊 Exclusive analysis tools",
      ],
    },
    {
      name: "Signal Plan - 1 Year",
      price: "145",
      features: [
        "📈 Access to daily forex signals",
        "📩 Email notifications",
        "✅ Priority support",
        "📊 Exclusive analysis tools",
        "📅 Yearly performance reports",
      ],
    },
  ];

  return (
    <div className="container mx-auto md:px-4 py-8 mt-5">
      <section className="container mx-auto p-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Our Pricing Plans
          </h2>
          <p className="text-gray-300 text-xl">
            Choose the perfect plan for your trading success
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {PricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`bg-[#003626] p-8 rounded-lg  ${
                hoveredPlan === index
                  ? " border-2 border-[#00DC82] shadow-xl"
                  : ""
              }`}
              onMouseEnter={() => setHoveredPlan(index)}
              onMouseLeave={() => setHoveredPlan(null)}
            >
              <h3 className="text-3xl font-bold mb-4">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold">${plan.price}</span>
                {plan.duration && (
                  <span className="text-gray-300 text-xl">
                    /{plan.duration}
                  </span>
                )}
              </div>
              <ul className="space-y-2 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-lg">
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                size="lg"
                onClick={() =>
                  router.push(
                    `/payment?plan=${encodeURIComponent(plan.name)}&price=${
                      plan.price
                    }`
                  )
                }
                className={`w-full text-lg ${
                  hoveredPlan === index
                    ? "bg-[#00dc80dd] text-[#002419] hover:bg-[#00DC82]/90"
                    : "bg-[#002419] text-white hover:bg-[#002419]/90"
                }`}
              >
                Get Started
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
