"use client"

import { useState } from "react"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  plan: {
    name: string
    price: string
    duration?: string
  }
}

export function PaymentModal({ isOpen, onClose, plan }: PaymentModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    setIsLoading(true)
    // Simulated payment processing
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-[#002419] rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Complete Your Purchase</h2>
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">{plan.name}</h3>
          <p className="text-3xl font-bold">
            ${plan.price}
            {plan.duration && <span className="text-sm text-gray-300 ml-1">/{plan.duration}</span>}
          </p>
        </div>
        <div className="space-y-4 mb-6">
          <input
            type="text"
            placeholder="Card Number"
            className="w-full p-2 rounded bg-[#003626] border border-[#00DC82]/30"
          />
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="MM/YY"
              className="w-1/2 p-2 rounded bg-[#003626] border border-[#00DC82]/30"
            />
            <input
              type="text"
              placeholder="CVC"
              className="w-1/2 p-2 rounded bg-[#003626] border border-[#00DC82]/30"
            />
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-[#00DC82] hover:bg-[#00DC82]/90 text-[#002419] font-medium py-2 rounded"
        >
          {isLoading ? "Processing..." : "Pay Now"}
        </button>
        <button
          onClick={onClose}
          className="w-full mt-4 bg-transparent border border-[#00DC82]/30 text-[#00DC82] py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

