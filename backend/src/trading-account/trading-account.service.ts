import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTradingAccountDto, UpdateTradingAccountDto } from './dto/trading-account.dto';

@Injectable()
export class TradingAccountService {
  constructor(private prisma: PrismaService) {}

  async createAccount(userId: number, createAccountDto: CreateTradingAccountDto) {
    return this.prisma.tradingAccount.create({
      data: {
        ...createAccountDto,
        userId,
        currentBalance: createAccountDto.currentBalance ?? createAccountDto.startingBalance,
      },
    });
  }

  async getUserAccounts(userId: number) {
    return this.prisma.tradingAccount.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { trades: true },
        },
      },
    });
  }

  async updateAccount(userId: number, accountId: number, updateAccountDto: UpdateTradingAccountDto) {
    // Check if account exists and belongs to user
    const account = await this.prisma.tradingAccount.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new NotFoundException('Trading account not found');
    }

    if (account.userId !== userId) {
      throw new ForbiddenException('You can only update your own trading accounts');
    }

    return this.prisma.tradingAccount.update({
      where: { id: accountId },
      data: updateAccountDto,
    });
  }

  async deleteAccount(userId: number, accountId: number) {
    // Check if account exists and belongs to user
    const account = await this.prisma.tradingAccount.findUnique({
      where: { id: accountId },
      include: {
        _count: {
          select: { trades: true },
        },
      },
    });

    if (!account) {
      throw new NotFoundException('Trading account not found');
    }

    if (account.userId !== userId) {
      throw new ForbiddenException('You can only delete your own trading accounts');
    }

    // Check if account has trades
    if (account._count.trades > 0) {
      throw new ForbiddenException('Cannot delete account with existing trades');
    }

    await this.prisma.tradingAccount.delete({
      where: { id: accountId },
    });

    return { message: 'Trading account deleted successfully' };
  }
}
