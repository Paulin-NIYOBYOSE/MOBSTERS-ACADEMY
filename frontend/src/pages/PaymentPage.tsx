import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
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
import { 
  Loader2, 
  CreditCard, 
  ArrowLeft, 
  Shield, 
  CheckCircle,
  Star,
  Users,
  Clock
} from "lucide-react";
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

interface PaymentPageProps {
  amount?: number;
  program?: string;
}

const CheckoutForm: React.FC<PaymentPageProps> = ({
  amount: propAmount,
  program: propProgram,
}) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [showMethodSelector, setShowMethodSelector] = useState(true);
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const { toast } = useToast();
  const { theme } = useTheme();

  // Get payment details from URL params or props
  const amount = propAmount || parseInt(searchParams.get("amount") || "0");
  const program = propProgram || searchParams.get("program") || "academy";

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!amount || amount <= 0) {
      navigate("/dashboard");
      return;
    }
  }, [user, amount, navigate]);

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
    setShowMethodSelector(false);
  };

  const handleBackToMethods = () => {
    setSelectedPaymentMethod(null);
    setShowMethodSelector(true);
    setError("");
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
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
            "Your enrollment has been processed. Redirecting to dashboard...",
        });

        setTimeout(() => {
          navigate("/dashboard");
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

  const programDetails = {
    academy: {
      name: "6-Month Academy Program",
      description: "Complete forex trading education with live sessions",
      features: [
        "6 months of comprehensive training",
        "Live trading sessions",
        "Personal mentorship",
        "Trading tools & resources",
        "Community access"
      ],
      icon: <Star className="h-6 w-6" />,
      duration: "6 months"
    },
    mentorship: {
      name: "Monthly Mentorship Program",
      description: "One-on-one guidance from professional traders",
      features: [
        "Personal 1-on-1 mentorship",
        "Weekly strategy sessions",
        "Portfolio review",
        "Risk management guidance",
        "Direct trader support"
      ],
      icon: <Users className="h-6 w-6" />,
      duration: "Monthly"
    },
  };

  const currentProgram = programDetails[program as keyof typeof programDetails] || programDetails.academy;

  // Stripe color styling
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

  if (!user || !amount) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-gray-950 dark:via-blue-950/20 dark:to-purple-950/20">
      {/* Header */}
      <div className="border-b border-white/20 dark:border-gray-800/50 bg-white/90 dark:bg-gray-900/95 backdrop-blur-xl sticky top-0 z-10 shadow-sm dark:shadow-2xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBackToDashboard}
              className="flex items-center space-x-2 hover:bg-slate-100 dark:hover:bg-gray-800/80 transition-colors text-slate-700 dark:text-gray-200"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="font-medium">Back to Dashboard</span>
            </Button>
            <div className="flex items-center space-x-2 text-sm text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800/50 px-3 py-1.5 rounded-full">
              <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="font-medium">Secure Payment</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
              Complete Your Enrollment
            </h1>
            <p className="text-lg text-slate-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join thousands of successful traders and start your forex journey today
            </p>
          </div>
          
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Program Details Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm dark:shadow-2xl dark:shadow-purple-500/10">
                <CardHeader className="pb-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 rounded-xl text-white shadow-lg dark:shadow-purple-500/25">
                      {currentProgram.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl font-bold text-slate-900 dark:text-gray-100 mb-2">
                        {currentProgram.name}
                      </CardTitle>
                      <div className="flex items-center space-x-2 text-slate-600 dark:text-gray-400">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">{currentProgram.duration}</span>
                      </div>
                      <p className="text-slate-600 dark:text-gray-300 mt-3 leading-relaxed">
                        {currentProgram.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-900 dark:text-gray-100 text-lg">What's included:</h4>
                    <div className="grid gap-3">
                      {currentProgram.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-800/30 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                          <span className="text-slate-700 dark:text-gray-200 font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-200 dark:border-gray-700">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-100 dark:border-blue-800/30 p-6 rounded-xl">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-slate-700 dark:text-gray-200">Total Amount:</span>
                        <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                          ${(amount / 100).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Notice */}
              <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 dark:shadow-green-500/10">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-green-100 dark:bg-green-800/80 rounded-lg">
                      <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-green-800 dark:text-green-100">Bank-Level Security</h4>
                      <p className="text-sm text-green-700 dark:text-green-200 leading-relaxed">
                        Your payment information is encrypted with 256-bit SSL and processed through secure, 
                        PCI-compliant payment processors. We never store your card details.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Form */}
            <div className="lg:col-span-3 space-y-6">
              {showMethodSelector && (
                <Card className="border-0 shadow-xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm dark:shadow-2xl dark:shadow-blue-500/10">
                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-3xl font-bold text-slate-900 dark:text-gray-100 mb-3">
                      Choose Your Payment Method
                    </CardTitle>
                    <CardDescription className="text-lg text-slate-600 dark:text-gray-300">
                      Select your preferred payment option to complete your enrollment
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-8 pb-8">
                    <PaymentMethodSelector
                      selectedMethod={selectedPaymentMethod}
                      onMethodSelect={handleMethodSelect}
                    />
                  </CardContent>
                </Card>
              )}

              {!showMethodSelector && selectedPaymentMethod === "crypto" && (
                <div className="space-y-4">
                  <Button
                    variant="ghost"
                    onClick={handleBackToMethods}
                    className="flex items-center space-x-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Payment Methods</span>
                  </Button>
                  <CryptoPaymentForm
                    amount={amount}
                    program={program}
                    onSuccess={() => navigate("/dashboard")}
                  />
                </div>
              )}

              {!showMethodSelector && selectedPaymentMethod === "momo" && (
                <div className="space-y-4">
                  <Button
                    variant="ghost"
                    onClick={handleBackToMethods}
                    className="flex items-center space-x-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Payment Methods</span>
                  </Button>
                  <MobileMoneyForm
                    amount={amount}
                    program={program}
                    onSuccess={() => navigate("/dashboard")}
                  />
                </div>
              )}

              {!showMethodSelector && selectedPaymentMethod === "stripe" && (
                <div className="space-y-4">
                  <Button
                    variant="ghost"
                    onClick={handleBackToMethods}
                    className="flex items-center space-x-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Payment Methods</span>
                  </Button>
                  
                  <Card className="border-0 shadow-xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm dark:shadow-2xl dark:shadow-purple-500/10">
                    <CardHeader className="text-center pb-8">
                      <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 rounded-2xl flex items-center justify-center mb-6 shadow-lg dark:shadow-purple-500/25">
                        <CreditCard className="h-10 w-10 text-white" />
                      </div>
                      <CardTitle className="text-2xl font-bold text-slate-900 dark:text-gray-100 mb-2">Card Payment</CardTitle>
                      <CardDescription className="text-lg text-slate-600 dark:text-gray-300">
                        Complete your payment securely with your credit or debit card
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-8 pb-8">
                      <form onSubmit={handleStripeSubmit} className="space-y-8">
                        {error && (
                          <Alert variant="destructive" className="border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-900/30">
                            <AlertDescription className="text-red-800 dark:text-red-100">{error}</AlertDescription>
                          </Alert>
                        )}

                        <div className="space-y-3">
                          <label className="text-sm font-semibold text-slate-700 dark:text-gray-200">Card Details</label>
                          <div className="border-2 border-slate-200 dark:border-gray-600 rounded-xl p-4 bg-slate-50 dark:bg-gray-800/50 focus-within:border-blue-500 dark:focus-within:border-blue-400 transition-colors">
                            <CardElement options={cardElementOptions} />
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-gray-800/50 dark:to-gray-700/50 rounded-xl p-6 border border-slate-200 dark:border-gray-600">
                            <div className="flex justify-between items-center">
                              <span className="text-lg font-semibold text-slate-700 dark:text-gray-200">Total Payment:</span>
                              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                                ${(amount / 100).toFixed(2)}
                              </span>
                            </div>
                          </div>

                          <Button
                            type="submit"
                            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-400 dark:hover:to-purple-400 shadow-lg hover:shadow-xl dark:shadow-purple-500/25 transition-all duration-200"
                            disabled={loading || !stripe}
                          >
                            {loading ? (
                              <>
                                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                                Processing Payment...
                              </>
                            ) : (
                              <>
                                <Shield className="mr-3 h-5 w-5" />
                                Complete Secure Payment - ${(amount / 100).toFixed(2)}
                              </>
                            )}
                          </Button>
                        </div>
                      </form>

                      <div className="mt-8 text-center">
                        <div className="flex items-center justify-center space-x-2 text-sm text-slate-500 dark:text-gray-400">
                          <Shield className="h-4 w-4" />
                          <span>Secure payment powered by Stripe</span>
                        </div>
                        <p className="text-xs text-slate-400 dark:text-gray-400 mt-2">
                          Your card information is encrypted and never stored on our servers
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PaymentPage: React.FC<PaymentPageProps> = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  );
};
