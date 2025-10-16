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
  const [selectedCrypto, setSelectedCrypto] = useState(cryptoOptions[0]);
  const [transactionHash, setTransactionHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"select" | "pay" | "verify">("select");
  const { toast } = useToast();

  const usdAmount = (amount / 100).toFixed(2);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Address copied to clipboard",
    });
  };

  const handleSubmitTransaction = async () => {
    if (!transactionHash.trim()) {
      toast({
        title: "Error",
        description: "Please enter the transaction hash",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call to verify transaction
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      toast({
        title: "Transaction Submitted!",
        description: "We're verifying your payment. You'll be notified once confirmed.",
      });
      
      setStep("verify");
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

  const renderCryptoSelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-gray-100 mb-3">Select Cryptocurrency</h3>
        <p className="text-lg text-slate-600 dark:text-gray-300">
          Choose your preferred cryptocurrency for payment
        </p>
      </div>

      <div className="grid gap-4">
        {cryptoOptions.map((crypto) => (
          <Card
            key={crypto.id}
            className={`cursor-pointer transition-all duration-300 border-2 hover:shadow-lg dark:hover:shadow-2xl ${
              selectedCrypto.id === crypto.id
                ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-md dark:shadow-xl dark:shadow-orange-500/20"
                : "border-gray-200 dark:border-gray-600 hover:border-primary/50 dark:hover:border-primary/60 bg-white dark:bg-gray-800/50"
            }`}
            onClick={() => setSelectedCrypto(crypto)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-yellow-500 dark:from-orange-500 dark:to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold text-white">
                      {crypto.icon}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-slate-900 dark:text-gray-100">{crypto.name}</h4>
                    <p className="text-sm text-slate-600 dark:text-gray-300 font-medium">
                      {crypto.symbol} • {crypto.network}
                    </p>
                  </div>
                </div>
                {selectedCrypto.id === crypto.id && (
                  <div className="p-2 bg-primary rounded-full">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        onClick={() => setStep("pay")}
        className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <Wallet className="mr-3 h-5 w-5" />
        Continue with {selectedCrypto.name}
      </Button>
    </div>
  );

  const renderPaymentInstructions = () => (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-yellow-500 dark:from-orange-400 dark:to-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg dark:shadow-orange-500/25">
          <span className="text-3xl font-bold text-white">
            {selectedCrypto.icon}
          </span>
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-gray-100 mb-3">
          Send {selectedCrypto.name}
        </h3>
        <p className="text-lg text-slate-600 dark:text-gray-300">
          Send the exact amount to the address below
        </p>
      </div>

      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/30 dark:to-yellow-900/30 border border-orange-200 dark:border-orange-700/50 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-orange-100 dark:bg-orange-800/80 rounded-lg">
            <Wallet className="h-6 w-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h4 className="font-semibold text-orange-800 dark:text-orange-100">Payment Amount</h4>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-medium text-orange-700 dark:text-orange-200">USD Amount:</span>
            <Badge className="font-mono text-lg px-3 py-1 bg-orange-600 hover:bg-orange-700">
              ${usdAmount}
            </Badge>
          </div>
          <div className="text-sm text-orange-600 dark:text-orange-300">
            Convert to {selectedCrypto.symbol} using current market rate from your wallet
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Label htmlFor="wallet-address" className="text-lg font-semibold text-slate-700 dark:text-gray-200">Send to Address</Label>
        <div className="flex space-x-3">
          <Input
            id="wallet-address"
            value={selectedCrypto.address}
            readOnly
            className="font-mono text-sm bg-slate-50 dark:bg-gray-800/50 border-2 border-slate-200 dark:border-gray-600"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => copyToClipboard(selectedCrypto.address)}
            className="h-12 w-12 border-2 border-slate-200 dark:border-gray-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
          >
            <Copy className="h-5 w-5" />
          </Button>
        </div>
      </div>


      <div className="space-y-4">
        <Label htmlFor="transaction-hash" className="text-lg font-semibold text-slate-700 dark:text-gray-200">Transaction Hash</Label>
        <Input
          id="transaction-hash"
          placeholder="Paste transaction hash here"
          value={transactionHash}
          onChange={(e) => setTransactionHash(e.target.value)}
          className="font-mono text-sm h-12 bg-slate-50 dark:bg-gray-800/50 border-2 border-slate-200 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-400"
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
          onClick={handleSubmitTransaction}
          disabled={loading || !transactionHash.trim()}
          className="flex-1 h-12 text-lg font-semibold bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-5 w-5" />
              Submit Payment
            </>
          )}
        </Button>
      </div>
    </div>
  );

  const renderVerification = () => (
    <div className="text-center space-y-8">
      <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 dark:from-green-400 dark:to-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-lg dark:shadow-green-500/25">
        <CheckCircle className="w-10 h-10 text-white" />
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-gray-100 mb-3">Payment Submitted</h3>
        <p className="text-lg text-slate-600 dark:text-gray-300">
          We're verifying your cryptocurrency payment. This usually takes 5-30 minutes
          depending on network congestion.
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200 dark:border-blue-700/50 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-800/80 rounded-lg">
            <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h4 className="font-semibold text-blue-800 dark:text-blue-100">Transaction Details</h4>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <span className="font-medium text-blue-700 dark:text-blue-200">Transaction Hash:</span>
            <span className="font-mono text-sm text-blue-600 dark:text-blue-300 break-all text-right ml-4">
              {transactionHash.slice(0, 20)}...
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-blue-700 dark:text-blue-200">Status:</span>
            <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
              Pending Confirmation
            </Badge>
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        onClick={() => window.open(`https://blockchair.com/search?q=${transactionHash}`, '_blank')}
        className="w-full h-12 text-lg border-2 border-blue-300 dark:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-700 dark:text-blue-300"
      >
        <ExternalLink className="mr-3 h-5 w-5" />
        View on Blockchain Explorer
      </Button>
    </div>
  );

  return (
    <Card className="w-full max-w-2xl mx-auto border-0 shadow-xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm dark:shadow-2xl dark:shadow-orange-500/10">
      <CardHeader className="text-center pb-8">
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-orange-500 to-yellow-500 dark:from-orange-400 dark:to-yellow-400 rounded-2xl flex items-center justify-center mb-6 shadow-lg dark:shadow-orange-500/25">
          <Bitcoin className="h-10 w-10 text-white" />
        </div>
        <CardTitle className="text-3xl font-bold text-slate-900 dark:text-gray-100 mb-3">Cryptocurrency Payment</CardTitle>
        <p className="text-lg text-slate-600 dark:text-gray-300">
          {program === "academy" ? "6-Month Academy Program" : "Monthly Mentorship Program"} - ${usdAmount}
        </p>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        {step === "select" && renderCryptoSelection()}
        {step === "pay" && renderPaymentInstructions()}
        {step === "verify" && renderVerification()}
      </CardContent>
    </Card>
  );
};
