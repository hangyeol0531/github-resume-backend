import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Cache } from 'cache-manager';
import { SlackService } from '../slack/slack.service';

@Injectable()
export class BatchService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly slackService: SlackService,
  ) {}

  @Cron('0 * * * *')
  async getSearchCountAndNotification() {
    const names = await this.getCacheUserNames();
    await this.slackService.sendSearchUser(names);
  }

  private getCacheUserNames = async (): Promise<string[]> => {
    return (await this.cache.store.keys('/github/user/*')).map(
      (key) => key.split('/')[3],
    );
  };
}
