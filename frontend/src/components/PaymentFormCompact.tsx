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
import { Loader2, CreditCard, ExternalLink } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";

// Initialize Stripe
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_51MExamplePublishableKey12345"
);

interface PaymentFormCompactProps {
  amount: number;
  program: string;
  onSuccess?: () => void;
  showFullPage?: boolean;
}

const CheckoutFormCompact: React.FC<PaymentFormCompactProps> = ({
  amount,
  program,
  onSuccess,
  showFullPage = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const { toast } = useToast();
  const { theme } = useTheme();

  const handleSubmit = async (event: React.FormEvent) => {
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

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        fontFamily: "inherit",
        color: theme === "dark" ? "#ffffff" : "#111827",
        "::placeholder": {
          color: theme === "dark" ? "#9ca3af" : "#6b7280",
        },
        iconColor: theme === "dark" ? "#9ca3af" : "#6b7280",
      },
      invalid: {
        color: "#ef4444",
        iconColor: "#ef4444",
      },
      complete: {
        color: theme === "dark" ? "#ffffff" : "#111827",
      },
    },
  };

  const handleFullPagePayment = () => {
    const params = new URLSearchParams({
      amount: amount.toString(),
      program: program,
    });
    window.open(`/payment?${params.toString()}`, '_blank');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <CreditCard className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-xl font-bold">Complete Payment</CardTitle>
        <CardDescription>
          {programNames[program as keyof typeof programNames]} - $
          {(amount / 100).toFixed(2)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {showFullPage && (
          <div className="text-center">
            <Button
              variant="outline"
              onClick={handleFullPagePayment}
              className="w-full mb-4"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Full Payment Page
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or pay here
                </span>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            🔒 Secure payment powered by Stripe. Your card information is encrypted
            and secure.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export const PaymentFormCompact: React.FC<PaymentFormCompactProps> = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutFormCompact {...props} />
    </Elements>
  );
};
