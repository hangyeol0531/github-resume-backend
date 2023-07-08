import { registerAs } from '@nestjs/config';

export default registerAs('slack', () => ({
  url: process.env.SLACK_WEB_HOOK,
}));
