import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common';
import { GithubService } from '../../src/github/github.service';
import { GithubClientModule } from '../../src/github-client/github-client.module';
import { CommonModule } from '../../src/common/common.module';
import githubConfig from '../../src/config/githubConfig';
import hangyeol0531UserData from './data/hangyeol0531-user-data.json';
import { IUser } from '../../src/github-client/types';
import { GithubMessage } from '../../src/github/github.message';
import { GithubClientService } from '../../src/github-client/github-client.service';

// jest.mock('../../src/github-client/github-client.service');

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
    it('should have a  githubService getUserInformation', () => {
      expect(typeof githubService.getUserInformation).toBe('function');
    });

    it('github 존재하지 않는 계정이라면 예외를 던진다.', async () => {
      userId = 'notFoundUser';
      jest.spyOn(githubClientService, 'getExistsUser').mockResolvedValue(false);
      await expect(
        githubService.getUserInformation(userId),
      ).rejects.toThrowError(
        new NotFoundException(GithubMessage.NOT_FOUND_USER),
      );
    });

    it('github 정보가 모두 들어있는 유저 - hangyeol0531', async () => {
      userId = 'hangyeol0531';
      // jest
      // .spyOn(githubClientService, 'getUserInformation')
      // .mockResolvedValue(hangyeol0531UserData as IUser);
      const data = await githubService.getUserInformation(userId);
    });
  });
});
