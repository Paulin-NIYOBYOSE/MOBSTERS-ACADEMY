interface TradingAccount {
  id: number;
  name: string;
  startingBalance: number;
  currentBalance: number;
  description?: string;
  brokerType?: string;
  accountNumber?: string;
  serverName?: string;
  isConnected?: boolean;
  autoSync?: boolean;
  lastSyncAt?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    trades: number;
  };
}

interface CreateTradingAccountDto {
  name: string;
  startingBalance: number;
  currentBalance?: number;
  description?: string;
  brokerType?: string;
  accountNumber?: string;
  serverName?: string;
  isConnected?: boolean;
  autoSync?: boolean;
  apiKey?: string;
  apiSecret?: string;
}

interface UpdateTradingAccountDto {
  name?: string;
  startingBalance?: number;
  description?: string;
  brokerType?: string;
  accountNumber?: string;
  serverName?: string;
  isConnected?: boolean;
  autoSync?: boolean;
  apiKey?: string;
  apiSecret?: string;
}

class TradingAccountService {
  private baseUrl = 'http://localhost:3000/api';

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('accessToken');
    
    const response = await fetch(`${this.baseUrl}/trading-accounts${endpoint}`, {
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

  async createAccount(data: CreateTradingAccountDto): Promise<TradingAccount> {
    return this.request<TradingAccount>('', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAccounts(): Promise<TradingAccount[]> {
    return this.request<TradingAccount[]>('');
  }

  async updateAccount(id: number, data: UpdateTradingAccountDto): Promise<TradingAccount> {
    return this.request<TradingAccount>(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAccount(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/${id}`, {
      method: 'DELETE',
    });
  }
}

export const tradingAccountService = new TradingAccountService();
export type { TradingAccount, CreateTradingAccountDto, UpdateTradingAccountDto };
