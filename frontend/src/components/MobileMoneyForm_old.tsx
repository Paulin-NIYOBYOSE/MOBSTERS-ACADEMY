import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Smartphone,
  Phone,
  Loader2,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MobileMoneyFormProps {
  amount: number;
  program: string;
  onSuccess?: () => void;
}

const mobileMoneyProviders = [
  {
    id: "mtn",
    name: "MTN Mobile Money",
    shortName: "MTN MoMo",
    color: "bg-yellow-500",
    textColor: "text-yellow-600",
    bgColor: "bg-yellow-100 dark:bg-yellow-900",
    countries: ["Uganda", "Ghana", "Rwanda", "Cameroon"],
    code: "*165#",
  },
  {
    id: "airtel",
    name: "Airtel Money",
    shortName: "Airtel Money",
    color: "bg-red-500",
    textColor: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-900",
    countries: ["Uganda", "Kenya", "Tanzania", "Zambia"],
    code: "*185#",
  },
  {
    id: "mpesa",
    name: "M-Pesa",
    shortName: "M-Pesa",
    color: "bg-green-500",
    textColor: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900",
    countries: ["Kenya", "Tanzania", "Mozambique"],
    code: "*334#",
  },
];

export const MobileMoneyForm: React.FC<MobileMoneyFormProps> = ({
  amount,
  program,
  onSuccess,
}) => {
  const [step, setStep] = useState<"select" | "pay" | "confirm">("select");
  const [selectedProvider, setSelectedProvider] = useState<typeof mobileMoneyProviders[0] | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const usdAmount = (amount / 100).toFixed(2);

  const handleProviderSelect = (provider: typeof mobileMoneyProviders[0]) => {
    setSelectedProvider(provider);
    setStep("pay");
  };

  const handleSubmitPayment = async () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter your phone number",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call to initiate mobile money payment
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Generate mock transaction ID
      const mockTransactionId = `MM${Date.now().toString().slice(-8)}`;
      // setTransactionId(mockTransactionId);
      
      setStep("confirm");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    setLoading(true);
    try {
      // Simulate payment confirmation
      await new Promise((resolve) => setTimeout(resolve, 3000));
      
      // setStep("success");
      toast({
        title: "Payment Successful!",
        description: "Your mobile money payment has been processed successfully.",
      });
      
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Payment confirmation failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (step === "select") {
    return (
      <Card className="w-full max-w-3xl mx-auto border-0 shadow-2xl">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <Smartphone className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
            Choose Mobile Money Provider
          </CardTitle>
          <p className="text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Select your preferred mobile money service for secure payment
          </p>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <div className="grid gap-6">
            {mobileMoneyProviders.map((provider) => (
              <div
                key={provider.id}
                className={`group p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
                  selectedProvider?.id === provider.id
                    ? "border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 shadow-lg ring-2 ring-green-200"
                    : "border-gray-200 dark:border-gray-700 hover:border-green-300 bg-white dark:bg-gray-800"
                }`}
                onClick={() => setSelectedProvider(provider)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-16 h-16 ${provider.color} rounded-2xl flex items-center justify-center shadow-lg transition-all duration-200 group-hover:scale-110`}
                    >
                      <Smartphone className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-green-600 transition-colors">
                        {provider.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        Available in: {provider.countries.join(", ")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge 
                      variant="outline" 
                      className={`text-sm font-semibold px-3 py-1 ${
                        selectedProvider?.id === provider.id 
                          ? "border-green-300 text-green-700 bg-green-100" 
                          : "border-gray-300 text-gray-600"
                      }`}
                    >
                      {provider.code}
                    </Badge>
                    {selectedProvider?.id === provider.id && (
                      <div className="p-1 bg-green-500 rounded-full">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-between items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-medium">Amount: </span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                ${(amount / 100).toFixed(2)}
              </span>
            </div>
            <Button
              onClick={() => selectedProvider && setStep("pay")}
              disabled={!selectedProvider}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              Continue to Payment
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === "pay") {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className={`w-16 h-16 ${selectedProvider.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <Smartphone className={`w-8 h-8 ${selectedProvider.textColor}`} />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {selectedProvider.shortName} Payment
          </h3>
          <p className="text-sm text-muted-foreground">
            Enter your phone number to proceed with payment
          </p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Amount:</span>
                <Badge variant="secondary" className="font-mono">
                  ${usdAmount} USD
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                Local currency equivalent will be charged based on current exchange rates
              </div>
            </div>
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <Label htmlFor="phone-number">Phone Number</Label>
          <div className="flex space-x-2">
            <Input
              id="phone-number"
              type="tel"
              placeholder="e.g., +256 700 123 456"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="flex-1"
            />
        </Button>
      </div>
    </div>
  );

  const renderPaymentConfirmation = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className={`w-16 h-16 ${selectedProvider.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
          <Phone className={`w-8 h-8 ${selectedProvider.textColor}`} />
        </div>
        <h3 className="text-lg font-semibold mb-2">Check Your Phone</h3>
        <p className="text-sm text-muted-foreground">
          A payment request has been sent to {phoneNumber}
        </p>
      </div>

      <Alert>
        <Clock className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Transaction ID:</span>
              <span className="font-mono text-sm">{transactionId}</span>
            </div>
            <div className="flex justify-between">
              <span>Amount:</span>
              <span className="font-semibold">${usdAmount} USD</span>
            </div>
            <div className="flex justify-between">
              <span>Provider:</span>
              <span>{selectedProvider.shortName}</span>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
          Complete Payment on Your Phone
        </h4>
        <ol className="list-decimal list-inside space-y-1 text-sm text-blue-600 dark:text-blue-300">
          <li>Check for the payment notification on {phoneNumber}</li>
          <li>Enter your {selectedProvider.shortName} PIN</li>
          <li>Confirm the payment amount (${usdAmount} USD equivalent)</li>
          <li>Click "Confirm Payment" below once completed</li>
        </ol>
      </div>

      <div className="flex space-x-3">
        <Button
          variant="outline"
          onClick={() => setStep("details")}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          onClick={handleConfirmPayment}
          disabled={loading}
          className="flex-1"
          variant="cta"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Confirming...
            </>
          ) : (
            "Confirm Payment"
          )}
        </Button>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Payment Successful!</h3>
        <p className="text-sm text-muted-foreground">
          Your mobile money payment has been processed successfully.
        </p>
      </div>

      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Transaction ID:</span>
              <span className="font-mono text-sm">{transactionId}</span>
            </div>
            <div className="flex justify-between">
              <span>Amount Paid:</span>
              <span className="font-semibold text-green-600">${usdAmount} USD</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <Badge className="bg-green-500">Completed</Badge>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      <p className="text-xs text-muted-foreground">
        You will receive an SMS confirmation shortly. Your account access will be updated within a few minutes.
      </p>
    </div>
  );

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
          <Smartphone className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <CardTitle className="text-xl font-bold">Mobile Money Payment</CardTitle>
        <p className="text-sm text-muted-foreground">
          {program === "academy" ? "6-Month Academy Program" : "Monthly Mentorship Program"} - ${usdAmount}
        </p>
      </CardHeader>
      <CardContent>
        {step === "select" && renderProviderSelection()}
        {step === "details" && renderPaymentDetails()}
        {step === "confirm" && renderPaymentConfirmation()}
        {step === "success" && renderSuccess()}
      </CardContent>
    </Card>
  );
};
