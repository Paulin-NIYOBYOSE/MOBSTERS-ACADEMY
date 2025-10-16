import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CreditCard, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import { PaymentMethodSelector, PaymentMethod } from "@/components/PaymentMethodSelector";
import { CryptoPaymentForm } from "@/components/CryptoPaymentForm";
import { MobileMoneyForm } from "@/components/MobileMoneyForm";

// Initialize Stripe
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_51MExamplePublishableKey12345"
);

interface PaymentFormProps {
  amount: number;
  program: string;
  onSuccess?: () => void;
}

const CheckoutForm: React.FC<PaymentFormProps> = ({
  amount,
  program,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [showMethodSelector, setShowMethodSelector] = useState(true);
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const { toast } = useToast();
  const { theme } = useTheme();

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
    setShowMethodSelector(false);
  };

  const handleBackToMethods = () => {
    setSelectedPaymentMethod(null);
    setShowMethodSelector(true);
    setError("");
  };

  const handleStripeSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !user) {
      return;
    }

    setLoading(true);
    setError("");

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError("Card element not found");
      setLoading(false);
      return;
    }

    try {
      // Create payment intent
      const { clientSecret } = await authService.createPaymentIntent(
        amount,
        user.id,
        program
      );

      // Confirm payment
      const { error: stripeError } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: user.name,
              email: user.email,
            },
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message || "Payment failed");
      } else {
        toast({
          title: "Payment successful!",
          description:
            "Your enrollment has been processed. Refreshing your access...",
        });

        setTimeout(() => {
          window.location.reload();
          onSuccess?.();
        }, 2000);
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      setError(
        err.response?.data?.message || "Payment failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const programNames = {
    academy: "6-Month Academy Program",
    mentorship: "Monthly Mentorship Program",
  };

  // ✅ Stripe color styling (explicit hex because Stripe can’t read Tailwind variables)
  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        fontFamily: "inherit",
        color: theme === "dark" ? "#ffffff" : "#111827", // white in dark, gray-900 in light
        "::placeholder": {
          color: theme === "dark" ? "#9ca3af" : "#6b7280", // gray-400 vs gray-500
        },
        iconColor: theme === "dark" ? "#9ca3af" : "#6b7280",
      },
      invalid: {
        color: "#ef4444", // red-500
        iconColor: "#ef4444",
      },
      complete: {
        color: theme === "dark" ? "#ffffff" : "#111827",
      },
    },
  };

  // Show payment method selector
  if (showMethodSelector) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Complete Your Payment</CardTitle>
          <CardDescription className="text-lg">
            {programNames[program as keyof typeof programNames]} - $
            {(amount / 100).toFixed(2)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentMethodSelector
            selectedMethod={selectedPaymentMethod}
            onMethodSelect={handleMethodSelect}
          />
        </CardContent>
      </Card>
    );
  }

  // Show crypto payment form
  if (selectedPaymentMethod === "crypto") {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          onClick={handleBackToMethods}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Payment Methods
        </Button>
        <CryptoPaymentForm
          amount={amount}
          program={program}
          onSuccess={onSuccess}
        />
      </div>
    );
  }

  // Show mobile money form
  if (selectedPaymentMethod === "momo") {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          onClick={handleBackToMethods}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Payment Methods
        </Button>
        <MobileMoneyForm
          amount={amount}
          program={program}
          onSuccess={onSuccess}
        />
      </div>
    );
  }

  // Show Stripe card payment form
  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        onClick={handleBackToMethods}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Payment Methods
      </Button>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <CreditCard className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-xl font-bold">Card Payment</CardTitle>
          <CardDescription>
            {programNames[program as keyof typeof programNames]} - $
            {(amount / 100).toFixed(2)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleStripeSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Card Details</label>
              <div className="border rounded-md p-3 bg-background">
                <CardElement options={cardElementOptions} />
              </div>
            </div>

            <Button
              type="submit"
              variant="cta"
              className="w-full"
              disabled={loading || !stripe}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                `Pay $${(amount / 100).toFixed(2)}`
              )}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              Secure payment powered by Stripe. Your card information is encrypted
              and secure.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const PaymentForm: React.FC<PaymentFormProps> = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  );
};
