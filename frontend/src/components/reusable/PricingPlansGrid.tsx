import PricingPlan from "./PricingPlan"

export function PricingPlansGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4 py-10 bg-blue-50">
      <PricingPlan
        title="Yearly Plan"
        price="$599.00"
        description="Payments available"
        features={[
          "A free trading journal",
          "Advanced live trading sessions",
          "120 minutes call with a mentor",
          "Virtual graduation event",
          "Super Priority Instant Support",
        ]}
        ctaText="Choose this plan"
        ctaHref="#"
      />
      <PricingPlan
        title="6 Months Plan"
        price="$339.00"
        description="Payments available"
        features={[
          "A free trading journal",
          "Daily live trading session",
          "60 minutes group call with mentor",
          "Certificate of attendance",
          "Top priority support",
        ]}
        ctaText="Choose this plan"
        ctaHref="#"
      />
      <PricingPlan
        title="Monthly Plan"
        price="$75.00"
        description="Payments available"
        features={[
          "Full access to training videos",
          "Beginner and advanced live classes",
          "Free trade signals (Bonus)",
          "Private community",
          "Constant help and support",
        ]}
        ctaText="Choose this plan"
        ctaHref="#"
      />
      <PricingPlan
        title="3 Months Plan"
        price="$197.00"
        description="Payments available"
        features={[
          "A free trading journal",
          "Weekly live trading sessions",
          "Mentor's personal contact",
          "Free trading plan template",
          "Priority support",
        ]}
        ctaText="Choose this plan"
        ctaHref="#"
      />
    </div>
  )
}
