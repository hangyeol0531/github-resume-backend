import {
  CacheInterceptor,
  CacheModule,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import * as redisStore from 'cache-manager-ioredis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GithubModule } from './github/github.module';
import githubConfig from './config/githubConfig';
import { LoggerMiddleware } from './logger/logger-middleware';
import redisConfig from './config/redisConfig';

@Module({
  imports: [
    GithubModule,
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.env`],
      load: [githubConfig, redisConfig],
      isGlobal: true,
      cache: true,
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      isGlobal: true,
      useFactory: (config: ConfigType<typeof redisConfig>) => ({
        store: redisStore,
        host: config.host,
        port: config.port,
        ttl: 60 * 60,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
