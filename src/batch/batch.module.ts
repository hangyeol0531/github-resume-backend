import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { BatchService } from './batch.service';
import { SlackModule } from '../slack/slack.module';

@Module({
  imports: [ScheduleModule.forRoot(), SlackModule],
  providers: [BatchService],
})
export class BatchModule {}
