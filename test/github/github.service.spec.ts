import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common';
import { GithubService } from '../../src/github/github.service';
import { GithubClientModule } from '../../src/github-client/github-client.module';
import { CommonModule } from '../../src/common/common.module';
import githubConfig from '../../src/config/githubConfig';

import hangyeol0531UserData from './data/hangyeol0531-user-data.json';
import hangyeol0531PinnedRepositories from './data/hangyeol0531-pinnedRepositories-data.json';
import hangyeol0531RepositoriesAndLanguages from './data/hangyeol0531-repositoriesAndLanguages-data.json';
import hangyeol0531NowYearCommitCount from './data/hangyeol0531-nowYearCommitCount-data.json';
import hangyeol0531LatestPushedRepository from './data/hangyeol0531-latestPushedRepository-data.json';
import hangyeol0531ContributionCount from './data/hangyeol0531-contributionCount-data.json';
import hangyeol0531Result from './data/hangyeol0531-result.json';

import emptyUserUserData from './data/emptyUser-user-data.json';
import emptyUserPinnedRepositories from './data/emptyUser-pinnedRepositories-data.json';
import emptyUserRepositoriesAndLanguages from './data/emptyUser-repositoriesAndLanguages-data.json';
import emptyUserNowYearCommitCount from './data/emptyUser-nowYearCommitCount-data.json';
import emptyUserLatestPushedRepository from './data/emptyUser-latestPushedRepository-data.json';
import emptyUserContributionCount from './data/emptyUser-contributionCount-data.json';
import emptyUserResult from './data/emptyUser-result.json';

import {
  ICommitCount,
  ILatestPushedRepository,
  IPinnedRepository,
  IRepository,
  IUser,
} from '../../src/github-client/types';
import { GithubMessage } from '../../src/github/github.message';
import { GithubClientService } from '../../src/github-client/github-client.service';
import {
  MonthlyContributionHistory,
  UserGithubInformationDto,
} from '../../src/github/dto/user-github-information.dto';

jest.mock('../../src/github-client/github-client.service');

describe('GithubService', () => {
  let githubService: GithubService;
  let githubClientService: GithubClientService;
  let userId: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        GithubClientModule,
        CommonModule,
        HttpModule.register({
          timeout: 1000 * 3,
          baseURL: 'https://github.com/',
        }),
        ConfigModule.forRoot({
          envFilePath: [`${__dirname}/config/env/.env`],
          load: [githubConfig],
          isGlobal: true,
          cache: true,
        }),
      ],
      providers: [GithubService],
    }).compile();
    githubService = module.get<GithubService>(GithubService);
    githubClientService = module.get<GithubClientService>(GithubClientService);
  });

  describe('should have a githubService getUserInformation', () => {
    it('should have a githubService getUserInformation', () => {
      expect(typeof githubService.getUserInformation).toBe('function');
    });
  });

  describe('존재하지 않는 유저', () => {
    beforeEach(() => {
      userId = 'notFoundUser';
      jest.spyOn(githubClientService, 'getExistsUser').mockResolvedValue(false);
    });
    it('github 존재하지 않는 계정이라면 예외를 던진다.', async () => {
      await expect(
        githubService.getUserInformation(userId),
      ).rejects.toThrowError(
        new NotFoundException(GithubMessage.NOT_FOUND_USER),
      );
    });
  });

  describe('존재하는 유저', () => {
    beforeEach(() => {
      jest.spyOn(githubClientService, 'getExistsUser').mockResolvedValue(true);
    });

    describe('github 정보가 모두 들어있는 유저 - hangyeol0531', () => {
      let result: UserGithubInformationDto;
      beforeEach(async () => {
        userId = 'hangyeol0531';
        // user
        jest
          .spyOn(githubClientService, 'getUserInformation')
          .mockResolvedValue(hangyeol0531UserData as IUser);

        // pinnedRepositories
        jest
          .spyOn(githubClientService, 'getPinnedRepositories')
          .mockResolvedValue(
            hangyeol0531PinnedRepositories as IPinnedRepository,
          );

        // repositoriesAndLanguages
        jest
          .spyOn(githubClientService, 'getRepositoriesAndLanguages')
          .mockResolvedValue(
            hangyeol0531RepositoriesAndLanguages as IRepository,
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

        result = await githubService.getUserInformation(userId);
      });

      it('user - hangyeol0531', async () => {
        expect(result.user).toStrictEqual(hangyeol0531Result.user);
      });

      it('repositories - hangyeol0531', () => {
        expect(result.repositories).toStrictEqual(
          hangyeol0531Result.repositories,
        );
      });

      it('languages - hangyeol0531', () => {
        expect(result.languages).toStrictEqual(hangyeol0531Result.languages);
      });

      it('contributions - hangyeol0531', () => {
        expect(result.contributions).toStrictEqual(
          hangyeol0531Result.contributions,
        );
      });
    });

    describe('github 정보가 비어있는 유저', () => {
      let result: UserGithubInformationDto;
      beforeEach(async () => {
        userId = 'emptyUser';

        // user
        jest
          .spyOn(githubClientService, 'getUserInformation')
          .mockResolvedValue(emptyUserUserData as IUser);

        // pinnedRepositories
        jest
          .spyOn(githubClientService, 'getPinnedRepositories')
          .mockResolvedValue(emptyUserPinnedRepositories as IPinnedRepository);

        // repositoriesAndLanguages
        jest
          .spyOn(githubClientService, 'getRepositoriesAndLanguages')
          .mockResolvedValue(emptyUserRepositoriesAndLanguages as IRepository);

        // contributions
        jest
          .spyOn(githubClientService, 'getNowYearCommitCount')
          .mockResolvedValue(emptyUserNowYearCommitCount as ICommitCount);

        jest
          .spyOn(githubService, 'getMonthlyContributionHistories')
          .mockResolvedValue(
            emptyUserContributionCount.data as MonthlyContributionHistory[],
          );

        jest
          .spyOn(githubClientService, 'getLatestPushedRepository')
          .mockResolvedValue(
            emptyUserLatestPushedRepository as ILatestPushedRepository,
          );

        result = await githubService.getUserInformation(userId);
      });

      it('user - emptyUser', async () => {
        expect(result.user).toStrictEqual(emptyUserResult.user);
      });

      it('repositories - emptyUser', () => {
        expect(result.repositories).toStrictEqual(emptyUserResult.repositories);
      });

      it('languages - emptyUser', () => {
        expect(result.languages).toStrictEqual(emptyUserResult.languages);
      });

      it('contributions - emptyUser', () => {
        expect(result.contributions).toStrictEqual(
          emptyUserResult.contributions,
        );
      });
    });
  });
});
