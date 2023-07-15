import { Test, TestingModule } from '@nestjs/testing';
import { CacheModule, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import * as redisStore from 'cache-manager-ioredis';
import { GithubModule } from '../src/github/github.module';

import hangyeol0531UserData from './github/data/hangyeol0531-user-data.json';
import hangyeol0531PinnedRepositories from './github/data/hangyeol0531-pinnedRepositories-data.json';
import hangyeol0531RepositoriesAndLanguages from './github/data/hangyeol0531-repositoriesAndLanguages-data.json';
import hangyeol0531NowYearCommitCount from './github/data/hangyeol0531-nowYearCommitCount-data.json';
import hangyeol0531LatestPushedRepository from './github/data/hangyeol0531-latestPushedRepository-data.json';
import hangyeol0531ContributionCount from './github/data/hangyeol0531-contributionCount-data.json';
import hangyeol0531Result from './github/data/hangyeol0531-result.json';
import { GithubService } from '../src/github/github.service';
import {
  ICommitCount,
  ILatestPushedRepository,
  IPinnedRepository,
  IRepositoryAndLanguage,
  IUser,
} from '../src/github-client/types';
import { MonthlyContributionHistory } from '../src/github/dto/user-github-information.dto';
import { GithubClientService } from '../src/github-client/github-client.service';
import githubConfig from '../src/config/githubConfig';
import redisConfig from '../src/config/redisConfig';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let userId: string;

  beforeEach(async () => {
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
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/github/user/:userId (GET)', () => {
    userId = 'hangyeol0531';
    const githubService = app.get<GithubService>(GithubService);
    const githubClientService =
      app.get<GithubClientService>(GithubClientService);

    jest.spyOn(githubClientService, 'getExistsUser').mockResolvedValue(true);
    // user
    jest
      .spyOn(githubClientService, 'getUserInformation')
      .mockResolvedValue(hangyeol0531UserData as IUser);

    // pinnedRepositories
    jest
      .spyOn(githubClientService, 'getPinnedRepositories')
      .mockResolvedValue(hangyeol0531PinnedRepositories as IPinnedRepository);

    // repositoriesAndLanguages
    jest
      .spyOn(githubClientService, 'getRepositoryCommitsAndLanguages')
      .mockResolvedValue(
        hangyeol0531RepositoriesAndLanguages as IRepositoryAndLanguage,
      );

    // contributions
    jest
      .spyOn(githubClientService, 'getNowYearCommitCount')
      .mockResolvedValue(hangyeol0531NowYearCommitCount as ICommitCount);

    jest
      .spyOn(githubService, 'getMonthlyContributionHistories')
      .mockResolvedValue(
        hangyeol0531ContributionCount.data as MonthlyContributionHistory[],
      );

    jest
      .spyOn(githubClientService, 'getLatestPushedRepository')
      .mockResolvedValue(
        hangyeol0531LatestPushedRepository as ILatestPushedRepository,
      );

    return request(app.getHttpServer())
      .get(`/github/user/${userId}`)
      .expect(200)
      .expect(hangyeol0531Result);
  });
});
