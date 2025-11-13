import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { PrismaModule } from '../prisma/prisma.module';
import { SessionGateway } from '../gateways/session.gateway';

@Module({
  imports: [PrismaModule],
  controllers: [CourseController],
  providers: [CourseService, SessionGateway],
})
export class CourseModule {}