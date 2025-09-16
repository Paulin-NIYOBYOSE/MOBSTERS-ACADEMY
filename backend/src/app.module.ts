import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MentorModule } from './mentor/mentor.module';
import { PrismaModule } from './prisma/prisma.module';
import { PaymentModule } from './payment/payment.module';
import { CommunityModule } from './community/community.module';
import { AcademyModule } from './academy/academy.module';

@Module({
  imports: [AuthModule, UsersModule, MentorModule, PrismaModule, PaymentModule, CommunityModule, AcademyModule],
})
export class AppModule {}