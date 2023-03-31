import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GithubModule } from './github/github.module';
import githubConfig from './config/githubConfig';

@Module({
  imports: [
    GithubModule,
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.env`],
      load: [githubConfig],
      isGlobal: true,
      cache: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
