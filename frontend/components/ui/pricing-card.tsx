"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PaymentModal } from "./payment-modal"
import { useRouter } from "next/navigation"

interface PricingCardProps {
  name: string
  price: string | number
  duration?: string
  features: string[]
  index: number
  hoveredPlan: number | null
  setHoveredPlan: (index: number | null) => void
}

export function PricingCard({ name, price, duration, features, index, hoveredPlan, setHoveredPlan }: PricingCardProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const router = useRouter()

  return (
    <>
      <div
        className={`bg-[#003626] p-8 rounded-lg ${hoveredPlan === index ? "border-2 border-[#00DC82] shadow-xl" : ""}`}
        onMouseEnter={() => setHoveredPlan(index)}
        onMouseLeave={() => setHoveredPlan(null)}
      >
        <h3 className="text-3xl font-bold mb-4">{name}</h3>
        <div className="mb-6">
          <span className="text-5xl font-bold">${price}</span>
          {duration && <span className="text-gray-300 text-xl">/{duration}</span>}
        </div>
        <ul className="space-y-2 mb-8">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center text-lg">
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <Button
          size="lg"
          onClick={() => setShowPaymentModal(true)}
          className={`w-full text-lg ${
            hoveredPlan === index
              ? "bg-[#00dc80dd] text-[#002419] hover:bg-[#00DC82]/90"
              : "bg-[#002419] text-white hover:bg-[#002419]/90"
          }`}
        >
          Get Started
        </Button>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        plan={{ name, price: String(price), duration }}
      />
    </>
  )
}

