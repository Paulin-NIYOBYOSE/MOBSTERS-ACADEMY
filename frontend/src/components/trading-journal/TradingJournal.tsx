import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useToast } from "../ui/use-toast";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Clock,
  Activity,
  Award,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  Wallet,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  tradingJournalService,
  Trade,
  TradeAnalytics,
} from "../../services/tradingJournalService";
import { tradingAccountService } from "../../services/tradingAccountService";
import EnhancedTradeForm from "./EnhancedTradeForm";

interface TradingJournalProps {
  className?: string;
}

const TradingJournal: React.FC<TradingJournalProps> = ({ className = "" }) => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [analytics, setAnalytics] = useState<TradeAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "trades" | "accounts"
  >("overview");
  const [showAddTrade, setShowAddTrade] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<number | null>(null);
  const [timeFilter, setTimeFilter] = useState<
    "week" | "month" | "year" | "custom"
  >("month");
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // Account management state
  const [accounts, setAccounts] = useState<any[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(false);
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: "",
    description: "",
    startingBalance: 10000,
    accountType: "DEMO" as "DEMO" | "LIVE",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTrades();
    fetchAnalytics();
  }, [
    selectedAccount,
    timeFilter,
    customStartDate,
    customEndDate,
    pagination.page,
  ]);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setAccountsLoading(true);
    try {
      const accountsData = await tradingAccountService.getAccounts();
      
      // Fetch real-time data for each account
      const accountsWithRealTimeData = await Promise.all(
        accountsData.map(async (account) => {
          try {
            // Get trades for this account to calculate real-time metrics
            const tradesData = await tradingJournalService.getTrades(
              1, // page
              1000, // limit - get all trades
              account.id, // accountId
              "custom", // period - use custom to get all data
              undefined, // startDate - no start date to get all
              undefined  // endDate - no end date to get all
            );
            
            // Get analytics for this account
            const analyticsData = await tradingJournalService.getAnalytics(
              account.id, // accountId
              "custom", // period - use custom to get all data
              undefined, // startDate - no start date to get all
              undefined  // endDate - no end date to get all
            );

            // Calculate real-time metrics
            const totalTrades = tradesData.pagination.total;
            const completedTrades = tradesData.trades.filter(trade => 
              trade.status === 'WIN' || trade.status === 'LOSS' || trade.status === 'BREAKEVEN'
            );
            
            const totalPnL = completedTrades.reduce((sum, trade) => 
              sum + (trade.profit || 0), 0
            );
            
            const currentBalance = account.startingBalance + totalPnL;
            
            const winTrades = completedTrades.filter(trade => trade.status === 'WIN').length;
            const winRate = completedTrades.length > 0 
              ? (winTrades / completedTrades.length) * 100 
              : 0;

            return {
              ...account,
              totalTrades,
              currentBalance,
              totalPnL,
              winRate: Math.round(winRate * 10) / 10, // Round to 1 decimal
              analytics: analyticsData,
              _count: { trades: totalTrades }
            };
          } catch (error) {
            console.error(`Error fetching data for account ${account.id}:`, error);
            // Return account with default values if error
            return {
              ...account,
              totalTrades: 0,
              currentBalance: account.startingBalance,
              totalPnL: 0,
              winRate: 0,
              _count: { trades: 0 }
            };
          }
        })
      );
      
      setAccounts(accountsWithRealTimeData);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      toast({
        title: "Error",
        description: "Failed to fetch trading accounts",
        variant: "destructive",
      });
    } finally {
      setAccountsLoading(false);
    }
  };

  const getDateRange = () => {
    const now = new Date();
    let startDate: string | undefined;
    let endDate: string | undefined;

    switch (timeFilter) {
      case "week":
        startDate = new Date(
          now.getTime() - 7 * 24 * 60 * 60 * 1000
        ).toISOString();
        break;
      case "month":
        startDate = new Date(
          now.getTime() - 30 * 24 * 60 * 60 * 1000
        ).toISOString();
        break;
      case "year":
        startDate = new Date(
          now.getTime() - 365 * 24 * 60 * 60 * 1000
        ).toISOString();
        break;
      case "custom":
        startDate = customStartDate?.toISOString();
        endDate = customEndDate?.toISOString();
        break;
    }

    return { startDate, endDate };
  };

  const fetchTrades = async () => {
    try {
      console.log("Fetching trades with params:", {
        page: pagination.page,
        limit: pagination.limit,
        accountId: selectedAccount,
        period: "custom",
        timeFilter,
        dateRange: getDateRange(),
      });

      const { startDate, endDate } = getDateRange();
      const data = await tradingJournalService.getTrades(
        pagination.page,
        pagination.limit,
        selectedAccount, // Use selected account for filtering
        "custom", // period - use custom since we're providing dates
        startDate,
        endDate
      );
      setTrades(data.trades);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching trades:", error);
      toast({
        title: "Error",
        description: "Failed to fetch trades",
        variant: "destructive",
      });
    }
  };

  const fetchAnalytics = async () => {
    try {
      console.log("Fetching analytics with params:", {
        accountId: selectedAccount,
        period: "custom",
        timeFilter,
        dateRange: getDateRange(),
      });

      const { startDate, endDate } = getDateRange();
      const data = await tradingJournalService.getAnalytics(
        selectedAccount, // Use selected account for filtering analytics
        "custom", // period - use custom since we're providing dates
        startDate,
        endDate
      );
      setAnalytics(data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast({
        title: "Error",
        description: "Failed to fetch analytics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) =>
    tradingJournalService.formatCurrency(amount);
  const formatPercentage = (value: number) =>
    tradingJournalService.formatPercentage(value);
  const getStatusColor = (status: string) =>
    tradingJournalService.getStatusColor(status);
  const getProfitColor = (profit?: number) =>
    tradingJournalService.getProfitColor(profit);

  const handleDeleteTrade = async (tradeId: number) => {
    try {
      await tradingJournalService.deleteTrade(tradeId);
      toast({
        title: "Success",
        description: "Trade deleted successfully",
      });
      fetchTrades();
      fetchAnalytics();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete trade",
        variant: "destructive",
      });
    }
  };

  const handleFormSuccess = () => {
    fetchTrades();
    fetchAnalytics();
  };

  const handleCreateAccount = async () => {
    try {
      const createdAccount = await tradingAccountService.createAccount({
        name: newAccount.name,
        startingBalance: newAccount.startingBalance,
        description: newAccount.description,
      });

      // Refresh accounts to get real-time data for all accounts including the new one
      await fetchAccounts();

      toast({
        title: "Success",
        description: `${newAccount.name} has been created successfully.`,
      });

      // Refresh trades and analytics to include the new account in filters
      fetchTrades();
      fetchAnalytics();

      setShowCreateAccount(false);
      setNewAccount({
        name: "",
        description: "",
        startingBalance: 10000,
        accountType: "DEMO",
      });
    } catch (error) {
      console.error("Error creating account:", error);
      toast({
        title: "Error",
        description: "Failed to create account",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        {[
          { key: "overview", label: "Overview", icon: BarChart3 },
          { key: "trades", label: "Trades", icon: Activity },
          { key: "accounts", label: "Accounts", icon: Wallet },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === key
                ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Modern Filter Controls */}
      <Card className="bg-gradient-to-r from-slate-50/80 to-blue-50/80 dark:from-slate-900/80 dark:to-blue-900/30 border-slate-200/60 dark:border-slate-700/60 shadow-lg backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center w-full">
              
              {/* Account Filter */}
              <div className="flex flex-col gap-2 min-w-[200px]">
                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                    <Filter className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  </div>
                  Trading Account
                </Label>
                <Select
                  value={selectedAccount?.toString() || "all"}
                  onValueChange={(value) =>
                    setSelectedAccount(
                      value === "all" ? null : parseInt(value)
                    )
                  }
                >
                  <SelectTrigger className="bg-white/80 dark:bg-slate-800/80 border-slate-300 dark:border-slate-600 shadow-sm hover:shadow-md transition-all duration-200 backdrop-blur-sm">
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-slate-200 dark:border-slate-700 shadow-xl">
                    <SelectItem value="all" className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                        All Accounts
                      </div>
                    </SelectItem>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id.toString()}>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
                          {account.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Time Period Filter */}
              <div className="flex flex-col gap-2 min-w-[180px]">
                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-md">
                    <Calendar className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  </div>
                  Time Period
                </Label>
                <Select
                  value={timeFilter}
                  onValueChange={(value) =>
                    setTimeFilter(value as "week" | "month" | "year" | "custom")
                  }
                >
                  <SelectTrigger className="bg-white/80 dark:bg-slate-800/80 border-slate-300 dark:border-slate-600 shadow-sm hover:shadow-md transition-all duration-200 backdrop-blur-sm">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-slate-200 dark:border-slate-700 shadow-xl">
                    <SelectItem value="week">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                        This Week
                      </div>
                    </SelectItem>
                    <SelectItem value="month">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                        This Month
                      </div>
                    </SelectItem>
                    <SelectItem value="year">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                        This Year
                      </div>
                    </SelectItem>
                    <SelectItem value="custom">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                        Custom Range
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Date Range */}
              {timeFilter === "custom" && (
                <div className="flex flex-col gap-2 min-w-[300px]">
                  <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-md">
                      <Calendar className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                    </div>
                    Date Range
                  </Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="date"
                      value={customStartDate?.toISOString().split("T")[0] || ""}
                      onChange={(e) =>
                        setCustomStartDate(
                          e.target.value ? new Date(e.target.value) : null
                        )
                      }
                      className="bg-white/80 dark:bg-slate-800/80 border-slate-300 dark:border-slate-600 shadow-sm hover:shadow-md transition-all duration-200 backdrop-blur-sm"
                    />
                    <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-md">
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">to</span>
                    </div>
                    <Input
                      type="date"
                      value={customEndDate?.toISOString().split("T")[0] || ""}
                      onChange={(e) =>
                        setCustomEndDate(
                          e.target.value ? new Date(e.target.value) : null
                        )
                      }
                      className="bg-white/80 dark:bg-slate-800/80 border-slate-300 dark:border-slate-600 shadow-sm hover:shadow-md transition-all duration-200 backdrop-blur-sm"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Filter Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedAccount(null);
                  setTimeFilter("month");
                  setCustomStartDate(null);
                  setCustomEndDate(null);
                }}
                className="bg-white/80 dark:bg-slate-800/80 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <XCircle className="w-3.5 h-3.5 mr-1.5" />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overview Tab */}
      {activeTab === "overview" && analytics && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                      Win Rate
                    </p>
                    <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                      {formatPercentage(analytics.winRate)}
                    </p>
                    <p className="text-xs text-green-600/70 dark:text-green-400/70 mt-1">
                      {analytics.totalTrades > 0
                        ? `${Math.round(
                            (analytics.winRate * analytics.totalTrades) / 100
                          )} wins`
                        : "No trades"}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-800/30 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="mt-4">
                  <Progress value={analytics.winRate} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      Avg Risk:Reward
                    </p>
                    <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                      1:{analytics.averageRR.toFixed(2)}
                    </p>
                    <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">
                      {analytics.averageRR >= 2
                        ? "Excellent"
                        : analytics.averageRR >= 1.5
                        ? "Good"
                        : analytics.averageRR >= 1
                        ? "Fair"
                        : "Poor"}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800/30 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                      Total P&L
                    </p>
                    <p
                      className={`text-3xl font-bold ${getProfitColor(
                        analytics.totalProfit
                      )}`}
                    >
                      {formatCurrency(analytics.totalProfit)}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {analytics.totalProfit > 0 ? (
                        <TrendingUp className="w-3 h-3 text-green-500" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-500" />
                      )}
                      <p className="text-xs text-purple-600/70 dark:text-purple-400/70">
                        {analytics.totalTrades > 0
                          ? `${formatCurrency(
                              analytics.totalProfit / analytics.totalTrades
                            )} per trade`
                          : "No trades"}
                      </p>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-800/30 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-200 dark:border-red-800 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">
                      Max Drawdown
                    </p>
                    <p className="text-3xl font-bold text-red-700 dark:text-red-300">
                      {formatCurrency(analytics.maxDrawdown)}
                    </p>
                    <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-1">
                      {analytics.maxDrawdown === 0
                        ? "No drawdown"
                        : "Peak to trough"}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-800/30 rounded-lg flex items-center justify-center">
                    <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                      Profit Factor
                    </p>
                    <p className="text-3xl font-bold text-amber-700 dark:text-amber-300">
                      {analytics.profitFactor.toFixed(2)}
                    </p>
                    <p className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-1">
                      {analytics.profitFactor >= 2
                        ? "Excellent"
                        : analytics.profitFactor >= 1.5
                        ? "Good"
                        : analytics.profitFactor >= 1
                        ? "Profitable"
                        : "Losing"}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-amber-100 dark:bg-amber-800/30 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border-teal-200 dark:border-teal-800 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-teal-600 dark:text-teal-400">
                      Total Trades
                    </p>
                    <p className="text-3xl font-bold text-teal-700 dark:text-teal-300">
                      {analytics.totalTrades}
                    </p>
                    <p className="text-xs text-teal-600/70 dark:text-teal-400/70 mt-1">
                      {analytics.totalTrades >= 100
                        ? "High volume"
                        : analytics.totalTrades >= 30
                        ? "Good sample"
                        : "Small sample"}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-teal-100 dark:bg-teal-800/30 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-200 dark:border-emerald-800 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      Best Streak
                    </p>
                    <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">
                      {analytics.consecutiveWins}
                    </p>
                    <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mt-1">
                      Consecutive wins
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-800/30 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/20 border-rose-200 dark:border-rose-800 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-rose-600 dark:text-rose-400">
                      Worst Streak
                    </p>
                    <p className="text-3xl font-bold text-rose-700 dark:text-rose-300">
                      {analytics.consecutiveLosses}
                    </p>
                    <p className="text-xs text-rose-600/70 dark:text-rose-400/70 mt-1">
                      Consecutive losses
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-rose-100 dark:bg-rose-800/30 rounded-lg flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Equity Curve */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Equity Curve
                <Badge variant="secondary" className="ml-auto">
                  {analytics.equityCurve.length} data points
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {analytics.equityCurve.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics.equityCurve}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="opacity-30"
                      />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) =>
                          new Date(value).toLocaleDateString()
                        }
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => formatCurrency(value)}
                      />
                      <Tooltip
                        formatter={(value: any) => [
                          formatCurrency(value),
                          "Equity",
                        ]}
                        labelFormatter={(label) =>
                          `Date: ${new Date(label).toLocaleDateString()}`
                        }
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="equity"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No equity data available</p>
                    <p className="text-sm">
                      Start trading to see your equity curve
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Profit Factor
                    </p>
                    <p className="text-2xl font-bold">
                      {analytics.profitFactor.toFixed(2)}
                    </p>
                  </div>
                  <Award className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Trades
                    </p>
                    <p className="text-2xl font-bold">
                      {analytics.totalTrades}
                    </p>
                  </div>
                  <Activity className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Best Streak
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {analytics.consecutiveWins}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Trades Tab */}
      {activeTab === "trades" && (
        <div className="space-y-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setSelectedTrade(null);
                  setShowAddTrade(true);
                }}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Trade
              </Button>
            </div>

            {/* Pagination Info */}
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span>
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} trades
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      page: Math.max(1, prev.page - 1),
                    }))
                  }
                  disabled={pagination.page <= 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      page: Math.min(prev.totalPages, prev.page + 1),
                    }))
                  }
                  disabled={pagination.page >= pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>

          {/* Modern Trades Table */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20">
              <CardTitle>Trade History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-gray-800">
                      <TableHead className="font-semibold">
                        Date & Time
                      </TableHead>
                      <TableHead className="font-semibold">Account</TableHead>
                      <TableHead className="font-semibold">Pair</TableHead>
                      <TableHead className="font-semibold">Type</TableHead>
                      <TableHead className="font-semibold">Risk %</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">P&L</TableHead>
                      <TableHead className="font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trades.map((trade) => (
                      <TableRow
                        key={trade.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <TableCell>
                          <div className="text-sm font-medium">
                            {new Date(trade.time).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(trade.time).toLocaleTimeString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">
                            {trade.account?.name || "Unknown"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {trade.account?.currentBalance
                              ? formatCurrency(trade.account.currentBalance)
                              : "-"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono font-bold text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                            {trade.pair}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              trade.type === "BUY" ? "default" : "secondary"
                            }
                            className="text-xs"
                          >
                            {trade.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {trade.riskPercent ? `${trade.riskPercent}%` : "-"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              trade.status === "RUNNING"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : trade.status === "WIN"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-red-50 text-red-700 border-red-200"
                            }`}
                          >
                            {trade.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {trade.profit !== undefined ? (
                            <span
                              className={`font-bold text-sm ${getProfitColor(
                                trade.profit
                              )}`}
                            >
                              {formatCurrency(trade.profit)}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 px-2"
                              onClick={() => setSelectedTrade(trade)}
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 px-2"
                              onClick={() => {
                                setSelectedTrade(trade);
                                setShowAddTrade(true);
                              }}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 px-2"
                              onClick={() => handleDeleteTrade(trade.id)}
                            >
                              <Trash2 className="w-3 h-3" />
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

          {/* Advanced Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            {/* Performance Breakdown */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                  <Award className="w-5 h-5" />
                  Performance Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Average Win</span>
                    <span className="text-green-600 dark:text-green-400 font-semibold">
                      {formatCurrency(analytics.averageWin)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Average Loss</span>
                    <span className="text-red-600 dark:text-red-400 font-semibold">
                      {formatCurrency(analytics.averageLoss)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Largest Win</span>
                    <span className="text-green-600 dark:text-green-400 font-semibold">
                      {formatCurrency(analytics.largestWin)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Largest Loss</span>
                    <span className="text-red-600 dark:text-red-400 font-semibold">
                      {formatCurrency(analytics.largestLoss)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Management */}
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
                  <AlertTriangle className="w-5 h-5" />
                  Risk Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      Max Consecutive Wins
                    </span>
                    <span className="text-green-600 dark:text-green-400 font-semibold">
                      {analytics.consecutiveWins}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      Max Consecutive Losses
                    </span>
                    <span className="text-red-600 dark:text-red-400 font-semibold">
                      {analytics.consecutiveLosses}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Profit Factor</span>
                    <span
                      className={`font-semibold ${
                        analytics.profitFactor > 1
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {analytics.profitFactor.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Max Drawdown</span>
                    <span className="text-red-600 dark:text-red-400 font-semibold">
                      {formatCurrency(analytics.maxDrawdown)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Accounts Tab */}
      {activeTab === "accounts" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                Trading Accounts
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Manage your trading accounts and view performance
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchAccounts}
                disabled={accountsLoading}
                className="bg-white/80 dark:bg-slate-800/80 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Activity className={`w-4 h-4 mr-2 ${accountsLoading ? 'animate-spin' : ''}`} />
                {accountsLoading ? 'Refreshing...' : 'Refresh Data'}
              </Button>
              <Button
                onClick={() => setShowCreateAccount(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Account
              </Button>
            </div>
          </div>

          {/* Accounts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((account) => (
              <Card
                key={account.id}
                className="overflow-hidden bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                          {account.name}
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className="text-xs mt-1 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
                        >
                          TRADING
                        </Badge>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="h-8 px-2">
                      <Edit className="w-3 h-3" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {account.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Starting Balance
                      </p>
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        ${account.startingBalance?.toLocaleString() || "0"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Current Balance
                      </p>
                      <p className={`text-lg font-bold ${
                        (account.currentBalance || account.startingBalance) >= account.startingBalance
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        ${(account.currentBalance || account.startingBalance)?.toLocaleString() || "0"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <div className="space-y-1">
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Total P&L
                      </p>
                      <p className={`text-sm font-semibold ${
                        (account.totalPnL || 0) >= 0
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {(account.totalPnL || 0) >= 0 ? '+' : ''}${(account.totalPnL || 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Win Rate
                      </p>
                      <p className={`text-sm font-semibold ${
                        (account.winRate || 0) >= 50
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {(account.winRate || 0).toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <div className="space-y-1">
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Total Trades
                      </p>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {account.totalTrades || account._count?.trades || 0}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Created
                      </p>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {new Date(account.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Create Account Dialog */}
          <Dialog open={showCreateAccount} onOpenChange={setShowCreateAccount}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  Create New Trading Account
                </DialogTitle>
                <DialogDescription>
                  Create a new trading account to organize your trades and track
                  performance.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="accountName">Account Name *</Label>
                  <Input
                    id="accountName"
                    value={newAccount.name}
                    onChange={(e) =>
                      setNewAccount((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="e.g., Live Trading Account"
                    className="bg-white dark:bg-slate-800"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startingBalance">Starting Balance *</Label>
                  <Input
                    id="startingBalance"
                    type="number"
                    value={newAccount.startingBalance}
                    onChange={(e) =>
                      setNewAccount((prev) => ({
                        ...prev,
                        startingBalance: parseFloat(e.target.value) || 0,
                      }))
                    }
                    placeholder="10000"
                    className="bg-white dark:bg-slate-800"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newAccount.description}
                    onChange={(e) =>
                      setNewAccount((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Optional description for this account..."
                    rows={3}
                    className="bg-white dark:bg-slate-800"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => setShowCreateAccount(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateAccount}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    disabled={
                      !newAccount.name || newAccount.startingBalance <= 0
                    }
                  >
                    Create Account
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Trade Form Modal */}
      <EnhancedTradeForm
        isOpen={showAddTrade}
        onClose={() => {
          setShowAddTrade(false);
          setSelectedTrade(null);
        }}
        onSuccess={() => {
          fetchTrades();
          fetchAnalytics();
        }}
      />
    </div>
  );
};

export default TradingJournal;
