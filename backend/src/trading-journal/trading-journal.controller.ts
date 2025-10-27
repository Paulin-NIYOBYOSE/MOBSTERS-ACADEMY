import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { TradingJournalService } from './trading-journal.service';
import { CreateTradeDto, UpdateTradeDto, TradeQueryDto, AnalyticsQueryDto } from './dto/trading-journal.dto';

@Controller('trading-journal')
@UseGuards(JwtGuard)
export class TradingJournalController {
  constructor(private readonly tradingJournalService: TradingJournalService) {}

  @Post('trades')
  async createTrade(@Request() req, @Body() createTradeDto: CreateTradeDto) {
    return this.tradingJournalService.createTrade(req.user.userId, createTradeDto);
  }

  @Get('trades')
  async getUserTrades(@Request() req, @Query() query: TradeQueryDto) {
    console.log('getUserTrades called with query:', query);
    console.log('userId:', req.user.userId);
    
    return this.tradingJournalService.getUserTrades(
      req.user.userId,
      query.page,
      query.limit,
      query.accountId,
      query.period,
      query.startDate,
      query.endDate,
    );
  }

  @Get('analytics')
  async getTradeAnalytics(@Request() req, @Query() query: AnalyticsQueryDto) {
    console.log('getTradeAnalytics called with query:', query);
    console.log('userId:', req.user.userId);
    
    return this.tradingJournalService.getTradeAnalytics(
      req.user.userId,
      query.accountId,
      query.period,
      query.startDate,
      query.endDate,
    );
  }

  @Put('trades/:id')
  async updateTrade(
    @Request() req,
    @Param('id', ParseIntPipe) tradeId: number,
    @Body() updateTradeDto: UpdateTradeDto,
  ) {
    return this.tradingJournalService.updateTrade(req.user.userId, tradeId, updateTradeDto);
  }

  @Delete('trades/:id')
  async deleteTrade(@Request() req, @Param('id', ParseIntPipe) tradeId: number) {
    return this.tradingJournalService.deleteTrade(req.user.userId, tradeId);
  }
}
