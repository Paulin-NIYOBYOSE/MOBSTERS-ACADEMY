import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { PaymentModule } from './payment/payment.module';
import { CommunityModule } from './community/community.module';
import { AcademyModule } from './academy/academy.module';
import { CourseModule } from './course/course.module';

@Module({
  imports: [AuthModule, UsersModule, PrismaModule, PaymentModule, CommunityModule, AcademyModule, CourseModule],
})
export class AppModule {}