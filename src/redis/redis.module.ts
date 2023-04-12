import { CacheModule, Inject, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-ioredis';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import redisConfig from '../config/redisConfig';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigType<typeof redisConfig>) => ({
        isGlobal: true,
        store: redisStore,
        host: config.redis.host,
        port: config.redis.port,
      }),
    }),
  ],
  exports: [],
})
export class RedisModule {}
