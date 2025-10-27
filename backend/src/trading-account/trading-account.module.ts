import { Module } from '@nestjs/common';
import { TradingAccountController } from './trading-account.controller';
import { TradingAccountService } from './trading-account.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TradingAccountController],
  providers: [TradingAccountService],
  exports: [TradingAccountService],
})
export class TradingAccountModule {}
