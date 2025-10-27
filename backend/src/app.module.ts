import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { PaymentModule } from './payment/payment.module';
import { CommunityModule } from './community/community.module';
import { AcademyModule } from './academy/academy.module';
import { CourseModule } from './course/course.module';
import { TradingJournalModule } from './trading-journal/trading-journal.module';
import { TradingAccountModule } from './trading-account/trading-account.module';

@Module({
  imports: [AuthModule, UsersModule, PrismaModule, PaymentModule, CommunityModule, AcademyModule, CourseModule, TradingJournalModule, TradingAccountModule],
})
export class AppModule {}