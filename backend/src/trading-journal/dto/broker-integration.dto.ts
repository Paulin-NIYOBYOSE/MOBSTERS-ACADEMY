import { IsString, IsNumber, IsOptional, IsEnum, IsBoolean } from 'class-validator';

export enum BrokerType {
  MT4 = 'MT4',
  MT5 = 'MT5',
  CTRADER = 'CTRADER',
  TRADINGVIEW = 'TRADINGVIEW',
  MANUAL = 'MANUAL',
}

export class ConnectBrokerDto {
  @IsEnum(BrokerType)
  brokerType: BrokerType;

  @IsString()
  accountNumber: string;

  @IsString()
  @IsOptional()
  serverName?: string;

  @IsString()
  @IsOptional()
  apiKey?: string;

  @IsString()
  @IsOptional()
  apiSecret?: string;

  @IsBoolean()
  @IsOptional()
  autoSync?: boolean;
}

export class ImportTradesDto {
  @IsNumber()
  accountId: number;

  @IsString()
  @IsOptional()
  startDate?: string;

  @IsString()
  @IsOptional()
  endDate?: string;
}

export class BrokerAccountDto {
  id: number;
  userId: number;
  accountId: number;
  brokerType: BrokerType;
  accountNumber: string;
  serverName?: string;
  isConnected: boolean;
  autoSync: boolean;
  lastSyncAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
