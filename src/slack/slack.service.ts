import { Inject, Injectable } from '@nestjs/common';
import Slack from 'slack-node';
import { ConfigType } from '@nestjs/config';
import { IAttachment } from './types';
import slackConfig from '../config/slackConfig';

@Injectable()
export class SlackService {
  private readonly slack: Slack;

  constructor(
    @Inject(slackConfig.KEY) private config: ConfigType<typeof slackConfig>,
  ) {
    this.slack = new Slack();
    this.slack.setWebhook(config.url);
  }

  public async sendSearchUser(users: string[]): Promise<void> {
    const text = `*${users.length}명의 유저가 조회되었습니다.*`;
    const attachments: IAttachment[] = users.map((user) => ({
      text: user,
      color: '#26A641',
    }));
    await this.send(text, attachments);
  }

  private send(text: string, attachments: IAttachment[]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.slack.webhook(
        {
          text,
          attachments,
        },
        (err) => {
          if (err) reject(err);
          resolve();
        },
      );
    });
  }
}
