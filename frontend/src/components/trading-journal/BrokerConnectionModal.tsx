import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { tradingAccountService } from "@/services/tradingAccountService";

interface BrokerConnectionModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  accountId?: number;
}

const BrokerConnectionModal: React.FC<BrokerConnectionModalProps> = ({
  open,
  onClose,
  onSuccess,
  accountId,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [brokerType, setBrokerType] = useState<string>("MT4");
  const [formData, setFormData] = useState({
    accountNumber: "",
    serverName: "",
    apiKey: "",
    apiSecret: "",
    autoSync: true,
  });

  const handleConnect = async () => {
    try {
      setLoading(true);

      if (!accountId) {
        toast({
          title: "Error",
          description: "Please select a trading account first",
          variant: "destructive",
        });
        return;
      }

      // Update account with broker connection details
      await tradingAccountService.updateAccount(accountId, {
        ...formData,
        brokerType,
        isConnected: true,
      } as any);

      toast({
        title: "Success",
        description: "Broker connected successfully",
      });

      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect broker",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Connect Trading Account</DialogTitle>
          <DialogDescription>
            Connect your broker account to automatically import trades
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Broker Type Selection */}
          <div className="space-y-2">
            <Label>Broker Platform</Label>
            <div className="grid grid-cols-2 gap-3">
              {["MT4", "MT5", "CTRADER", "TRADINGVIEW"].map((type) => (
                <button
                  key={type}
                  onClick={() => setBrokerType(type)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    brokerType === type
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                  }`}
                >
                  <div className="font-semibold">{type}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {type === "MT4" && "MetaTrader 4"}
                    {type === "MT5" && "MetaTrader 5"}
                    {type === "CTRADER" && "cTrader"}
                    {type === "TRADINGVIEW" && "TradingView"}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Account Number */}
          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              placeholder="Enter your account number"
              value={formData.accountNumber}
              onChange={(e) =>
                setFormData({ ...formData, accountNumber: e.target.value })
              }
            />
          </div>

          {/* Server Name (for MT4/MT5) */}
          {(brokerType === "MT4" || brokerType === "MT5") && (
            <div className="space-y-2">
              <Label htmlFor="serverName">Server Name</Label>
              <Input
                id="serverName"
                placeholder="e.g., ICMarkets-Demo01"
                value={formData.serverName}
                onChange={(e) =>
                  setFormData({ ...formData, serverName: e.target.value })
                }
              />
            </div>
          )}

          {/* API Credentials */}
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key (Optional)</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Enter API key if available"
              value={formData.apiKey}
              onChange={(e) =>
                setFormData({ ...formData, apiKey: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiSecret">API Secret (Optional)</Label>
            <Input
              id="apiSecret"
              type="password"
              placeholder="Enter API secret if available"
              value={formData.apiSecret}
              onChange={(e) =>
                setFormData({ ...formData, apiSecret: e.target.value })
              }
            />
          </div>

          {/* Auto Sync */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="autoSync"
              checked={formData.autoSync}
              onChange={(e) =>
                setFormData({ ...formData, autoSync: e.target.checked })
              }
              className="rounded border-gray-300"
            />
            <Label htmlFor="autoSync" className="cursor-pointer">
              Automatically sync trades daily
            </Label>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> For MT4/MT5, you'll need to install our
              trade sync plugin. For other platforms, API credentials enable
              automatic trade import.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleConnect} disabled={loading}>
            {loading ? "Connecting..." : "Connect Account"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BrokerConnectionModal;
