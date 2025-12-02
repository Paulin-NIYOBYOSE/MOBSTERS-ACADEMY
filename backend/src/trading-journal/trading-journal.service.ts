import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTradeDto, UpdateTradeDto, TradeAnalyticsDto } from './dto/trading-journal.dto';

@Injectable()
export class TradingJournalService {
  constructor(private prisma: PrismaService) {}

  async createTrade(userId: number, createTradeDto: CreateTradeDto) {
    const trade = await this.prisma.trade.create({
      data: {
        ...createTradeDto,
        userId,
        time: new Date(createTradeDto.time),
      },
    });

    return trade;
  }

  async updateTrade(userId: number, tradeId: number, updateTradeDto: UpdateTradeDto) {
    const trade = await this.prisma.trade.findFirst({
      where: { id: tradeId, userId },
    });

    if (!trade) {
      throw new NotFoundException('Trade not found');
    }

    const updatedData = {
      ...updateTradeDto,
      ...(updateTradeDto.time && { time: new Date(updateTradeDto.time) }),
    };

    return this.prisma.trade.update({
      where: { id: tradeId },
      data: updatedData,
    });
  }

  async deleteTrade(userId: number, tradeId: number) {
    const trade = await this.prisma.trade.findFirst({
      where: { id: tradeId, userId },
    });

    if (!trade) {
      throw new NotFoundException('Trade not found');
    }

    return this.prisma.trade.delete({
      where: { id: tradeId },
    });
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

  async getUserTrades(userId: number, page = 1, limit = 20, accountId?: number, period?: string, startDate?: string, endDate?: string) {
    console.log('getUserTrades service called with:', { userId, page, limit, accountId, period, startDate, endDate });
    
    const where: any = { userId };
    
    if (accountId) {
      console.log('Adding accountId filter:', accountId);
      where.accountId = accountId;
    }
    
    const dateRange = this.getDateRange(period, startDate, endDate);
    console.log('Date range calculated:', dateRange);
    if (dateRange) {
      where.time = dateRange;
    }
    
    console.log('Final where clause:', where);
    
    const [trades, total] = await Promise.all([
      this.prisma.trade.findMany({
        where,
        include: {
          account: {
            select: {
              id: true,
              name: true,
              startingBalance: true,
            },
          },
        },
        orderBy: { time: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.trade.count({ where }),
    ]);

    return {
      trades,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getTradeAnalytics(userId: number, accountId?: number, period?: string, startDate?: string, endDate?: string): Promise<TradeAnalyticsDto> {
    console.log('getTradeAnalytics service called with:', { userId, accountId, period, startDate, endDate });
    
    const where: any = { 
      userId, 
      status: { 
        in: ['WIN', 'LOSS', 'BREAKEVEN'] 
      } 
    };
    
    if (accountId) {
      where.accountId = accountId;
    }
    
    const dateRange = this.getDateRange(period, startDate, endDate);
    console.log('Analytics date range:', dateRange);
    if (dateRange) {
      where.time = dateRange;
    }
    
    console.log('Analytics where clause:', where);
    
    const trades = await this.prisma.trade.findMany({
      where,
      orderBy: { time: 'asc' },
    });
    
    console.log('Analytics found trades:', trades.length);
    if (trades.length > 0) {
      console.log('Sample trade:', { id: trades[0].id, pair: trades[0].pair, status: trades[0].status, profit: trades[0].profit });
    }

    if (trades.length === 0) {
      return {
        totalTrades: 0,
        winRate: 0,
        averageRR: 0,
        totalProfit: 0,
        maxDrawdown: 0,
        equityCurve: [],
        profitFactor: 0,
        averageWin: 0,
        averageLoss: 0,
        largestWin: 0,
        largestLoss: 0,
        consecutiveWins: 0,
        consecutiveLosses: 0,
        expectancy: 0,
        zellaScore: 0,
      };
    }

    const winningTrades = trades.filter(trade => trade.status === 'WIN');
    const losingTrades = trades.filter(trade => trade.status === 'LOSS');
    
    const totalProfit = trades.reduce((sum, trade) => sum + (trade.profit || 0), 0);
    const totalWins = winningTrades.reduce((sum, trade) => sum + (trade.profit || 0), 0);
    const totalLosses = Math.abs(losingTrades.reduce((sum, trade) => sum + (trade.profit || 0), 0));
    
    const winRate = trades.length > 0 ? (winningTrades.length / trades.length) * 100 : 0;
    const averageRR = winningTrades.length > 0 && losingTrades.length > 0 ? 
      (totalWins / winningTrades.length) / (totalLosses / losingTrades.length) : 0;
    const profitFactor = totalLosses > 0 ? totalWins / totalLosses : totalWins;
    
    const averageWin = winningTrades.length > 0 ? totalWins / winningTrades.length : 0;
    const averageLoss = losingTrades.length > 0 ? totalLosses / losingTrades.length : 0;
    
    const largestWin = winningTrades.length > 0 ? Math.max(...winningTrades.map(t => t.profit || 0)) : 0;
    const largestLoss = losingTrades.length > 0 ? Math.min(...losingTrades.map(t => t.profit || 0)) : 0;
    
    const equityCurve = this.calculateEquityCurve(trades);
    const maxDrawdown = this.calculateMaxDrawdown(equityCurve);
    
    const { consecutiveWins, consecutiveLosses } = this.calculateConsecutiveWinsLosses(trades);
    
    // Calculate expectancy: (Win% × Avg Win) - (Loss% × Avg Loss)
    const lossRate = trades.length > 0 ? (losingTrades.length / trades.length) * 100 : 0;
    const expectancy = (winRate / 100 * averageWin) - (lossRate / 100 * averageLoss);
    
    // Calculate Zella Score (0-100 based on multiple factors)
    // Factors: Win Rate (30%), Profit Factor (25%), Expectancy (20%), Max Drawdown (15%), Consistency (10%)
    const winRateScore = Math.min(winRate, 100) * 0.3;
    const profitFactorScore = Math.min(profitFactor * 20, 100) * 0.25; // Scale profit factor
    const expectancyScore = Math.min(Math.max(expectancy * 2, 0), 100) * 0.2; // Scale expectancy
    const drawdownScore = Math.max(100 - (maxDrawdown / 10), 0) * 0.15; // Lower drawdown = higher score
    const consistencyScore = Math.min((consecutiveWins + consecutiveLosses) * 5, 100) * 0.1;
    const zellaScore = Math.round(winRateScore + profitFactorScore + expectancyScore + drawdownScore + consistencyScore);

    return {
      totalTrades: trades.length,
      winRate: Math.round(winRate * 100) / 100,
      averageRR: Math.round(averageRR * 100) / 100,
      totalProfit: Math.round(totalProfit * 100) / 100,
      maxDrawdown: Math.round(maxDrawdown * 100) / 100,
      equityCurve,
      profitFactor: Math.round(profitFactor * 100) / 100,
      averageWin: Math.round(averageWin * 100) / 100,
      averageLoss: Math.round(averageLoss * 100) / 100,
      largestWin: Math.round(largestWin * 100) / 100,
      largestLoss: Math.round(largestLoss * 100) / 100,
      consecutiveWins,
      consecutiveLosses,
      expectancy: Math.round(expectancy * 100) / 100,
      zellaScore: Math.min(Math.max(zellaScore, 0), 100), // Clamp between 0-100
    };
  }

  private calculateProfit(trade: any): number | null {
    if (!trade.exitPrice) return null;
    
    const priceDiff = trade.type === 'BUY' 
      ? trade.exitPrice - trade.entryPrice
      : trade.entryPrice - trade.exitPrice;
    
    // Simplified profit calculation (would need to account for pip values for different pairs)
    const grossProfit = priceDiff * trade.lotSize * 100000; // Assuming standard lot
    return grossProfit - (trade.commission || 0) - (trade.swap || 0);
  }

  private calculateRiskReward(trade: any): number | null {
    if (!trade.exitPrice || !trade.stopLoss) return null;
    
    const risk = Math.abs(trade.entryPrice - trade.stopLoss);
    const reward = Math.abs(trade.exitPrice - trade.entryPrice);
    
    return risk > 0 ? reward / risk : null;
  }

  private calculateAverageRiskReward(trades: any[]): number {
    const validRRTrades = trades.filter(trade => trade.riskReward !== null);
    if (validRRTrades.length === 0) return 0;
    
    const totalRR = validRRTrades.reduce((sum, trade) => sum + (trade.riskReward || 0), 0);
    return totalRR / validRRTrades.length;
  }

  private calculateEquityCurve(trades: any[]): Array<{ date: string; equity: number }> {
    let runningEquity = 0;
    const curve: Array<{ date: string; equity: number }> = [];
    
    trades.forEach(trade => {
      runningEquity += trade.profit || 0;
      curve.push({
        date: trade.time.toISOString().split('T')[0],
        equity: Math.round(runningEquity * 100) / 100,
      });
    });
    
    return curve;
  }

  private calculateMaxDrawdown(equityCurve: Array<{ date: string; equity: number }>): number {
    if (equityCurve.length === 0) return 0;
    
    let maxDrawdown = 0;
    let peak = equityCurve[0].equity;
    
    equityCurve.forEach(point => {
      if (point.equity > peak) {
        peak = point.equity;
      } else {
        const drawdown = peak - point.equity;
        if (drawdown > maxDrawdown) {
          maxDrawdown = drawdown;
        }
      }
    });
    
    return maxDrawdown;
  }

  private calculateConsecutiveWinsLosses(trades: any[]): { consecutiveWins: number; consecutiveLosses: number } {
    let maxConsecutiveWins = 0;
    let maxConsecutiveLosses = 0;
    let currentWinStreak = 0;
    let currentLossStreak = 0;
    
    trades.forEach(trade => {
      if (trade.status === 'WIN') {
        currentWinStreak++;
        currentLossStreak = 0;
        maxConsecutiveWins = Math.max(maxConsecutiveWins, currentWinStreak);
      } else if (trade.status === 'LOSS') {
        currentLossStreak++;
        currentWinStreak = 0;
        maxConsecutiveLosses = Math.max(maxConsecutiveLosses, currentLossStreak);
      }
    });
    
    return {
      consecutiveWins: maxConsecutiveWins,
      consecutiveLosses: maxConsecutiveLosses,
    };
  }
}
