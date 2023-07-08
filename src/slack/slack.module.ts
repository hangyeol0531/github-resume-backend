import { Module } from '@nestjs/common';
import { SlackService } from './slack.service';

@Module({
  exports: [SlackService],
  providers: [SlackService],
})
export class SlackModule {}
