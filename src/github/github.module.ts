import { Module } from '@nestjs/common';
import { GithubService } from './github.service';
import { GithubController } from './github.controller';
import { GithubClientModule } from '../github-client/github-client.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [GithubClientModule, CommonModule],
  controllers: [GithubController],
  providers: [GithubService],
})
export class GithubModule {}
