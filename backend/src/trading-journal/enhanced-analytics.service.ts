import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface AdvancedAnalytics {
  // Performance Metrics
  totalTrades: number;
  winRate: number;
  lossRate: number;
  breakEvenRate: number;
  profitFactor: number;
  expectancy: number;
  sharpeRatio: number;
  
  // P&L Metrics
  totalProfit: number;
  totalLoss: number;
  netProfit: number;
  averageWin: number;
  averageLoss: number;
  largestWin: number;
  largestLoss: number;
  averageRR: number;
  
  // Consistency Metrics
  consecutiveWins: number;
  consecutiveLosses: number;
  maxDrawdown: number;
  maxDrawdownPercent: number;
  recoveryFactor: number;
  
  // Trade Distribution
  winningTrades: number;
  losingTrades: number;
  breakEvenTrades: number;
  longTrades: number;
  shortTrades: number;
  longWinRate: number;
  shortWinRate: number;
  
  // Time-based Analytics
  averageTradeDuration: number;
  bestTradingDay: string;
  worstTradingDay: string;
  bestTradingHour: number;
  
  // Risk Metrics
  averageRiskPercent: number;
  maxRiskTaken: number;
  riskAdjustedReturn: number;
  
  // Charts Data
  equityCurve: Array<{ date: string; equity: number; drawdown: number }>;
  dailyPL: Array<{ date: string; profit: number; trades: number }>;
  weeklyPL: Array<{ week: string; profit: number; trades: number }>;
  monthlyPL: Array<{ month: string; profit: number; trades: number }>;
  pairPerformance: Array<{ pair: string; trades: number; winRate: number; profit: number }>;
  setupPerformance: Array<{ setup: string; trades: number; winRate: number; profit: number }>;
  hourlyPerformance: Array<{ hour: number; trades: number; winRate: number; profit: number }>;
  dayOfWeekPerformance: Array<{ day: string; trades: number; winRate: number; profit: number }>;
  
  // Zella Score (composite performance score 0-100)
  zellaScore: number;
}

@Injectable()
export class EnhancedAnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getAdvancedAnalytics(
    userId: number,
    accountId?: number,
    period?: string,
    startDate?: string,
    endDate?: string
  ): Promise<AdvancedAnalytics> {
    const where: any = { 
      userId,
      status: { in: ['WIN', 'LOSS', 'BREAKEVEN'] }
    };
    
    if (accountId) where.accountId = accountId;
    
    const dateRange = this.getDateRange(period, startDate, endDate);
    if (dateRange) where.time = dateRange;
    
    const trades = await this.prisma.trade.findMany({
      where,
      orderBy: { time: 'asc' },
    });

    if (trades.length === 0) {
      return this.getEmptyAnalytics();
    }

    // Calculate all metrics
    const winningTrades = trades.filter(t => t.status === 'WIN');
    const losingTrades = trades.filter(t => t.status === 'LOSS');
    const breakEvenTrades = trades.filter(t => t.status === 'BREAKEVEN');
    const longTrades = trades.filter(t => t.type === 'BUY');
    const shortTrades = trades.filter(t => t.type === 'SELL');
    
    const totalProfit = winningTrades.reduce((sum, t) => sum + (t.profit || 0), 0);
    const totalLoss = Math.abs(losingTrades.reduce((sum, t) => sum + (t.profit || 0), 0));
    const netProfit = trades.reduce((sum, t) => sum + (t.profit || 0), 0);
    
    const winRate = (winningTrades.length / trades.length) * 100;
    const lossRate = (losingTrades.length / trades.length) * 100;
    const breakEvenRate = (breakEvenTrades.length / trades.length) * 100;
    
    const averageWin = winningTrades.length > 0 ? totalProfit / winningTrades.length : 0;
    const averageLoss = losingTrades.length > 0 ? totalLoss / losingTrades.length : 0;
    
    const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit;
    const expectancy = (winRate / 100 * averageWin) - (lossRate / 100 * averageLoss);
    
    const largestWin = winningTrades.length > 0 ? Math.max(...winningTrades.map(t => t.profit || 0)) : 0;
    const largestLoss = losingTrades.length > 0 ? Math.min(...losingTrades.map(t => t.profit || 0)) : 0;
    
    const averageRR = this.calculateAverageRR(trades);
    const { consecutiveWins, consecutiveLosses } = this.calculateConsecutiveWinsLosses(trades);
    
    const equityCurve = this.calculateEquityCurve(trades);
    const { maxDrawdown, maxDrawdownPercent } = this.calculateMaxDrawdown(equityCurve);
    const recoveryFactor = maxDrawdown > 0 ? netProfit / maxDrawdown : 0;
    
    const sharpeRatio = this.calculateSharpeRatio(trades);
    
    const longWinRate = longTrades.length > 0 
      ? (longTrades.filter(t => t.status === 'WIN').length / longTrades.length) * 100 
      : 0;
    const shortWinRate = shortTrades.length > 0 
      ? (shortTrades.filter(t => t.status === 'WIN').length / shortTrades.length) * 100 
      : 0;
    
    const averageTradeDuration = this.calculateAverageDuration(trades);
    const { bestDay, worstDay } = this.findBestWorstDays(trades);
    const bestHour = this.findBestTradingHour(trades);
    
    const averageRiskPercent = this.calculateAverageRisk(trades);
    const maxRiskTaken = Math.max(...trades.map(t => t.riskPercent || 0));
    const riskAdjustedReturn = averageRiskPercent > 0 ? netProfit / averageRiskPercent : 0;
    
    const dailyPL = this.calculateDailyPL(trades);
    const weeklyPL = this.calculateWeeklyPL(trades);
    const monthlyPL = this.calculateMonthlyPL(trades);
    const pairPerformance = this.calculatePairPerformance(trades);
    const setupPerformance = this.calculateSetupPerformance(trades);
    const hourlyPerformance = this.calculateHourlyPerformance(trades);
    const dayOfWeekPerformance = this.calculateDayOfWeekPerformance(trades);
    
    const zellaScore = this.calculateZellaScore({
      winRate,
      profitFactor,
      expectancy,
      sharpeRatio,
      recoveryFactor,
      consistencyScore: this.calculateConsistencyScore(trades),
    });

    return {
      totalTrades: trades.length,
      winRate: Math.round(winRate * 100) / 100,
      lossRate: Math.round(lossRate * 100) / 100,
      breakEvenRate: Math.round(breakEvenRate * 100) / 100,
      profitFactor: Math.round(profitFactor * 100) / 100,
      expectancy: Math.round(expectancy * 100) / 100,
      sharpeRatio: Math.round(sharpeRatio * 100) / 100,
      totalProfit: Math.round(totalProfit * 100) / 100,
      totalLoss: Math.round(totalLoss * 100) / 100,
      netProfit: Math.round(netProfit * 100) / 100,
      averageWin: Math.round(averageWin * 100) / 100,
      averageLoss: Math.round(averageLoss * 100) / 100,
      largestWin: Math.round(largestWin * 100) / 100,
      largestLoss: Math.round(largestLoss * 100) / 100,
      averageRR: Math.round(averageRR * 100) / 100,
      consecutiveWins,
      consecutiveLosses,
      maxDrawdown: Math.round(maxDrawdown * 100) / 100,
      maxDrawdownPercent: Math.round(maxDrawdownPercent * 100) / 100,
      recoveryFactor: Math.round(recoveryFactor * 100) / 100,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      breakEvenTrades: breakEvenTrades.length,
      longTrades: longTrades.length,
      shortTrades: shortTrades.length,
      longWinRate: Math.round(longWinRate * 100) / 100,
      shortWinRate: Math.round(shortWinRate * 100) / 100,
      averageTradeDuration,
      bestTradingDay: bestDay,
      worstTradingDay: worstDay,
      bestTradingHour: bestHour,
      averageRiskPercent: Math.round(averageRiskPercent * 100) / 100,
      maxRiskTaken: Math.round(maxRiskTaken * 100) / 100,
      riskAdjustedReturn: Math.round(riskAdjustedReturn * 100) / 100,
      equityCurve,
      dailyPL,
      weeklyPL,
      monthlyPL,
      pairPerformance,
      setupPerformance,
      hourlyPerformance,
      dayOfWeekPerformance,
      zellaScore: Math.round(zellaScore),
    };
  }

  private getDateRange(period?: string, startDate?: string, endDate?: string) {
    if (period && period !== 'custom') {
      const now = new Date();
      const start = new Date();
      
      switch (period) {
        case 'week':
          start.setDate(now.getDate() - 7);
          break;
        case 'month':
          start.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          start.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      return { gte: start, lte: now };
    }
    
    if (startDate || endDate) {
      const range: any = {};
      if (startDate) range.gte = new Date(startDate);
      if (endDate) range.lte = new Date(endDate);
      return range;
    }
    
    return null;
  }

  private calculateAverageRR(trades: any[]): number {
    const validRRTrades = trades.filter(t => t.riskReward && t.riskReward > 0);
    if (validRRTrades.length === 0) return 0;
    
    const totalRR = validRRTrades.reduce((sum, t) => sum + t.riskReward, 0);
    return totalRR / validRRTrades.length;
  }

  private calculateConsecutiveWinsLosses(trades: any[]): { consecutiveWins: number; consecutiveLosses: number } {
    let maxWins = 0, maxLosses = 0, currentWins = 0, currentLosses = 0;
    
    trades.forEach(trade => {
      if (trade.status === 'WIN') {
        currentWins++;
        currentLosses = 0;
        maxWins = Math.max(maxWins, currentWins);
      } else if (trade.status === 'LOSS') {
        currentLosses++;
        currentWins = 0;
        maxLosses = Math.max(maxLosses, currentLosses);
      }
    });
    
    return { consecutiveWins: maxWins, consecutiveLosses: maxLosses };
  }

  private calculateEquityCurve(trades: any[]): Array<{ date: string; equity: number; drawdown: number }> {
    let runningEquity = 0;
    let peak = 0;
    const curve: Array<{ date: string; equity: number; drawdown: number }> = [];
    
    trades.forEach(trade => {
      runningEquity += trade.profit || 0;
      peak = Math.max(peak, runningEquity);
      const drawdown = peak - runningEquity;
      
      curve.push({
        date: trade.time.toISOString().split('T')[0],
        equity: Math.round(runningEquity * 100) / 100,
        drawdown: Math.round(drawdown * 100) / 100,
      });
    });
    
    return curve;
  }

  private calculateMaxDrawdown(equityCurve: Array<{ date: string; equity: number; drawdown: number }>): { maxDrawdown: number; maxDrawdownPercent: number } {
    if (equityCurve.length === 0) return { maxDrawdown: 0, maxDrawdownPercent: 0 };
    
    let maxDrawdown = 0;
    let peak = equityCurve[0].equity;
    
    equityCurve.forEach(point => {
      if (point.equity > peak) {
        peak = point.equity;
      } else {
        const drawdown = peak - point.equity;
        maxDrawdown = Math.max(maxDrawdown, drawdown);
      }
    });
    
    const maxDrawdownPercent = peak > 0 ? (maxDrawdown / peak) * 100 : 0;
    return { maxDrawdown, maxDrawdownPercent };
  }

  private calculateSharpeRatio(trades: any[]): number {
    if (trades.length < 2) return 0;
    
    const returns = trades.map(t => t.profit || 0);
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);
    
    return stdDev > 0 ? (avgReturn / stdDev) * Math.sqrt(252) : 0; // Annualized
  }

  private calculateAverageDuration(trades: any[]): number {
    const tradesWithDuration = trades.filter(t => t.duration);
    if (tradesWithDuration.length === 0) return 0;
    
    const totalDuration = tradesWithDuration.reduce((sum, t) => sum + t.duration, 0);
    return Math.round(totalDuration / tradesWithDuration.length);
  }

  private findBestWorstDays(trades: any[]): { bestDay: string; worstDay: string } {
    const dailyPL = this.calculateDailyPL(trades);
    if (dailyPL.length === 0) return { bestDay: '', worstDay: '' };
    
    const sorted = [...dailyPL].sort((a, b) => b.profit - a.profit);
    return {
      bestDay: sorted[0].date,
      worstDay: sorted[sorted.length - 1].date,
    };
  }

  private findBestTradingHour(trades: any[]): number {
    const hourlyPerf = this.calculateHourlyPerformance(trades);
    if (hourlyPerf.length === 0) return 0;
    
    const sorted = [...hourlyPerf].sort((a, b) => b.profit - a.profit);
    return sorted[0].hour;
  }

  private calculateAverageRisk(trades: any[]): number {
    const tradesWithRisk = trades.filter(t => t.riskPercent);
    if (tradesWithRisk.length === 0) return 0;
    
    const totalRisk = tradesWithRisk.reduce((sum, t) => sum + t.riskPercent, 0);
    return totalRisk / tradesWithRisk.length;
  }

  private calculateDailyPL(trades: any[]): Array<{ date: string; profit: number; trades: number }> {
    const dailyMap = new Map<string, { profit: number; trades: number }>();
    
    trades.forEach(trade => {
      const date = trade.time.toISOString().split('T')[0];
      const existing = dailyMap.get(date) || { profit: 0, trades: 0 };
      dailyMap.set(date, {
        profit: existing.profit + (trade.profit || 0),
        trades: existing.trades + 1,
      });
    });
    
    return Array.from(dailyMap.entries()).map(([date, data]) => ({
      date,
      profit: Math.round(data.profit * 100) / 100,
      trades: data.trades,
    }));
  }

  private calculateWeeklyPL(trades: any[]): Array<{ week: string; profit: number; trades: number }> {
    const weeklyMap = new Map<string, { profit: number; trades: number }>();
    
    trades.forEach(trade => {
      const date = new Date(trade.time);
      const week = this.getWeekString(date);
      const existing = weeklyMap.get(week) || { profit: 0, trades: 0 };
      weeklyMap.set(week, {
        profit: existing.profit + (trade.profit || 0),
        trades: existing.trades + 1,
      });
    });
    
    return Array.from(weeklyMap.entries()).map(([week, data]) => ({
      week,
      profit: Math.round(data.profit * 100) / 100,
      trades: data.trades,
    }));
  }

  private calculateMonthlyPL(trades: any[]): Array<{ month: string; profit: number; trades: number }> {
    const monthlyMap = new Map<string, { profit: number; trades: number }>();
    
    trades.forEach(trade => {
      const date = new Date(trade.time);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const existing = monthlyMap.get(month) || { profit: 0, trades: 0 };
      monthlyMap.set(month, {
        profit: existing.profit + (trade.profit || 0),
        trades: existing.trades + 1,
      });
    });
    
    return Array.from(monthlyMap.entries()).map(([month, data]) => ({
      month,
      profit: Math.round(data.profit * 100) / 100,
      trades: data.trades,
    }));
  }

  private calculatePairPerformance(trades: any[]): Array<{ pair: string; trades: number; winRate: number; profit: number }> {
    const pairMap = new Map<string, any[]>();
    
    trades.forEach(trade => {
      const existing = pairMap.get(trade.pair) || [];
      pairMap.set(trade.pair, [...existing, trade]);
    });
    
    return Array.from(pairMap.entries()).map(([pair, pairTrades]) => {
      const wins = pairTrades.filter(t => t.status === 'WIN').length;
      const profit = pairTrades.reduce((sum, t) => sum + (t.profit || 0), 0);
      
      return {
        pair,
        trades: pairTrades.length,
        winRate: Math.round((wins / pairTrades.length) * 10000) / 100,
        profit: Math.round(profit * 100) / 100,
      };
    }).sort((a, b) => b.profit - a.profit);
  }

  private calculateSetupPerformance(trades: any[]): Array<{ setup: string; trades: number; winRate: number; profit: number }> {
    const setupMap = new Map<string, any[]>();
    
    trades.forEach(trade => {
      const setup = trade.setup || 'Unknown';
      const existing = setupMap.get(setup) || [];
      setupMap.set(setup, [...existing, trade]);
    });
    
    return Array.from(setupMap.entries()).map(([setup, setupTrades]) => {
      const wins = setupTrades.filter(t => t.status === 'WIN').length;
      const profit = setupTrades.reduce((sum, t) => sum + (t.profit || 0), 0);
      
      return {
        setup,
        trades: setupTrades.length,
        winRate: Math.round((wins / setupTrades.length) * 10000) / 100,
        profit: Math.round(profit * 100) / 100,
      };
    }).sort((a, b) => b.profit - a.profit);
  }

  private calculateHourlyPerformance(trades: any[]): Array<{ hour: number; trades: number; winRate: number; profit: number }> {
    const hourlyMap = new Map<number, any[]>();
    
    trades.forEach(trade => {
      const hour = new Date(trade.time).getHours();
      const existing = hourlyMap.get(hour) || [];
      hourlyMap.set(hour, [...existing, trade]);
    });
    
    return Array.from(hourlyMap.entries()).map(([hour, hourTrades]) => {
      const wins = hourTrades.filter(t => t.status === 'WIN').length;
      const profit = hourTrades.reduce((sum, t) => sum + (t.profit || 0), 0);
      
      return {
        hour,
        trades: hourTrades.length,
        winRate: Math.round((wins / hourTrades.length) * 10000) / 100,
        profit: Math.round(profit * 100) / 100,
      };
    }).sort((a, b) => a.hour - b.hour);
  }

  private calculateDayOfWeekPerformance(trades: any[]): Array<{ day: string; trades: number; winRate: number; profit: number }> {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayMap = new Map<string, any[]>();
    
    trades.forEach(trade => {
      const day = dayNames[new Date(trade.time).getDay()];
      const existing = dayMap.get(day) || [];
      dayMap.set(day, [...existing, trade]);
    });
    
    return Array.from(dayMap.entries()).map(([day, dayTrades]) => {
      const wins = dayTrades.filter(t => t.status === 'WIN').length;
      const profit = dayTrades.reduce((sum, t) => sum + (t.profit || 0), 0);
      
      return {
        day,
        trades: dayTrades.length,
        winRate: Math.round((wins / dayTrades.length) * 10000) / 100,
        profit: Math.round(profit * 100) / 100,
      };
    });
  }

  private calculateConsistencyScore(trades: any[]): number {
    if (trades.length < 10) return 0;
    
    const dailyPL = this.calculateDailyPL(trades);
    const profits = dailyPL.map(d => d.profit);
    
    const avgProfit = profits.reduce((sum, p) => sum + p, 0) / profits.length;
    const variance = profits.reduce((sum, p) => sum + Math.pow(p - avgProfit, 2), 0) / profits.length;
    const stdDev = Math.sqrt(variance);
    
    // Lower standard deviation relative to average = higher consistency
    const coefficientOfVariation = avgProfit !== 0 ? stdDev / Math.abs(avgProfit) : 1;
    return Math.max(0, 100 - (coefficientOfVariation * 50));
  }

  private calculateZellaScore(metrics: {
    winRate: number;
    profitFactor: number;
    expectancy: number;
    sharpeRatio: number;
    recoveryFactor: number;
    consistencyScore: number;
  }): number {
    // Weighted composite score (0-100)
    const winRateScore = Math.min(metrics.winRate, 100) * 0.2;
    const profitFactorScore = Math.min(metrics.profitFactor * 20, 100) * 0.2;
    const expectancyScore = Math.min(Math.max(metrics.expectancy * 2, 0), 100) * 0.15;
    const sharpeScore = Math.min(Math.max(metrics.sharpeRatio * 10, 0), 100) * 0.15;
    const recoveryScore = Math.min(Math.max(metrics.recoveryFactor * 10, 0), 100) * 0.15;
    const consistencyScore = metrics.consistencyScore * 0.15;
    
    return winRateScore + profitFactorScore + expectancyScore + sharpeScore + recoveryScore + consistencyScore;
  }

  private getWeekString(date: Date): string {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    const week = Math.ceil((days + startOfYear.getDay() + 1) / 7);
    return `${date.getFullYear()}-W${String(week).padStart(2, '0')}`;
  }

  private getEmptyAnalytics(): AdvancedAnalytics {
    return {
      totalTrades: 0,
      winRate: 0,
      lossRate: 0,
      breakEvenRate: 0,
      profitFactor: 0,
      expectancy: 0,
      sharpeRatio: 0,
      totalProfit: 0,
      totalLoss: 0,
      netProfit: 0,
      averageWin: 0,
      averageLoss: 0,
      largestWin: 0,
      largestLoss: 0,
      averageRR: 0,
      consecutiveWins: 0,
      consecutiveLosses: 0,
      maxDrawdown: 0,
      maxDrawdownPercent: 0,
      recoveryFactor: 0,
      winningTrades: 0,
      losingTrades: 0,
      breakEvenTrades: 0,
      longTrades: 0,
      shortTrades: 0,
      longWinRate: 0,
      shortWinRate: 0,
      averageTradeDuration: 0,
      bestTradingDay: '',
      worstTradingDay: '',
      bestTradingHour: 0,
      averageRiskPercent: 0,
      maxRiskTaken: 0,
      riskAdjustedReturn: 0,
      equityCurve: [],
      dailyPL: [],
      weeklyPL: [],
      monthlyPL: [],
      pairPerformance: [],
      setupPerformance: [],
      hourlyPerformance: [],
      dayOfWeekPerformance: [],
      zellaScore: 0,
    };
  }
}
