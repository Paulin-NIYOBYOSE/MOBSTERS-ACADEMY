import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { tradingAccountService } from '../../services/tradingAccountService';
import { tradingJournalService } from '../../services/tradingJournalService';
import { useToast } from '../../hooks/use-toast';

interface TradingAccount {
  id: number;
  name: string;
  startingBalance: number;
  currentBalance: number;
  description?: string;
}

interface EnhancedTradeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const EnhancedTradeForm: React.FC<EnhancedTradeFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [accounts, setAccounts] = useState<TradingAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    pair: '',
    type: 'BUY' as 'BUY' | 'SELL',
    time: new Date().toISOString().slice(0, 16),
    chartLink: '',
    riskPercent: 1.0,
    profit: undefined as number | undefined,
    status: 'RUNNING' as 'RUNNING' | 'WIN' | 'LOSS' | 'BREAKEVEN',
    notes: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchAccounts();
    }
  }, [isOpen]);

  // Auto-handle profit based on status
  useEffect(() => {
    if (formData.status === 'BREAKEVEN') {
      setFormData(prev => ({ ...prev, profit: 0 }));
    } else if (formData.status === 'RUNNING') {
      setFormData(prev => ({ ...prev, profit: undefined }));
    }
  }, [formData.status]);

  const fetchAccounts = async () => {
    try {
      const accountsData = await tradingAccountService.getAccounts();
      
      // If no accounts exist, create a default one
      if (accountsData.length === 0) {
        const defaultAccount = await tradingAccountService.createAccount({
          name: 'Main Account',
          startingBalance: 10000,
          description: 'Default trading account'
        });
        setAccounts([defaultAccount]);
        setSelectedAccountId(defaultAccount.id);
        toast({
          title: 'Account Created',
          description: 'A default trading account has been created for you.',
        });
      } else {
        setAccounts(accountsData);
        // Auto-select the first account if none is selected
        if (!selectedAccountId && accountsData.length > 0) {
          setSelectedAccountId(accountsData[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch trading accounts',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccountId) {
      toast({
        title: 'Error',
        description: 'Please select an account',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const tradeData = {
        ...formData,
        accountId: selectedAccountId,
        time: new Date(formData.time).toISOString(),
      };
      
      await tradingJournalService.createTrade(tradeData);
      
      toast({
        title: 'Success',
        description: 'Trade created successfully',
      });
      
      onSuccess();
      onClose();
      
      // Reset form
      setFormData({
        pair: '',
        type: 'BUY',
        time: new Date().toISOString().slice(0, 16),
        chartLink: '',
        riskPercent: 1.0,
        profit: undefined,
        status: 'RUNNING',
        notes: '',
      });
      setSelectedAccountId(null);
    } catch (error) {
      console.error('Error creating trade:', error);
      toast({
        title: 'Error',
        description: 'Failed to create trade',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Trade</DialogTitle>
          <DialogDescription>
            Fill in the details below to record a new trade in your journal.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Account Selection */}
          <div>
            <Label htmlFor="account">Trading Account *</Label>
            <Select value={selectedAccountId?.toString() || ''} onValueChange={(value) => setSelectedAccountId(parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Select an account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id.toString()}>
                    <div className="flex flex-col">
                      <span className="font-medium">{account.name}</span>
                      <span className="text-sm text-gray-500">
                        {account.description} - {formatCurrency(account.currentBalance)}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Trade Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pair">Currency Pair *</Label>
              <Input
                id="pair"
                value={formData.pair}
                onChange={(e) => setFormData(prev => ({ ...prev, pair: e.target.value }))}
                placeholder="EURUSD"
                required
              />
            </div>
            <div>
              <Label htmlFor="type">Trade Type *</Label>
              <Select value={formData.type} onValueChange={(value: 'BUY' | 'SELL') => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BUY">BUY</SelectItem>
                  <SelectItem value="SELL">SELL</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="time">Entry Time *</Label>
              <Input
                id="time"
                type="datetime-local"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="riskPercent">Risk %</Label>
              <Input
                id="riskPercent"
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={formData.riskPercent}
                onChange={(e) => setFormData(prev => ({ ...prev, riskPercent: parseFloat(e.target.value) || 0 }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="chartLink">Chart Link (Optional)</Label>
            <Input
              id="chartLink"
              type="url"
              value={formData.chartLink}
              onChange={(e) => setFormData(prev => ({ ...prev, chartLink: e.target.value }))}
              placeholder="https://tradingview.com/chart/..."
            />
          </div>

          {/* Trade Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Trade Status *</Label>
              <Select value={formData.status} onValueChange={(value: 'RUNNING' | 'WIN' | 'LOSS' | 'BREAKEVEN') => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RUNNING">Running</SelectItem>
                  <SelectItem value="WIN">Win</SelectItem>
                  <SelectItem value="LOSS">Loss</SelectItem>
                  <SelectItem value="BREAKEVEN">Breakeven</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(formData.status === 'WIN' || formData.status === 'LOSS' || formData.status === 'BREAKEVEN') && (
              <div>
                <Label htmlFor="profit">
                  {formData.status === 'WIN' ? 'Profit ($)' : 
                   formData.status === 'LOSS' ? 'Loss ($)' : 
                   'Profit/Loss ($)'}
                </Label>
                <Input
                  id="profit"
                  type="number"
                  step="0.01"
                  min={formData.status === 'WIN' ? "0.01" : formData.status === 'BREAKEVEN' ? "0" : undefined}
                  max={formData.status === 'LOSS' ? "-0.01" : formData.status === 'BREAKEVEN' ? "0" : undefined}
                  value={formData.profit !== undefined ? formData.profit : ''}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (isNaN(value)) {
                      setFormData(prev => ({ ...prev, profit: undefined }));
                      return;
                    }
                    
                    // Validate based on status
                    if (formData.status === 'WIN' && value < 0) {
                      return; // Don't allow negative values for WIN
                    }
                    if (formData.status === 'LOSS' && value > 0) {
                      return; // Don't allow positive values for LOSS
                    }
                    if (formData.status === 'BREAKEVEN' && value !== 0) {
                      return; // Only allow 0 for BREAKEVEN
                    }
                    
                    setFormData(prev => ({ ...prev, profit: value }));
                  }}
                  placeholder={
                    formData.status === 'WIN' ? 'Enter profit amount (positive)' :
                    formData.status === 'LOSS' ? 'Enter loss amount (negative)' :
                    formData.status === 'BREAKEVEN' ? '0' : 'Enter amount'
                  }
                  disabled={formData.status === 'BREAKEVEN'}
                  className={formData.status === 'BREAKEVEN' ? 'bg-gray-100 dark:bg-gray-800' : ''}
                />
                {formData.status === 'WIN' && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    Enter positive profit amount only
                  </p>
                )}
                {formData.status === 'LOSS' && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    Enter negative loss amount only
                  </p>
                )}
                {formData.status === 'BREAKEVEN' && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Breakeven trades have no profit or loss
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Notes/Comments */}
          <div>
            <Label htmlFor="notes">Notes/Comments</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Add any notes or comments about this trade..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedAccountId || loading}>
              {loading ? 'Creating...' : 'Add Trade'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedTradeForm;
