import { Module } from '@nestjs/common';
import { TradingJournalController } from './trading-journal.controller';
import { TradingJournalService } from './trading-journal.service';
import { EnhancedAnalyticsService } from './enhanced-analytics.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TradingJournalController],
  providers: [TradingJournalService, EnhancedAnalyticsService],
  exports: [TradingJournalService, EnhancedAnalyticsService],
})
export class TradingJournalModule {}
