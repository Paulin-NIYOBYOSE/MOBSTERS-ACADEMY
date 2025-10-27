import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { TradingAccountService } from './trading-account.service';
import { CreateTradingAccountDto, UpdateTradingAccountDto } from './dto/trading-account.dto';

@Controller('trading-accounts')
@UseGuards(JwtGuard)
export class TradingAccountController {
  constructor(private readonly tradingAccountService: TradingAccountService) {}

  @Post()
  async createAccount(@Request() req, @Body() createAccountDto: CreateTradingAccountDto) {
    return this.tradingAccountService.createAccount(req.user.userId, createAccountDto);
  }

  @Get()
  async getUserAccounts(@Request() req) {
    return this.tradingAccountService.getUserAccounts(req.user.userId);
  }

  @Put(':id')
  async updateAccount(
    @Request() req,
    @Param('id', ParseIntPipe) accountId: number,
    @Body() updateAccountDto: UpdateTradingAccountDto,
  ) {
    return this.tradingAccountService.updateAccount(req.user.userId, accountId, updateAccountDto);
  }

  @Delete(':id')
  async deleteAccount(@Request() req, @Param('id', ParseIntPipe) accountId: number) {
    return this.tradingAccountService.deleteAccount(req.user.userId, accountId);
  }
}
