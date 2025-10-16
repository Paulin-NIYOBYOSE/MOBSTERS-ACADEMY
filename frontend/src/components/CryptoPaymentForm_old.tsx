import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Bitcoin,
  Copy,
  ExternalLink,
  Loader2,
  CheckCircle,
  Clock,
  Wallet,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CryptoPaymentFormProps {
  amount: number;
  program: string;
  onSuccess?: () => void;
}

const cryptoOptions = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    icon: "₿",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    network: "Bitcoin Network",
    confirmations: 1,
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    icon: "Ξ",
    address: "0x742d35Cc6634C0532925a3b8D4C9db96590e4CAF",
    network: "Ethereum Network",
    confirmations: 12,
  },
  {
    id: "usdt",
    name: "Tether USD",
    symbol: "USDT",
    icon: "₮",
    address: "0x742d35Cc6634C0532925a3b8D4C9db96590e4CAF",
    network: "Ethereum Network (ERC-20)",
    confirmations: 12,
  },
];

export const CryptoPaymentForm: React.FC<CryptoPaymentFormProps> = ({
  amount,
  program,
  onSuccess,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedCrypto, setSelectedCrypto] = useState<typeof cryptoOptions[0] | null>(null);
  const [transactionHash, setTransactionHash] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Address copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the address manually",
        variant: "destructive",
      });
    }
  };

  const handleSubmitTransaction = async () => {
    setLoading(true);
    try {
      // Simulate API call to verify transaction
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      toast({
        title: "Transaction Submitted!",
        description: "We're verifying your payment. You'll be notified once confirmed.",
      });
      
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit transaction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (step === 1) {
    return (
      <Card className="w-full max-w-3xl mx-auto border-0 shadow-2xl">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <Bitcoin className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent mb-3">
            Choose Cryptocurrency
          </CardTitle>
          <p className="text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Select your preferred cryptocurrency for secure payment
          </p>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <div className="grid gap-6">
            {cryptoOptions.map((crypto) => (
              <div
                key={crypto.id}
                className={`group p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
                  selectedCrypto?.id === crypto.id
                    ? "border-orange-500 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 shadow-lg ring-2 ring-orange-200"
                    : "border-gray-200 dark:border-gray-700 hover:border-orange-300 bg-white dark:bg-gray-800"
                }`}
                onClick={() => setSelectedCrypto(crypto)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full transition-all duration-200 ${
                      selectedCrypto?.id === crypto.id 
                        ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg" 
                        : "bg-gray-100 dark:bg-gray-700 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30"
                    }`}>
                      <span className="text-2xl font-bold">{crypto.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-orange-600 transition-colors">
                        {crypto.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        {crypto.network}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge 
                      variant="outline" 
                      className={`text-xs font-semibold ${
                        selectedCrypto?.id === crypto.id 
                          ? "border-orange-300 text-orange-700 bg-orange-100" 
                          : "border-gray-300 text-gray-600"
                      }`}
                    >
                      {crypto.confirmations} conf{crypto.confirmations !== 1 ? "s" : ""}
                    </Badge>
                    {selectedCrypto?.id === crypto.id && (
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
              onClick={() => selectedCrypto && setStep(2)}
              disabled={!selectedCrypto}
              size="lg"
              className="bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              Continue to Payment
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Step 2: Show payment details
  if (step === 2) {
    return (
      <Card className="w-full max-w-3xl mx-auto border-0 shadow-2xl">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <Wallet className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Send {selectedCrypto?.name}
          </CardTitle>
          <p className="text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Send the exact amount to the address below to complete your payment
          </p>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <div className="space-y-8">
            {/* Payment Address */}
            <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-2xl border border-gray-200 dark:border-gray-700">
              <Label className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
                Payment Address
              </Label>
              <div className="flex items-center space-x-3">
                <Input
                  value={selectedCrypto?.address || ""}
                  readOnly
                  className="font-mono text-sm bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl p-4"
                />
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => copyToClipboard(selectedCrypto?.address || "")}
                  className="px-4 py-4 border-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl"
                >
                  <Copy className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Amount */}
            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-800">
              <Label className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
                Amount (USD)
              </Label>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-700 dark:text-green-400">
                  ${(amount / 100).toFixed(2)}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Send equivalent amount in {selectedCrypto?.symbol}
                </p>
              </div>
            </div>

            {/* Instructions */}
            <Alert className="border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-full">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <AlertDescription className="text-amber-800 dark:text-amber-200 font-medium leading-relaxed">
                <strong>Important Instructions:</strong><br />
                • Send the exact USD equivalent in {selectedCrypto?.symbol} to the address above<br />
                • The transaction will be confirmed after {selectedCrypto?.confirmations} network confirmation{selectedCrypto?.confirmations !== 1 ? "s" : ""}<br />
                • Do not send from an exchange wallet - use a personal wallet<br />
                • Double-check the address before sending
              </AlertDescription>
            </Alert>
          </div>

          <div className="mt-8 flex justify-between items-center">
            <Button 
              variant="outline" 
              onClick={() => setStep(1)}
              size="lg"
              className="px-6 py-3 border-2 rounded-xl font-semibold"
            >
              ← Back to Selection
            </Button>
            <Button
              onClick={() => setStep(3)}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              I've Sent Payment →
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Step 3: Transaction verification
  return (
    <Card className="w-full max-w-2xl mx-auto border-0 shadow-2xl">
      <CardHeader className="text-center pb-6">
        <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
          <CheckCircle className="h-10 w-10 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
          Verify Transaction
        </CardTitle>
        <p className="text-base text-gray-600 dark:text-gray-400">
          Paste your transaction hash to verify the payment
        </p>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <div className="space-y-6">
          <div>
            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
              Transaction Hash
            </Label>
            <Input
              value={transactionHash}
              onChange={(e) => setTransactionHash(e.target.value)}
              placeholder="Enter transaction hash from your wallet"
              className="font-mono text-sm border-2 rounded-xl p-4"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Paste the transaction hash from your wallet after sending the payment
            </p>
          </div>

          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={() => setStep(2)}
              className="flex-1 py-3 border-2 rounded-xl font-semibold"
            >
              ← Back
            </Button>
            <Button
              onClick={handleSubmitTransaction}
              disabled={loading || !transactionHash.trim()}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Submit Payment"
              )}
            </Button>
        <p className="text-sm text-muted-foreground">
          We're verifying your cryptocurrency payment. This usually takes 5-30 minutes
          depending on network congestion.
        </p>
      </div>

      <Alert>
        <Clock className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Transaction Hash:</span>
              <span className="font-mono text-xs break-all">
                {transactionHash.slice(0, 20)}...
              </span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <Badge variant="secondary">Pending Confirmation</Badge>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      <Button
        variant="outline"
        onClick={() => window.open(`https://blockchair.com/search?q=${transactionHash}`, '_blank')}
        className="w-full"
      >
        <ExternalLink className="mr-2 h-4 w-4" />
        View on Blockchain Explorer
      </Button>
    </div>
  );

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4">
          <Bitcoin className="h-8 w-8 text-orange-600 dark:text-orange-400" />
        </div>
        <CardTitle className="text-xl font-bold">Cryptocurrency Payment</CardTitle>
        <p className="text-sm text-muted-foreground">
          {program === "academy" ? "6-Month Academy Program" : "Monthly Mentorship Program"} - ${usdAmount}
        </p>
      </CardHeader>
      <CardContent>
        {step === "select" && renderCryptoSelection()}
        {step === "pay" && renderPaymentInstructions()}
        {step === "verify" && renderVerification()}
      </CardContent>
    </Card>
  );
};
