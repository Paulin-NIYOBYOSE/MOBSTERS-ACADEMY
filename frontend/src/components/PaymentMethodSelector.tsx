import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Smartphone,
  Bitcoin,
  Check,
  Zap,
  Shield,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type PaymentMethod = "stripe" | "crypto" | "momo";

interface PaymentMethodOption {
  id: PaymentMethod;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
  features: string[];
  processingTime: string;
  fees: string;
  popular?: boolean;
}

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod | null;
  onMethodSelect: (method: PaymentMethod) => void;
  className?: string;
}

const paymentMethods: PaymentMethodOption[] = [
  {
    id: "stripe",
    name: "Credit/Debit Card",
    description: "Pay securely with your credit or debit card",
    icon: CreditCard,
    badge: "Popular",
    badgeVariant: "default",
    features: ["Instant processing", "Secure encryption", "Global acceptance"],
    processingTime: "Instant",
    fees: "2.9% + $0.30",
    popular: false,
  },
  {
    id: "crypto",
    name: "Cryptocurrency",
    description: "Pay with Bitcoin, Ethereum, or other cryptocurrencies",
    icon: Bitcoin,
    badge: "Low Fees",
    badgeVariant: "secondary",
    features: ["Decentralized", "Low transaction fees", "Privacy focused"],
    processingTime: "1-5 minutes",
    fees: "Network fees only",
  },
  {
    id: "momo",
    name: "Mobile Money",
    description: "Pay using MTN Mobile Money, Airtel Money, or other services",
    icon: Smartphone,
    badge: "Local",
    badgeVariant: "outline",
    features: ["Local payment", "Mobile convenience", "Wide acceptance"],
    processingTime: "1-5 minutes",
    fees: "1.5% + local charges",
  },
];

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onMethodSelect,
  className,
}) => {
  const [hoveredMethod, setHoveredMethod] = useState<PaymentMethod | null>(
    null
  );

  return (
    <div className={cn("space-y-4", className)}>
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Choose Your Payment Method
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Select your preferred way to complete the payment
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        {paymentMethods.map((method) => {
          const isSelected = selectedMethod === method.id;
          const isHovered = hoveredMethod === method.id;
          const IconComponent = method.icon;

          return (
            <Card
              key={method.id}
              className={cn(
                "relative cursor-pointer transition-all duration-300 border-2 hover:shadow-lg dark:hover:shadow-2xl",
                isSelected
                  ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-md dark:shadow-xl dark:shadow-blue-500/20"
                  : "border-gray-200 dark:border-gray-600 hover:border-primary/50 dark:hover:border-primary/60 bg-white dark:bg-gray-800/50",
                isHovered && !isSelected && "shadow-md dark:shadow-xl transform scale-[1.02]"
              )}
              onMouseEnter={() => setHoveredMethod(method.id)}
              onMouseLeave={() => setHoveredMethod(null)}
              onClick={() => onMethodSelect(method.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className={cn(
                        "p-3 rounded-full transition-colors duration-200",
                        isSelected
                          ? "bg-primary text-white shadow-lg"
                          : "bg-gray-100 dark:bg-gray-700/80 text-gray-600 dark:text-gray-300"
                      )}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        {method.name}
                      </h4>
                      {method.badge && (
                        <Badge
                          variant={method.badgeVariant}
                          className="mt-1 text-xs"
                        >
                          {method.badge}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="p-1 bg-primary rounded-full">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {method.description}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">
                      Processing Time:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {method.processingTime}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">
                      Fees:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {method.fees}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <div className="space-y-2">
                    {method.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 text-xs"
                      >
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        <span className="text-gray-600 dark:text-gray-300">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "w-full transition-all duration-200",
                      isSelected
                        ? "bg-primary hover:bg-primary/90 shadow-md"
                        : "hover:bg-primary hover:text-white border-gray-300 dark:border-gray-600 dark:text-gray-200"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      onMethodSelect(method.id);
                    }}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Selected
                      </>
                    ) : (
                      "Select Method"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedMethod && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700/50">
          <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-100">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">Secure Payment</span>
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-200 mt-1">
            Your payment information is encrypted and secure. We use
            industry-standard security measures to protect your data.
          </p>
        </div>
      )}
    </div>
  );
};
