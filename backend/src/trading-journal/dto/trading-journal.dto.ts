import { IsString, IsNumber, IsOptional, IsDateString, IsArray, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTradeDto {
  @IsNumber()
  @Type(() => Number)
  accountId: number;

  @IsString()
  pair: string;

  @IsString()
  @IsIn(['BUY', 'SELL'])
  type: string;

  @IsDateString()
  time: string;

  @IsOptional()
  @IsString()
  chartLink?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  riskPercent?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  profit?: number;

  @IsOptional()
  @IsString()
  @IsIn(['RUNNING', 'WIN', 'LOSS', 'BREAKEVEN'])
  status?: string;
}

export class UpdateTradeDto {
  @IsOptional()
  @IsString()
  pair?: string;

  @IsOptional()
  @IsString()
  @IsIn(['BUY', 'SELL'])
  type?: string;

  @IsOptional()
  @IsDateString()
  time?: string;

  @IsOptional()
  @IsString()
  chartLink?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  riskPercent?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  profit?: number;

  @IsOptional()
  @IsString()
  @IsIn(['RUNNING', 'WIN', 'LOSS', 'BREAKEVEN'])
  status?: string;
}

export class TradeAnalyticsDto {
  totalTrades: number;
  winRate: number;
  averageRR: number;
  totalProfit: number;
  maxDrawdown: number;
  equityCurve: Array<{ date: string; equity: number }>;
  profitFactor: number;
  averageWin: number;
  averageLoss: number;
  largestWin: number;
  largestLoss: number;
  consecutiveWins: number;
  consecutiveLosses: number;
}

export class TradeQueryDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number = 20;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  accountId?: number;

  @IsOptional()
  @IsString()
  @IsIn(['week', 'month', 'year', 'custom'])
  period?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class AnalyticsQueryDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  accountId?: number;

  @IsOptional()
  @IsString()
  @IsIn(['week', 'month', 'year', 'custom'])
  period?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
