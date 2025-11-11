import { authService } from './authService';

export interface TradingAccount {
  id: number;
  name: string;
  startingBalance: number;
  currentBalance: number;
  description?: string;
}

export interface CreateTradeDto {
  accountId: number;
  pair: string;
  type: 'BUY' | 'SELL';
  time: string;
  chartLink?: string;
  riskPercent?: number;
  notes?: string;
  profit?: number;
  status?: 'RUNNING' | 'WIN' | 'LOSS' | 'BREAKEVEN';
}

export interface UpdateTradeDto extends Partial<CreateTradeDto> {}

export interface Trade {
  id: number;
  accountId: number;
  account: TradingAccount;
  pair: string;
  type: 'BUY' | 'SELL';
  time: string;
  chartLink?: string;
  riskPercent?: number;
  notes?: string;
  profit?: number;
  status: 'RUNNING' | 'WIN' | 'LOSS' | 'BREAKEVEN';
  createdAt: string;
  updatedAt: string;
}

export interface TradeAnalytics {
  totalTrades: number;
  winRate: number;
  averageRR: number;
  totalProfit: number;
  maxDrawdown: number;
  equityCurve: Array<{ date: string; equity: number }>;
  currentBalance: number;
  averageWin: number;
  averageLoss: number;
  largestWin: number;
  largestLoss: number;
  consecutiveWins: number;
  consecutiveLosses: number;
}

export interface TradesResponse {
  trades: Trade[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class TradingJournalService {
  private baseUrl = 'http://localhost:3000/api';

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('accessToken');
    
    const response = await fetch(`${this.baseUrl}/trading-journal${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async createTrade(tradeData: CreateTradeDto): Promise<Trade> {
    return this.request<Trade>('/trades', {
      method: 'POST',
      body: JSON.stringify(tradeData),
    });
  }

  async getTrades(
    page = 1,
    limit = 20,
    accountId?: number,
    period?: 'week' | 'month' | 'year' | 'custom',
    startDate?: string,
    endDate?: string
  ): Promise<TradesResponse> {
    console.log('getTrades called with:', { page, limit, accountId, period, startDate, endDate });
    
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(accountId && { accountId: accountId.toString() }),
      ...(period && { period }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    });

    console.log('Request URL:', `/trades?${params}`);
    return this.request<TradesResponse>(`/trades?${params}`);
  }

  async updateTrade(tradeId: number, tradeData: UpdateTradeDto): Promise<Trade> {
    return this.request<Trade>(`/trades/${tradeId}`, {
      method: 'PUT',
      body: JSON.stringify(tradeData),
    });
  }

  async deleteTrade(tradeId: number): Promise<void> {
    await this.request(`/trades/${tradeId}`, {
      method: 'DELETE',
    });
  }

  async getAnalytics(
    accountId?: number,
    period?: 'week' | 'month' | 'year' | 'custom',
    startDate?: string,
    endDate?: string
  ): Promise<TradeAnalytics> {
    console.log('getAnalytics called with:', { accountId, period, startDate, endDate });
    
    const params = new URLSearchParams({
      ...(accountId && { accountId: accountId.toString() }),
      ...(period && { period }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    });
    
    const queryString = params.toString();
    console.log('Analytics request URL:', `/analytics${queryString ? `?${queryString}` : ''}`);
    return this.request<TradeAnalytics>(`/analytics${queryString ? `?${queryString}` : ''}`);
  }

  // Helper method to close a trade
  async closeTrade(
    tradeId: number,
    status: 'WIN' | 'LOSS' | 'BREAKEVEN',
    profit?: number
  ): Promise<Trade> {
    return this.updateTrade(tradeId, {
      profit,
      status,
    });
  }

  // Format currency for display
  formatCurrency(amount: number, currency = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  }

  // Format percentage for display
  formatPercentage(value: number): string {
    return `${value.toFixed(2)}%`;
  }

  // Get status color for UI
  getStatusColor(status: string): string {
    switch (status) {
      case 'RUNNING': return 'bg-blue-500';
      case 'CLOSED': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  }

  // Get profit color for UI
  getProfitColor(profit?: number): string {
    if (!profit) return 'text-gray-500';
    return profit > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  }
}

export const tradingJournalService = new TradingJournalService();
