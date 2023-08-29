import { Injectable, NotFoundException } from '@nestjs/common';
import { GithubClientService } from '../github-client/github-client.service';
import {
  ContributionDto,
  LanguageRateDto,
  MonthlyContributionHistory,
  RepositoryDto,
  SocialAccountDto,
  UserDto,
  UserGithubInformationDto,
} from './dto/user-github-information.dto';
import { IPinnedRepository, ILanguageInfo } from '../github-client/types';
import { YearAndMonthDateDto } from '../common/dto/common.dto';
import { CommonService } from '../common/common.service';
import { GithubMessage } from './github.message';

@Injectable()
export class GithubService {
  constructor(
    private readonly githubClientService: GithubClientService,
    private readonly commonService: CommonService,
  ) {}

  private readonly recentMonthRange = 5;

  async getUserInformation(userId: string): Promise<UserGithubInformationDto> {
    const existsUser = await this.githubClientService.getExistsUser(userId);
    if (!existsUser) {
      throw new NotFoundException(GithubMessage.NOT_FOUND_USER);
    }
    const [user, repositories, languages, contributions]: [
      user: UserDto,
      repositories: RepositoryDto[],
      languages: LanguageRateDto[],
      contributions: ContributionDto,
    ] = await Promise.all([
      this.getUser(userId),
      this.getPinnedRepositories(userId),
      this.getLanguageRates(userId),
      this.getContributions(userId),
    ]);

    return {
      user,
      repositories,
      languages,
      contributions,
    };
  }

  private async getUser(userId: string): Promise<UserDto> {
    const { user } = await this.githubClientService.getUserInformation(userId);
    const socialAccounts: SocialAccountDto[] = user.socialAccounts?.nodes.map(
      ({ provider: name, url }) => ({
        name,
        url,
      }),
    );

    return {
      id: userId,
      name: user.name,
      introduce: user.bio,
      imageUrl: user.avatarUrl,
      contact: {
        socialAccounts,
        email: user.email,
        websiteUrl: user.websiteUrl,
      },
      repositoryCount: user?.repositories?.totalCount,
      followerCount: user?.followers?.totalCount,
    };
  }

  private async getPinnedRepositories(
    userId: string,
  ): Promise<RepositoryDto[]> {
    const {
      user: { pinnedItems },
    }: IPinnedRepository = await this.githubClientService.getPinnedRepositories(
      userId,
    );

    return pinnedItems.edges.map(({ node: pinnedItem }) => {
      const topics: string[] = pinnedItem.repositoryTopics.nodes.map(
        ({ topic }) => topic.name,
      );

      return {
        topics,
        name: pinnedItem.name,
        description: pinnedItem.description,
        url: pinnedItem.url,
        homepageUrl: pinnedItem.homepageUrl,
        language: pinnedItem?.primaryLanguage?.name,
        starCount: pinnedItem.stargazerCount,
        forkCount: pinnedItem.forkCount,
        owner: pinnedItem.owner.login,
      };
    });
  }

  private async getLanguageRates(userId: string): Promise<LanguageRateDto[]> {
    const {
      user: {
        contributionsCollection: { commitContributionsByRepository },
      },
    } = await this.githubClientService.getRepositoryCommitsAndLanguages(userId);

    const languageSizes: ILanguageInfo[] = [];
    commitContributionsByRepository
      .filter(({ repository }) => !!repository?.primaryLanguage?.name)
      .forEach(({ repository, contributions }) => {
        languageSizes.push({
          name: repository.primaryLanguage.name,
          color: repository.primaryLanguage.color,
          size: contributions.totalCount,
        });
      });

    return GithubService.getLanguageRatesFromRepositories(languageSizes);
  }

  private async getContributions(userId: string): Promise<ContributionDto> {
    const year: number = new Date().getFullYear();
    const {
      user: {
        contributionsCollection: { totalCommitContributions: commitCount },
      },
    } = await this.githubClientService.getNowYearCommitCount(userId, year);

    const monthRangeDateDtos: YearAndMonthDateDto[] =
      this.commonService.getYearAndMonthDateDto(this.recentMonthRange);

    const monthlyContributionHistories =
      await this.getMonthlyContributionHistories(userId, monthRangeDateDtos);

    const {
      user: {
        repositories: {
          nodes: [latestCommittedRepository],
        },
      },
    } = await this.githubClientService.getLatestPushedRepository(userId);

    return {
      year,
      commitCount,
      monthlyContributionHistories,
      latestCommittedRepository: latestCommittedRepository ?? null,
      recentMonthRange: this.recentMonthRange,
    };
  }

  public async getMonthlyContributionHistories(
    userId: string,
    monthRangeDateDtos: YearAndMonthDateDto[],
  ): Promise<MonthlyContributionHistory[]> {
    return Promise.all(
      monthRangeDateDtos.map(async (dateDto) => {
        const {
          user: {
            contributionsCollection: {
              contributionCalendar: { totalContributions: contributionCount },
            },
          },
        } = await this.githubClientService.getContributionCount(
          userId,
          dateDto,
        );
        return {
          contributionCount,
          date: dateDto,
        };
      }),
    );
  }

  private static getLanguageRatesFromRepositories(
    languageSizes: ILanguageInfo[],
  ): LanguageRateDto[] {
    const colorsMap = this.getColorsMap(languageSizes);
    const languagesMap = this.getLanguagesMap(languageSizes);

    const totalSize: number = Array.from(languagesMap.values()).reduce(
      (sum, value) => sum + value,
      0,
    );

    const languageRates: LanguageRateDto[] = [];
    languagesMap.forEach((value, key) => {
      const rate = Number(((value / totalSize) * 100).toFixed(1));
      if (rate === 0) return;
      languageRates.push({
        rate,
        name: key,
        color: colorsMap.get(key),
      });
    });
    return languageRates.sort((a, b) => b.rate - a.rate);
  }

  private static getColorsMap(
    languageSizes: ILanguageInfo[],
  ): Map<string, string> {
    return languageSizes.reduce((colorMap, languageInfo) => {
      if (!colorMap.has(languageInfo.color)) {
        colorMap.set(languageInfo.name, languageInfo.color);
      }
      return colorMap;
    }, new Map<string, string>());
  }

  private static getLanguagesMap(
    languageInfo: ILanguageInfo[],
  ): Map<string, number> {
    return languageInfo.reduce((languageMap, languageInfo) => {
      if (!languageMap.has(languageInfo.name)) {
        languageMap.set(languageInfo.name, languageInfo.size);
      } else {
        const totalSize =
          languageMap.get(languageInfo.name) + languageInfo.size;
        languageMap.set(languageInfo.name, totalSize);
      }
      return languageMap;
    }, new Map<string, number>());
  }
}
