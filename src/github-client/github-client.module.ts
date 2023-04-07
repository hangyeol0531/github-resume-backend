import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GithubClientService } from './github-client.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 1000 * 3,
      baseURL: 'https://github.com/',
    }),
  ],
  exports: [GithubClientService],
  providers: [GithubClientService],
})
export class GithubClientModule {}
