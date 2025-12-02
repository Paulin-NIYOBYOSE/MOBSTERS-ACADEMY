import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Calendar,
  Eye,
  Info,
  ChevronLeft,
  ChevronRight,
  Import,
  MoreHorizontal,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useToast } from "../../hooks/use-toast";
import BrokerConnectionModal from "./BrokerConnectionModal";
import { tradingAccountService } from "../../services/tradingAccountService";

interface DashboardMetrics {
  netPL: number;
  tradeExpectancy: number;
  profitFactor: number;
  winPercentage: number;
  avgWinTrade: number;
  avgLossTrade: number;
  zellaScore: number;
}

interface CalendarDay {
  date: number;
  pnl?: number;
  trades?: number;
  isToday?: boolean;
  isCurrentMonth?: boolean;
}

const TradingJournal: React.FC = () => {
  const { toast } = useToast();
  // State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("open-positions");
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<number | undefined>();
  const [showBrokerModal, setShowBrokerModal] = useState(false);
  const [trades, setTrades] = useState<any[]>([]);
  const [lastImportDate, setLastImportDate] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>(() => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 1);
    return {
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
    };
  });

  // Load data from backend
  useEffect(() => {
    loadData();
  }, [selectedAccount, dateRange]);

  const loadData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        toast({
          title: "Error",
          description: "Please log in to view trading journal",
          variant: "destructive",
        });
        return;
      }

      console.log("Loading trading journal data...");
      console.log("Token:", token ? "Present" : "Missing");

      // Fetch accounts
      const accountsData = await tradingAccountService.getAccounts();
      console.log("Accounts loaded:", accountsData);
      setAccounts(accountsData);

      // Fetch advanced analytics
      const params = new URLSearchParams();
      if (selectedAccount)
        params.append("accountId", selectedAccount.toString());
      params.append("period", "month");

      const analyticsResponse = await fetch(
        `http://localhost:3000/api/trading-journal/analytics?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (analyticsResponse.ok) {
        const data = await analyticsResponse.json();
        console.log("Analytics response:", data);
        console.log(
          "Analytics has data:",
          data && Object.keys(data).length > 0
        );
        console.log("Total trades in analytics:", data?.totalTrades);
        setAnalytics(data);
      } else {
        const errorText = await analyticsResponse.text();
        console.error(
          "Failed to fetch analytics:",
          analyticsResponse.status,
          errorText
        );
        // Set default analytics if API fails
        setAnalytics(null);
      }

      // Fetch trades
      const tradesParams = new URLSearchParams();
      if (selectedAccount)
        tradesParams.append("accountId", selectedAccount.toString());
      if (dateRange.startDate)
        tradesParams.append("startDate", dateRange.startDate);
      if (dateRange.endDate) tradesParams.append("endDate", dateRange.endDate);

      const tradesResponse = await fetch(
        `http://localhost:3000/api/trading-journal/trades?${tradesParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (tradesResponse.ok) {
        const tradesData = await tradesResponse.json();
        console.log("Trades response:", tradesData);
        // Backend returns { trades: [], pagination: {} }
        if (tradesData.trades && Array.isArray(tradesData.trades)) {
          setTrades(tradesData.trades);
        } else if (Array.isArray(tradesData)) {
          setTrades(tradesData);
        } else {
          setTrades([]);
        }
      } else {
        console.error("Failed to fetch trades:", tradesResponse.status);
        setTrades([]);
      }

      // Get last import date from accounts
      if (accountsData.length > 0) {
        const latestSync = accountsData
          .filter((acc: any) => acc.lastSyncAt)
          .sort(
            (a: any, b: any) =>
              new Date(b.lastSyncAt).getTime() -
              new Date(a.lastSyncAt).getTime()
          )[0];

        if (latestSync) {
          setLastImportDate(latestSync.lastSyncAt);
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "Failed to load trading data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Dashboard metrics from analytics or defaults
  const metrics: DashboardMetrics = analytics
    ? {
        netPL: analytics.totalProfit || 0,
        tradeExpectancy: analytics.expectancy || 0,
        profitFactor: analytics.profitFactor || 0,
        winPercentage: analytics.winRate || 0,
        avgWinTrade: analytics.averageWin || 0,
        avgLossTrade: Math.abs(analytics.averageLoss || 0),
        zellaScore: analytics.zellaScore || 0,
      }
    : {
        netPL: 0,
        tradeExpectancy: 0,
        profitFactor: 0,
        winPercentage: 0,
        avgWinTrade: 0,
        avgLossTrade: 0,
        zellaScore: 0,
      };

  // Chart data from analytics
  const dailyCumulativePLData =
    analytics?.equityCurve?.map((point: any) => ({
      date: new Date(point.date).toLocaleDateString(),
      value: point.equity,
    })) || [];

  const netDailyPLData =
    analytics?.dailyPL?.map((point: any) => ({
      date: new Date(point.date).toLocaleDateString(),
      value: point.profit,
    })) || [];

  // Filter trades by status
  const openPositions = trades.filter((t) => t.status === "RUNNING");
  const recentTrades = trades
    .filter((t) => t.status !== "RUNNING")
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 10);

  const formatTradeDate = (dateString: string) => {
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, ".");
  };

  const getRelativeTime = (dateString: string | null) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);

    if (diffMonths > 0)
      return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return "Today";
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const getPLColor = (value: number) => {
    return value >= 0 ? "text-green-600" : "text-red-600";
  };

  const generateCalendar = (date: Date): CalendarDay[][] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const weeks: CalendarDay[][] = [];
    let currentWeek: CalendarDay[] = [];

    // Static data for demo - prevents reloading
    const staticPnlData: { [key: string]: number } = {
      "28": 62.9,
      "10": -25.4,
      "15": 45.2,
      "22": -18.7,
      "5": 33.1,
    };

    const staticTradesData: { [key: string]: number } = {
      "28": 3,
      "10": 2,
      "15": 1,
      "22": 4,
      "5": 2,
    };

    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dayKey = currentDate.getDate().toString();

      const day: CalendarDay = {
        date: currentDate.getDate(),
        isCurrentMonth: currentDate.getMonth() === month,
        isToday: currentDate.toDateString() === new Date().toDateString(),
        pnl: staticPnlData[dayKey],
        trades: staticTradesData[dayKey],
      };

      currentWeek.push(day);

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    return weeks;
  };

  const calendarWeeks = useMemo(
    () => generateCalendar(currentDate),
    [currentDate]
  );
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === "next" ? 1 : -1));
      return newDate;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading trading journal...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:ml-3 md:mr-2">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6 mt-5 ">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-gray-600 border-gray-300"
          >
            <Eye className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Date range
            </Button>
            {showDatePicker && (
              <div className="absolute right-0 mt-2 p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 w-80">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      Date Range
                    </h3>
                    <button
                      onClick={() => setShowDatePicker(false)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={dateRange.startDate}
                      onChange={(e) =>
                        setDateRange({
                          ...dateRange,
                          startDate: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors outline-none"
                      style={{
                        colorScheme: "dark",
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={dateRange.endDate}
                      onChange={(e) =>
                        setDateRange({ ...dateRange, endDate: e.target.value })
                      }
                      className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors outline-none"
                      style={{
                        colorScheme: "dark",
                      }}
                    />
                  </div>
                  {/* Quick Select Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const end = new Date();
                        const start = new Date();
                        start.setDate(start.getDate() - 7);
                        setDateRange({
                          startDate: start.toISOString().split("T")[0],
                          endDate: end.toISOString().split("T")[0],
                        });
                      }}
                      className="flex-1 text-xs border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Last 7 Days
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const end = new Date();
                        const start = new Date();
                        start.setMonth(start.getMonth() - 1);
                        setDateRange({
                          startDate: start.toISOString().split("T")[0],
                          endDate: end.toISOString().split("T")[0],
                        });
                      }}
                      className="flex-1 text-xs border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Last Month
                    </Button>
                  </div>
                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      size="sm"
                      onClick={() => setShowDatePicker(false)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Apply
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const end = new Date();
                        const start = new Date();
                        start.setMonth(start.getMonth() - 1);
                        setDateRange({
                          startDate: start.toISOString().split("T")[0],
                          endDate: end.toISOString().split("T")[0],
                        });
                      }}
                      className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <select
            value={selectedAccount || ""}
            onChange={(e) =>
              setSelectedAccount(
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300"
          >
            <option value="">All Accounts</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name}
              </option>
            ))}
          </select>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
            onClick={() => setShowBrokerModal(true)}
          >
            <Import className="w-4 h-4 mr-2" />
            Import Trades
          </Button>
        </div>
      </div>

      {/* Last imported info */}
      <div className="flex items-center justify-between mb-6 text-sm text-gray-500">
        <div></div>
        <div className="flex items-center gap-4">
          <span>Last imported {getRelativeTime(lastImportDate)}</span>
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-700 p-0 h-auto"
          >
            Edit Widgets
          </Button>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-5 gap-4">
        {/* Net P&L */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Net P&L
                  </span>
                  <Info className="w-4 h-4 text-gray-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${metrics.netPL.toFixed(2)}
                </div>
              </div>
              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trade Expectancy */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Trade Expectancy
                  </span>
                  <Info className="w-4 h-4 text-gray-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${metrics.tradeExpectancy.toFixed(2)}
                </div>
              </div>
              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profit Factor */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Profit Factor
                  </span>
                  <Info className="w-4 h-4 text-gray-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metrics.profitFactor.toFixed(4)}
                </div>
              </div>
              <div className="w-12 h-12">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { value: metrics.profitFactor * 20 },
                        { value: 100 - metrics.profitFactor * 20 },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={16}
                      outerRadius={24}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                    >
                      <Cell fill="#10b981" />
                      <Cell fill="#e5e7eb" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Win % */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Win %
                  </span>
                  <Info className="w-4 h-4 text-gray-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatPercentage(metrics.winPercentage)}
                </div>
              </div>
              <div className="w-12 h-12">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { value: metrics.winPercentage },
                        { value: 100 - metrics.winPercentage },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={16}
                      outerRadius={24}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                    >
                      <Cell fill="#3b82f6" />
                      <Cell fill="#e5e7eb" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Avg win/loss trade */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Avg win/loss trade
                  </span>
                  <Info className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-green-600">
                    $34.82
                  </span>
                  <span className="text-xl font-bold text-red-600">$51.32</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-6">
        {/* Zella Score */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
              Zella Score <Info className="w-4 h-4 text-gray-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col items-center">
              {/* Triangle Chart */}
              <div className="relative w-48 h-32 mb-4">
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 192 128"
                  className="overflow-visible"
                >
                  {/* Triangle outline */}
                  <path
                    d="M 96 20 L 20 108 L 172 108 Z"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                  />
                  {/* Filled triangle */}
                  <path
                    d="M 96 20 L 20 108 L 172 108 Z"
                    fill="url(#purpleGradient)"
                    fillOpacity="0.6"
                  />
                  {/* Corner dots */}
                  <circle cx="96" cy="20" r="3" fill="#8b5cf6" />
                  <circle cx="20" cy="108" r="3" fill="#8b5cf6" />
                  <circle cx="172" cy="108" r="3" fill="#8b5cf6" />

                  <defs>
                    <linearGradient
                      id="purpleGradient"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
                      <stop
                        offset="100%"
                        stopColor="#8b5cf6"
                        stopOpacity="0.2"
                      />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Labels */}
                <div className="absolute bottom-0 left-0 text-xs text-gray-600 dark:text-gray-400">
                  Avg win/loss
                </div>
                <div className="absolute bottom-0 right-0 text-xs text-gray-600 dark:text-gray-400">
                  Profit factor
                </div>
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 dark:text-gray-400">
                  Win %
                </div>
              </div>

              {/* Score display */}
              <div className="text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Your Zella Score:{" "}
                  <span className="font-semibold text-green-600">81</span>{" "}
                  <span className="text-green-600">+1</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Net Cumulative P&L */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
              Daily Net Cumulative P&L{" "}
              <Info className="w-4 h-4 text-gray-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={dailyCumulativePLData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    tickMargin={8}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <defs>
                    <linearGradient
                      id="cumulativePLGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop
                        offset="50%"
                        stopColor="#10b981"
                        stopOpacity={0.4}
                      />
                      <stop
                        offset="100%"
                        stopColor="#ef4444"
                        stopOpacity={0.4}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#cumulativePLGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Net Daily P&L */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
              Net Daily P&L <Info className="w-4 h-4 text-gray-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={netDailyPLData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    tickMargin={8}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Bar dataKey="value" radius={[2, 2, 0, 0]} fill="#10b981">
                    {netDailyPLData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.value >= 0 ? "#10b981" : "#ef4444"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-10 gap-6">
        {/* Trades Table */}
        <Card className="col-span-4">
          <CardHeader className="pb-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="open-positions">Open Positions</TabsTrigger>
                <TabsTrigger value="recent-trades">Recent Trades</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab}>
              <TabsContent value="open-positions">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Open Date</TableHead>
                      <TableHead>Symbol</TableHead>
                      <TableHead className="text-right">Net P&L</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {openPositions.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center text-gray-500"
                        >
                          No open positions
                        </TableCell>
                      </TableRow>
                    ) : (
                      openPositions.map((trade) => (
                        <TableRow key={trade.id}>
                          <TableCell>{formatTradeDate(trade.time)}</TableCell>
                          <TableCell>{trade.pair}</TableCell>
                          <TableCell
                            className={`text-right ${getPLColor(
                              trade.profit || 0
                            )}`}
                          >
                            {formatCurrency(trade.profit || 0)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="recent-trades">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Open Date</TableHead>
                      <TableHead>Symbol</TableHead>
                      <TableHead className="text-right">Net P&L</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTrades.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center text-gray-500"
                        >
                          No recent trades
                        </TableCell>
                      </TableRow>
                    ) : (
                      recentTrades.map((trade) => (
                        <TableRow key={trade.id}>
                          <TableCell className="font-medium">
                            {formatTradeDate(trade.time)}
                          </TableCell>
                          <TableCell>{trade.pair}</TableCell>
                          <TableCell
                            className={`text-right font-medium ${getPLColor(
                              trade.profit || 0
                            )}`}
                          >
                            {formatCurrency(trade.profit || 0)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card className="col-span-6">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth("prev")}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <h3 className="text-lg font-semibold">
                  {monthNames[currentDate.getMonth()]}{" "}
                  {currentDate.getFullYear()}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth("next")}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-0 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-gray-500 p-3 border-b border-gray-200 dark:border-gray-700"
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-0 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              {calendarWeeks.flat().map((day, index) => (
                <div
                  key={index}
                  className={`
                      relative p-3 h-20 cursor-pointer
                      ${
                        day.pnl !== undefined
                          ? day.pnl >= 0
                            ? "bg-green-100 dark:bg-green-900/30 border-[1.5px] border-green-400 dark:border-green-500 rounded-md"
                            : "bg-red-100 dark:bg-red-900/30 border-[1.5px] border-red-400 dark:border-red-500 rounded-md"
                          : day.isCurrentMonth
                          ? "bg-white dark:bg-gray-900 border-r border-b border-gray-300 dark:border-gray-600"
                          : "bg-gray-50 dark:bg-gray-800 border-r border-b border-gray-300 dark:border-gray-600"
                      }
                      ${
                        day.pnl === undefined && (index + 1) % 7 === 0
                          ? "border-r-0"
                          : ""
                      }
                      ${
                        day.pnl === undefined && index >= 35 ? "border-b-0" : ""
                      }
                      hover:opacity-80
                    `}
                >
                  <div
                    className={`text-xs font-medium ${
                      day.isCurrentMonth
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-400 dark:text-gray-600"
                    }`}
                  >
                    {day.date}
                  </div>
                  {day.pnl && (
                    <div className="absolute bottom-1 left-1 right-1">
                      <div
                        className={`text-xs font-semibold ${
                          day.pnl >= 0
                            ? "text-green-700 dark:text-green-300"
                            : "text-red-700 dark:text-red-300"
                        }`}
                      >
                        ${Math.abs(day.pnl).toFixed(1)}K
                      </div>
                      {day.trades && (
                        <div
                          className={`text-xs ${
                            day.pnl >= 0
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {day.trades} trades
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Broker Connection Modal */}
      <BrokerConnectionModal
        open={showBrokerModal}
        onClose={() => setShowBrokerModal(false)}
        onSuccess={loadData}
        accountId={selectedAccount}
      />
    </div>
  );
};

export default TradingJournal;
