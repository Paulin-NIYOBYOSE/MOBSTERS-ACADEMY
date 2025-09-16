import { Module } from '@nestjs/common';
import { AcademyController } from './academy.controller';

@Module({
  controllers: [AcademyController],
})
export class AcademyModule {}