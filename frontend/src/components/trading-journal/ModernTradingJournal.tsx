import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Plus, TrendingUp, TrendingDown, DollarSign, Target, Settings, Filter, Eye } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

interface TradingAccount {
  id: number;
  name: string;
  startingBalance: number;
  currentBalance: number;
  description?: string;
}

interface Trade {
  id: number;
  accountId: number;
  account: TradingAccount;
  pair: string;
  type: 'BUY' | 'SELL';
  time: string;
  chartLink?: string;
  riskPercent?: number;
  result?: 'WIN' | 'LOSS';
  notes?: string;
  profit?: number;
  status: 'RUNNING' | 'CLOSED';
  createdAt: string;
}

const ModernTradingJournal: React.FC = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [accounts, setAccounts] = useState<TradingAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<number | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('month');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [showTradeDialog, setShowTradeDialog] = useState(false);
  const [showAccountDialog, setShowAccountDialog] = useState(false);

  // Trade form state
  const [selectedAccounts, setSelectedAccounts] = useState<number[]>([]);
  const [tradeForm, setTradeForm] = useState({
    pair: '',
    type: 'BUY' as 'BUY' | 'SELL',
    time: new Date().toISOString().slice(0, 16),
    chartLink: '',
    riskPercent: 1.0,
    result: undefined as 'WIN' | 'LOSS' | undefined,
    notes: '',
    profit: undefined as number | undefined,
    status: 'RUNNING' as 'RUNNING' | 'CLOSED',
  });

  // Mock data
  useEffect(() => {
    const mockAccounts: TradingAccount[] = [
      { id: 1, name: 'Live Account', startingBalance: 10000, currentBalance: 11250, description: 'Main trading account' },
      { id: 2, name: 'Demo Account', startingBalance: 5000, currentBalance: 5320, description: 'Practice account' },
      { id: 3, name: 'Swing Trading', startingBalance: 15000, currentBalance: 16800, description: 'Long-term positions' },
    ];

    const mockTrades: Trade[] = [
      {
        id: 1,
        accountId: 1,
        account: mockAccounts[0],
        pair: 'EURUSD',
        type: 'BUY',
        time: '2024-10-20T09:30:00Z',
        riskPercent: 2.0,
        result: 'WIN',
        notes: 'Bullish breakout above resistance',
        profit: 245.50,
        status: 'CLOSED',
        createdAt: '2024-10-20T09:30:00Z',
      },
      {
        id: 2,
        accountId: 2,
        account: mockAccounts[1],
        pair: 'GBPJPY',
        type: 'SELL',
        time: '2024-10-21T14:15:00Z',
        riskPercent: 1.5,
        notes: 'Bearish divergence on RSI',
        status: 'RUNNING',
        createdAt: '2024-10-21T14:15:00Z',
      },
    ];

    setAccounts(mockAccounts);
    setTrades(mockTrades);
    setLoading(false);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const getProfitColor = (profit?: number) => {
    if (!profit) return 'text-gray-500';
    return profit > 0 ? 'text-green-600' : 'text-red-600';
  };

  const getStatusBadge = (status: string, result?: string) => {
    if (status === 'RUNNING') {
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Running</Badge>;
    }
    if (result === 'WIN') {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Win</Badge>;
    }
    if (result === 'LOSS') {
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Loss</Badge>;
    }
    return <Badge variant="outline">Closed</Badge>;
  };

  const handleAccountToggle = (accountId: number) => {
    setSelectedAccounts(prev => 
      prev.includes(accountId) 
        ? prev.filter(id => id !== accountId)
        : [...prev, accountId]
    );
  };

  const handleTradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAccounts.length === 0) {
      alert('Please select at least one account');
      return;
    }

    // Create trade for each selected account
    for (const accountId of selectedAccounts) {
      const account = accounts.find(acc => acc.id === accountId);
      if (account) {
        const newTrade: Trade = {
          id: Date.now() + accountId,
          accountId,
          account,
          ...tradeForm,
          createdAt: new Date().toISOString(),
        };
        setTrades(prev => [newTrade, ...prev]);
      }
    }

    // Reset form
    setTradeForm({
      pair: '', type: 'BUY', time: new Date().toISOString().slice(0, 16),
      chartLink: '', riskPercent: 1.0, result: undefined, notes: '',
      profit: undefined, status: 'RUNNING',
    });
    setSelectedAccounts([]);
    setShowTradeDialog(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Trading Journal</h1>
          <p className="text-gray-600 dark:text-gray-400">Track and analyze your trading performance</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showAccountDialog} onOpenChange={setShowAccountDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Accounts
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Trading Accounts</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {accounts.map((account) => (
                  <div key={account.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{account.name}</h3>
                        <p className="text-sm text-gray-600">{account.description}</p>
                        <div className="flex gap-4 mt-2">
                          <span className="text-sm">Starting: {formatCurrency(account.startingBalance)}</span>
                          <span className="text-sm font-medium">Current: {formatCurrency(account.currentBalance)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={showTradeDialog} onOpenChange={setShowTradeDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Trade
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Trade</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleTradeSubmit} className="space-y-6">
                {/* Account Selection */}
                <div>
                  <Label>Select Accounts *</Label>
                  <div className="grid grid-cols-1 gap-3 mt-2">
                    {accounts.map((account) => (
                      <div key={account.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <Checkbox
                          checked={selectedAccounts.includes(account.id)}
                          onCheckedChange={() => handleAccountToggle(account.id)}
                        />
                        <div className="flex-1">
                          <div className="font-medium">{account.name}</div>
                          <div className="text-sm text-gray-600">{account.description}</div>
                          <div className="text-sm text-green-600">{formatCurrency(account.currentBalance)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trade Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Currency Pair *</Label>
                    <Input
                      value={tradeForm.pair}
                      onChange={(e) => setTradeForm(prev => ({ ...prev, pair: e.target.value }))}
                      placeholder="EURUSD"
                      required
                    />
                  </div>
                  <div>
                    <Label>Trade Type *</Label>
                    <Select value={tradeForm.type} onValueChange={(value: 'BUY' | 'SELL') => setTradeForm(prev => ({ ...prev, type: value }))}>
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
                    <Label>Entry Time *</Label>
                    <Input
                      type="datetime-local"
                      value={tradeForm.time}
                      onChange={(e) => setTradeForm(prev => ({ ...prev, time: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label>Risk %</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={tradeForm.riskPercent}
                      onChange={(e) => setTradeForm(prev => ({ ...prev, riskPercent: parseFloat(e.target.value) }))}
                    />
                  </div>
                </div>

                <div>
                  <Label>Notes</Label>
                  <Textarea
                    value={tradeForm.notes}
                    onChange={(e) => setTradeForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Trade analysis and observations..."
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setShowTradeDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Trade</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label>Trading Account</Label>
              <Select value={selectedAccount?.toString() || 'all'} onValueChange={(value) => setSelectedAccount(value === 'all' ? null : parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Accounts</SelectItem>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id.toString()}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Period</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {selectedPeriod === 'custom' && (
              <>
                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modern Trades Table */}
      <Card>
        <CardHeader>
          <CardTitle>Trade History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800">
                  <TableHead className="font-semibold">Date & Time</TableHead>
                  <TableHead className="font-semibold">Account</TableHead>
                  <TableHead className="font-semibold">Pair</TableHead>
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold">Risk %</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">P&L</TableHead>
                  <TableHead className="font-semibold">Notes</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trades.map((trade) => (
                  <TableRow key={trade.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium">{formatDate(trade.time)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-sm">{trade.account.name}</div>
                        <div className="text-xs text-gray-500">
                          {formatCurrency(trade.account.currentBalance)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono font-bold text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        {trade.pair}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={trade.type === 'BUY' ? 'default' : 'secondary'} className="text-xs">
                        {trade.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{trade.riskPercent ? `${trade.riskPercent}%` : '-'}</span>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(trade.status, trade.result)}
                    </TableCell>
                    <TableCell>
                      {trade.profit !== undefined ? (
                        <span className={`font-bold text-sm ${getProfitColor(trade.profit)}`}>
                          {formatCurrency(trade.profit)}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate text-sm text-gray-600">
                        {trade.notes || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" className="h-8 px-2">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 px-2">
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModernTradingJournal;
