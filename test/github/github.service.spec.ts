import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { GithubService } from '../../src/github/github.service';
import { GithubClientModule } from '../../src/github-client/github-client.module';
import { CommonModule } from '../../src/common/common.module';
import githubConfig from '../../src/config/githubConfig';
import { GithubClientService } from '../../src/github-client/github-client.service';
import hangyeol0531Userdata from './data/hangyeol0531-user-data.json';
import { IUser } from '../../src/github-client/types';

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
      providers: [GithubService, GithubClientService],
    }).compile();
    githubService = module.get<GithubService>(GithubService);
    githubClientService = module.get<GithubClientService>(GithubClientService);
  });

  describe('should have a githubService getUserInformation', () => {
    it('should have a  githubService getUserInformation', () => {
      expect(typeof githubService.getUserInformation).toBe('function');
    });

    it('github 정보가 모두 들어있는 유저', async () => {
      userId = 'hangyeol0531';
      jest
        .spyOn(githubClientService, 'getUserInformation')
        .mockResolvedValue(hangyeol0531Userdata as IUser);

      const data = await githubService.getUserInformation(userId);
    });
  });
});
