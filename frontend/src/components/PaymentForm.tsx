import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';

// Initialize Stripe
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51MExamplePublishableKey12345'
);

interface PaymentFormProps {
  amount: number;
  program: string;
  onSuccess?: () => void;
}

const CheckoutForm: React.FC<PaymentFormProps> = ({ amount, program, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !user) {
      return;
    }

    setLoading(true);
    setError('');

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError('Card element not found');
      setLoading(false);
      return;
    }

    try {
      // Create payment intent
      const { client_secret } = await authService.createPaymentIntent(amount, user.id, program);

      // Confirm payment
      const { error: stripeError } = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: user.name,
            email: user.email,
          },
        },
      });

      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
      } else {
        toast({
          title: 'Payment successful!',
          description: 'Your enrollment has been processed. Refreshing your access...',
        });
        
        // Refresh user data to get updated roles
        setTimeout(() => {
          window.location.reload();
          onSuccess?.();
        }, 2000);
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const programNames = {
    academy: '6-Month Academy Program',
    mentorship: 'Monthly Mentorship Program'
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <CreditCard className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-xl font-bold">Complete Payment</CardTitle>
        <CardDescription>
          {programNames[program as keyof typeof programNames]} - ${(amount / 100).toFixed(2)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Card Details</label>
            <div className="border rounded-md p-3 bg-background">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: 'hsl(var(--foreground))',
                      '::placeholder': {
                        color: 'hsl(var(--muted-foreground))',
                      },
                    },
                  },
                }}
              />
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
            Secure payment powered by Stripe. Your card information is encrypted and secure.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export const PaymentForm: React.FC<PaymentFormProps> = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  );
};