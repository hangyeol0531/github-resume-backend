import { registerAs } from '@nestjs/config';

export default registerAs('github', () => ({
  auth: {
    token: process.env.SEARCH_GITHUB_CLIENT_TOKEN,
  },
}));
