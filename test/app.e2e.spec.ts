import { Test, TestingModule } from '@nestjs/testing';
import { CacheModule, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import * as redisStore from 'cache-manager-ioredis';
import { GithubModule } from '../src/github/github.module';
import hangyeol0531Result from './github/data/hangyeol0531-result.json';
import { GithubService } from '../src/github/github.service';
import { UserGithubInformationDto } from '../src/github/dto/user-github-information.dto';
import githubConfig from '../src/config/githubConfig';
import redisConfig from '../src/config/redisConfig';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let userId: string;
  let githubService: GithubService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,
        ConfigModule.forRoot({
          envFilePath: [`${__dirname}/config/env/.env`],
          load: [githubConfig, redisConfig],
          isGlobal: true,
          cache: true,
        }),
        GithubModule,
        CacheModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          isGlobal: true,
          useFactory: (config: ConfigType<typeof redisConfig>) => ({
            store: redisStore,
            host: config.host,
            port: config.port,
          }),
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    githubService = app.get<GithubService>(GithubService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/github/user/:userId (GET)', () => {
    userId = 'hangyeol0531';

    jest
      .spyOn(githubService, 'getUserInformation')
      .mockResolvedValue(hangyeol0531Result as UserGithubInformationDto);

    return request(app.getHttpServer())
      .get(`/github/user/${userId}`)
      .expect(200);
  });
});
