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
  const [selectedProvider, setSelectedProvider] = useState(mobileMoneyProviders[0]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"select" | "details" | "confirm" | "success">("select");
  const [transactionId, setTransactionId] = useState("");
  const { toast } = useToast();

  const usdAmount = (amount / 100).toFixed(2);

  const handleProviderSelect = (provider: typeof mobileMoneyProviders[0]) => {
    setSelectedProvider(provider);
    setStep("details");
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
      setTransactionId(mockTransactionId);
      
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
      
      setStep("success");
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

  const renderProviderSelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-gray-100 mb-3">Select Provider</h3>
        <p className="text-lg text-slate-600 dark:text-gray-300">
          Choose your mobile money service
        </p>
      </div>

      <div className="grid gap-4">
        {mobileMoneyProviders.map((provider) => (
          <Card
            key={provider.id}
            className="cursor-pointer transition-all duration-300 border-2 hover:shadow-lg dark:hover:shadow-2xl hover:border-primary/50 dark:hover:border-primary/60 bg-white dark:bg-gray-800/50"
            onClick={() => handleProviderSelect(provider)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-14 h-14 ${provider.bgColor} rounded-xl flex items-center justify-center shadow-lg`}>
                    <Smartphone className={`w-7 h-7 ${provider.textColor}`} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-slate-900 dark:text-gray-100">{provider.name}</h4>
                    <p className="text-sm text-slate-600 dark:text-gray-300 font-medium">
                      {provider.countries.slice(0, 2).join(", ")}{provider.countries.length > 2 ? ` +${provider.countries.length - 2} more` : ''}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="border-2">
                  Select
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderPaymentDetails = () => (
    <div className="space-y-8">
      <div className="text-center">
        <div className={`w-20 h-20 ${selectedProvider.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
          <Smartphone className={`w-10 h-10 ${selectedProvider.textColor}`} />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-gray-100 mb-3">
          {selectedProvider.shortName} Payment
        </h3>
        <p className="text-lg text-slate-600 dark:text-gray-300">
          Enter your phone number to proceed
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-700/50 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-800/80 rounded-lg">
            <AlertCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h4 className="font-semibold text-blue-800 dark:text-blue-100">Payment Amount</h4>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium text-blue-700 dark:text-blue-200">Total:</span>
          <Badge className="font-mono text-lg px-3 py-1 bg-blue-600 hover:bg-blue-700">
            ${usdAmount}
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        <Label htmlFor="phone-number" className="text-lg font-semibold text-slate-700 dark:text-gray-200">Phone Number</Label>
        <Input
          id="phone-number"
          type="tel"
          placeholder="e.g., +256 700 123 456"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="h-12 text-lg bg-slate-50 dark:bg-gray-800/50 border-2 border-slate-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
        />
      </div>

      <div className="flex space-x-4">
        <Button
          variant="outline"
          onClick={() => setStep("select")}
          className="flex-1 h-12 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50"
        >
          Back
        </Button>
        <Button
          onClick={handleSubmitPayment}
          disabled={loading || !phoneNumber.trim()}
          className="flex-1 h-12 text-lg font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Initiating...
            </>
          ) : (
            <>
              <Phone className="mr-2 h-5 w-5" />
              Send Payment Request
            </>
          )}
        </Button>
      </div>
    </div>
  );

  const renderPaymentConfirmation = () => (
    <div className="space-y-8">
      <div className="text-center">
        <div className={`w-20 h-20 ${selectedProvider.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
          <Phone className={`w-10 h-10 ${selectedProvider.textColor}`} />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-gray-100 mb-3">Check Your Phone</h3>
        <p className="text-lg text-slate-600 dark:text-gray-300">
          Payment request sent to {phoneNumber}
        </p>
      </div>

      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 border border-yellow-200 dark:border-yellow-700/50 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-yellow-100 dark:bg-yellow-800/80 rounded-lg">
            <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h4 className="font-semibold text-yellow-800 dark:text-yellow-100">Transaction Details</h4>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-medium text-yellow-700 dark:text-yellow-200">Transaction ID:</span>
            <span className="font-mono text-sm text-yellow-600 dark:text-yellow-300">{transactionId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-yellow-700 dark:text-yellow-200">Amount:</span>
            <Badge className="bg-yellow-600 hover:bg-yellow-700">${usdAmount}</Badge>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-700/50 rounded-xl p-6">
        <h4 className="font-semibold text-blue-800 dark:text-blue-100 mb-3">
          Complete on Your Phone
        </h4>
        <p className="text-sm text-blue-700 dark:text-blue-200">
          Check notification → Enter PIN → Confirm amount
        </p>
      </div>

      <div className="flex space-x-4">
        <Button
          variant="outline"
          onClick={() => setStep("details")}
          className="flex-1 h-12 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50"
        >
          Back
        </Button>
        <Button
          onClick={handleConfirmPayment}
          disabled={loading}
          className="flex-1 h-12 text-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Confirming...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-5 w-5" />
              Confirm Payment
            </>
          )}
        </Button>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center space-y-8">
      <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 dark:from-green-400 dark:to-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-lg dark:shadow-green-500/25">
        <CheckCircle className="w-10 h-10 text-white" />
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-gray-100 mb-3">Payment Successful!</h3>
        <p className="text-lg text-slate-600 dark:text-gray-300">
          Your mobile money payment has been processed
        </p>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200 dark:border-green-700/50 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-green-100 dark:bg-green-800/80 rounded-lg">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <h4 className="font-semibold text-green-800 dark:text-green-100">Payment Complete</h4>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-medium text-green-700 dark:text-green-200">Transaction ID:</span>
            <span className="font-mono text-sm text-green-600 dark:text-green-300">{transactionId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-green-700 dark:text-green-200">Amount:</span>
            <Badge className="bg-green-600 hover:bg-green-700">${usdAmount}</Badge>
          </div>
        </div>
      </div>

    </div>
  );

  return (
    <Card className="w-full max-w-2xl mx-auto border-0 shadow-xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm dark:shadow-2xl dark:shadow-blue-500/10">
      <CardHeader className="text-center pb-8">
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400 rounded-2xl flex items-center justify-center mb-6 shadow-lg dark:shadow-blue-500/25">
          <Smartphone className="h-10 w-10 text-white" />
        </div>
        <CardTitle className="text-3xl font-bold text-slate-900 dark:text-gray-100 mb-3">Mobile Money Payment</CardTitle>
        <p className="text-lg text-slate-600 dark:text-gray-300">
          {program === "academy" ? "6-Month Academy Program" : "Monthly Mentorship Program"} - ${usdAmount}
        </p>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        {step === "select" && renderProviderSelection()}
        {step === "details" && renderPaymentDetails()}
        {step === "confirm" && renderPaymentConfirmation()}
        {step === "success" && renderSuccess()}
      </CardContent>
    </Card>
  );
};
