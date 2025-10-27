import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
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
import EnhancedTradeForm from "./EnhancedTradeForm";

interface TradingJournalProps {
  className?: string;
}

const TradingJournal: React.FC<TradingJournalProps> = ({ className = "" }) => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [analytics, setAnalytics] = useState<TradeAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "trades" | "analytics"
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
        accountId: undefined, // No account filter in old component
        period: "custom", // Use custom period
        timeFilter,
        dateRange: getDateRange(),
      });

      const { startDate, endDate } = getDateRange();
      const data = await tradingJournalService.getTrades(
        pagination.page,
        pagination.limit,
        undefined, // accountId - no account filter in old component
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
        accountId: undefined,
        period: "custom",
        timeFilter,
        dateRange: getDateRange(),
      });

      const { startDate, endDate } = getDateRange();
      const data = await tradingJournalService.getAnalytics(
        undefined, // accountId - no account filter in old component
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
          { key: "analytics", label: "Analytics", icon: TrendingUp },
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

      {/* Filter Controls */}
      <Card className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200/50 dark:border-blue-800/50">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              {/* Time Filter */}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Period:
                </span>
                <div className="flex gap-1 bg-white dark:bg-gray-800 p-1 rounded-lg border">
                  {["7D", "30D", "90D", "1Y", "ALL"].map((period) => (
                    <button
                      key={period}
                      onClick={() => setTimeFilter(period as any)}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        timeFilter === period
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              {/* Account and Period Filters */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Account:
                  </span>
                  <select
                    value={selectedAccount?.toString() || "all"}
                    onChange={(e) =>
                      setSelectedAccount(
                        e.target.value === "all"
                          ? null
                          : parseInt(e.target.value)
                      )
                    }
                    className="px-3 py-1 rounded text-xs font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600"
                  >
                    <option value="all">All Accounts</option>
                    <option value="1">Live Account</option>
                    <option value="2">Demo Account</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Period:
                  </span>
                  <select
                    value={timeFilter}
                    onChange={(e) =>
                      setTimeFilter(
                        e.target.value as "week" | "month" | "year" | "custom"
                      )
                    }
                    className="px-3 py-1 rounded text-xs font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600"
                  >
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>

                {timeFilter === "custom" && (
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={customStartDate?.toISOString().split("T")[0] || ""}
                      onChange={(e) =>
                        setCustomStartDate(
                          e.target.value ? new Date(e.target.value) : null
                        )
                      }
                      className="px-2 py-1 rounded text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600"
                    />
                    <span className="text-xs text-gray-500">to</span>
                    <input
                      type="date"
                      value={customEndDate?.toISOString().split("T")[0] || ""}
                      onChange={(e) =>
                        setCustomEndDate(
                          e.target.value ? new Date(e.target.value) : null
                        )
                      }
                      className="px-2 py-1 rounded text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600"
                    />
                  </div>
                )}
              </div>
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
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && analytics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Win/Loss Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Breakdown</CardTitle>
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
            <Card>
              <CardHeader>
                <CardTitle>Risk Management</CardTitle>
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
