import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "@/components/ui/table";
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

const ModernTradingJournal: React.FC = () => {
  // State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("open-positions");

  // Dashboard metrics
  const metrics: DashboardMetrics = {
    netPL: 248.78,
    tradeExpectancy: 248.78,
    profitFactor: 1.2412,
    winPercentage: 39.02,
    avgWinTrade: 54.52,
    avgLossTrade: 51.32,
    zellaScore: 81,
  };

  // Chart data
  const dailyCumulativePLData = [
    { date: "12/04/2022", value: 0 },
    { date: "12/05/2022", value: 100 },
    { date: "12/06/2022", value: 200 },
    { date: "12/07/2022", value: 150 },
    { date: "12/08/2022", value: -100 },
    { date: "12/09/2022", value: 250 },
  ];

  const netDailyPLData = [
    { date: "12/04/2022", value: 50 },
    { date: "12/05/2022", value: 100 },
    { date: "12/06/2022", value: 80 },
    { date: "12/07/2022", value: -50 },
    { date: "12/08/2022", value: -150 },
    { date: "12/09/2022", value: 120 },
  ];

  const openPositions = [
    { id: 1, openDate: "11.12.2023", symbol: "MRO", netPL: 371.21 },
    { id: 2, openDate: "11.12.2023", symbol: "MRO", netPL: -114.31 },
    { id: 3, openDate: "11.12.2023", symbol: "MRO", netPL: 314.21 },
    { id: 4, openDate: "11.12.2023", symbol: "MRO", netPL: -62.21 },
  ];

  const recentTrades = [
    { id: 1, openDate: "11.12.2023", symbol: "MRO", netPL: 371.21 },
    { id: 2, openDate: "10.12.2023", symbol: "MRO", netPL: -114.31 },
    { id: 3, openDate: "09.12.2023", symbol: "MRO", netPL: 314.21 },
  ];

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

    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);

      const day: CalendarDay = {
        date: currentDate.getDate(),
        isCurrentMonth: currentDate.getMonth() === month,
        isToday: currentDate.toDateString() === new Date().toDateString(),
        pnl: Math.random() > 0.7 ? (Math.random() - 0.5) * 200 : undefined,
        trades:
          Math.random() > 0.8 ? Math.floor(Math.random() * 5) + 1 : undefined,
      };

      currentWeek.push(day);

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    return weeks;
  };

  const calendarWeeks = generateCalendar(currentDate);
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

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            <span className="text-green-600">Good morning Harry!</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Date range
          </Button>
          <Button variant="outline" size="sm">
            All Accounts
          </Button>
          <Button variant="default" size="sm">
            <Import className="w-4 h-4 mr-2" />
            Import Trades
          </Button>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {/* Metrics cards will go here */}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Charts will go here */}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Tables and calendar will go here */}
      </div>
    </div>
  );
};

export default ModernTradingJournal;
