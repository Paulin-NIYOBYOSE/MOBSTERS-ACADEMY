"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaymentModal } from "@/components/ui/payment-modal";
import { PricingPlans } from "@/lib/pricing";

export default function AllPlansPage() {
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<(typeof PricingPlans)[0] | null>(null);

  const mentorshipPlans = PricingPlans.filter((plan) => plan.type === "mentorship");
  const signalPlans = PricingPlans.filter((plan) => plan.type === "signal");

  const renderSection = (title: string, subtitle: string, plans: typeof PricingPlans) => (
    <section className="container mx-auto p-4 my-16">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">{title}</h2>
        <p className="text-gray-300 text-xl">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-2 justify-center px-20 ">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`bg-[#003626] p-8 rounded-lg transition-all duration-300 ${
              hoveredPlan === index
                ? "border-2 border-[#00DC82] transform scale-105"
                : "border border-[#003626]"
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
              onClick={() => setSelectedPlan(plan)}
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
  );

  return (
    <div className="min-h-screen bg-[#002419]/80 text-white py-8">
      {/* Mentorship Section */}
      {renderSection(
        "Our Mentorship Programs",
        "Choose the perfect mentorship for your trading journey",
        mentorshipPlans
      )}

      {/* Signal Section */}
      {renderSection(
        "Signal Plans",
        "Join the signal squad and get those daily pips",
        signalPlans
      )}

      {/* Modal */}
      {selectedPlan && (
        <PaymentModal
          isOpen={!!selectedPlan}
          onClose={() => setSelectedPlan(null)}
          plan={selectedPlan}
        />
      )}
    </div>
  );
}
