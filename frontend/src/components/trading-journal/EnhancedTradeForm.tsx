import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
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

  const fetchAccounts = async () => {
    try {
      const accountsData = await tradingAccountService.getAccounts();
      setAccounts(accountsData);
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
                <Label htmlFor="profit">Profit/Loss ($)</Label>
                <Input
                  id="profit"
                  type="number"
                  step="0.01"
                  value={formData.profit || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, profit: parseFloat(e.target.value) || undefined }))}
                  placeholder="Enter profit or loss amount"
                />
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
