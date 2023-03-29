import { Module } from '@nestjs/common';
import { GithubService } from './github.service';
import { GithubController } from './github.controller';
import { GithubClientService } from '../github-client/github-client-service';

@Module({
  controllers: [GithubController],
  providers: [GithubService, GithubClientService],
})
export class GithubModule {}
