import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Plus, TrendingUp, TrendingDown, DollarSign, Target, Settings, Filter } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Types
interface TradingAccount {
  id: number;
  name: string;
  startingBalance: number;
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

interface TradeAnalytics {
  totalTrades: number;
  winRate: number;
  totalProfit: number;
  currentBalance: number;
  equityCurve: Array<{ date: string; balance: number }>;
}

const EnhancedTradingJournal: React.FC = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [accounts, setAccounts] = useState<TradingAccount[]>([]);
  const [analytics, setAnalytics] = useState<TradeAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<number | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('month');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [showAccountDialog, setShowAccountDialog] = useState(false);
  const [showTradeDialog, setShowTradeDialog] = useState(false);

  // Mock data for development
  useEffect(() => {
    // Mock accounts
    const mockAccounts: TradingAccount[] = [
      { id: 1, name: 'Live Account', startingBalance: 10000, description: 'Main trading account' },
      { id: 2, name: 'Demo Account', startingBalance: 5000, description: 'Practice account' },
    ];

    // Mock trades
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
        accountId: 1,
        account: mockAccounts[0],
        pair: 'GBPJPY',
        type: 'SELL',
        time: '2024-10-21T14:15:00Z',
        riskPercent: 1.5,
        notes: 'Bearish divergence on RSI',
        status: 'RUNNING',
        createdAt: '2024-10-21T14:15:00Z',
      },
    ];

    // Mock analytics
    const mockAnalytics: TradeAnalytics = {
      totalTrades: 15,
      winRate: 73.3,
      totalProfit: 1250.75,
      currentBalance: 11250.75,
      equityCurve: [
        { date: '2024-10-01', balance: 10000 },
        { date: '2024-10-15', balance: 10625 },
        { date: '2024-10-27', balance: 11250 },
      ],
    };

    setAccounts(mockAccounts);
    setTrades(mockTrades);
    setAnalytics(mockAnalytics);
    setLoading(false);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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
                Manage Accounts
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
                        <p className="text-sm font-medium">Starting Balance: {formatCurrency(account.startingBalance)}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <Button className="w-full">Add New Account</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button onClick={() => setShowTradeDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Trade
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Trades</p>
                  <p className="text-2xl font-bold">{analytics.totalTrades}</p>
                </div>
                <Target className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Win Rate</p>
                  <p className="text-2xl font-bold text-green-600">{analytics.winRate.toFixed(1)}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total P&L</p>
                  <p className={`text-2xl font-bold ${getProfitColor(analytics.totalProfit)}`}>
                    {formatCurrency(analytics.totalProfit)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Balance</p>
                  <p className="text-2xl font-bold text-purple-600">${analytics.currentBalance?.toFixed(2) || '0.00'}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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
              <Label htmlFor="account-select">Trading Account</Label>
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
              <Label htmlFor="period-select">Period</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {selectedPeriod === 'custom' && (
              <>
                <div>
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
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

      {/* Trades Table */}
      <Card>
        <CardHeader>
          <CardTitle>Trade History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Pair</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Risk %</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>P&L</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trades.map((trade) => (
                  <TableRow key={trade.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{formatDate(trade.time)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{trade.account.name}</div>
                        <div className="text-xs text-gray-500">
                          {formatCurrency(trade.account.startingBalance)} starting
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono font-semibold">{trade.pair}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={trade.type === 'BUY' ? 'default' : 'secondary'}>
                        {trade.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {trade.riskPercent ? `${trade.riskPercent}%` : '-'}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(trade.status, trade.result)}
                    </TableCell>
                    <TableCell>
                      {trade.profit !== undefined ? (
                        <span className={`font-semibold ${getProfitColor(trade.profit)}`}>
                          {formatCurrency(trade.profit)}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate text-sm text-gray-600">
                        {trade.notes || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Delete
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

export default EnhancedTradingJournal;
