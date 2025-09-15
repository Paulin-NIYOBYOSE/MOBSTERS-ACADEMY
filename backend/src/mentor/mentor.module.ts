import { Module } from '@nestjs/common';
import { MentorController } from './mentor.controller';

@Module({
  controllers: [MentorController],
})
export class MentorModule {}