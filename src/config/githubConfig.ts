import { registerAs } from '@nestjs/config';

export default registerAs('github', () => ({
  auth: {
    token: process.env.GITHUB_TOKEN,
  },
}));
