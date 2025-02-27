"use client"; // Required for hooks in App Router

import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation"; // ✅ Correct router import
import { useState } from "react";

export default function ServicesPage() {
  const router = useRouter(); // ✅ Must be inside the component
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);

  const PricingPlans = [
    {
      name: "Basic",
      price: "59",
      features: [
        "Basic trading features",
        "Market analysis tools",
        "Email support",
        "Basic reporting",
      ],
    },
    {
      name: "Pro",
      price: "199",
      features: [
        "Advanced trading features",
        "Premium analysis tools",
        "24/7 priority support",
        "Advanced reporting",
      ],
    },
    {
      name: "Enterprise",
      price: "299",
      features: [
        "Custom solutions",
        "Dedicated account manager",
        "API access",
        "Custom reporting",
      ],
    },
    {
      name: "Signal Plan - 1 Month",
      price: "19",
      features: [
        "Access to daily forex signals",
        "Email notifications",
        "Basic support",
      ],
    },
    {
      name: "Signal Plan - 3 Months",
      price: "55",
      features: [
        "Access to daily forex signals",
        "Email notifications",
        "Priority support",
        "Exclusive analysis tools",
      ],
    },
    {
      name: "Signal Plan - 1 Year",
      price: "145",
      features: [
        "Access to daily forex signals",
        "Email notifications",
        "Priority support",
        "Exclusive analysis tools",
        "Yearly performance reports",
      ],
    },
  ];

  return (
    <div className="container mx-auto md:px-4 py-8">
      <section className="container mx-auto p-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Our Pricing Plan
          </h2>
          <p className="text-gray-300 text-xl">
            Choose the perfect plan for your trading needs
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {PricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`bg-[#003626] p-10 rounded-lg transition-all duration-300 ${
                hoveredPlan === index
                  ? "transform scale-105 border-2 border-[#00DC82] shadow-xl"
                  : ""
              }`}
              onMouseEnter={() => setHoveredPlan(index)}
              onMouseLeave={() => setHoveredPlan(null)}
            >
              <h3 className="text-3xl font-bold mb-4">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold">${plan.price}</span>
                <span className="text-gray-300 text-xl">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-lg">
                    <CheckCircle2 className="text-[#00DC82] mr-3" size={24} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                size="lg"
                onClick={() =>
                  router.push(
                    `/payment?plan=${encodeURIComponent(
                      plan.name
                    )}&price=${plan.price}`
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
