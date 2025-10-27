import { Module } from '@nestjs/common';
import { TradingJournalController } from './trading-journal.controller';
import { TradingJournalService } from './trading-journal.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TradingJournalController],
  providers: [TradingJournalService],
  exports: [TradingJournalService],
})
export class TradingJournalModule {}
