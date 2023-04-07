import { Module } from '@nestjs/common';
import { GithubService } from './github.service';
import { GithubController } from './github.controller';
import { GithubClientModule } from '../github-client/github-client.module';

@Module({
  imports: [GithubClientModule],
  controllers: [GithubController],
  providers: [GithubService],
})
export class GithubModule {}
