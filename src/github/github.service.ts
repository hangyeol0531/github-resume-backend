import { Injectable, NotFoundException } from '@nestjs/common';
import { GithubClientService } from '../github-client/github-client.service';
import {
  LanguageRateDto,
  RepositoryDto,
  UserDto,
  UserGithubInformationDto,
} from './dto/user-github-information.dto';
import { IPinnedRepository, ILanguageSize } from '../github-client/types';

@Injectable()
export class GithubService {
  constructor(private readonly githubClientService: GithubClientService) {}

  async getInformation(userId: string): Promise<UserGithubInformationDto> {
    const existsUser = await this.githubClientService.getExistsUser(userId);
    if (!existsUser) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }
    const [user, repositories, languages]: [
      user: UserDto,
      repositories: RepositoryDto[],
      languages: LanguageRateDto[],
    ] = await Promise.all([
      this.getUser(userId),
      this.getPinnedRepositories(userId),
      this.getLanguageRates(userId),
    ]);

    return {
      user,
      repositories,
      languages,
    };
  }

  private async getUser(userId: string): Promise<UserDto> {
    const { user } = await this.githubClientService.getUserInformation(userId);
    return {
      id: userId,
      name: user.name,
      introduce: user.bio,
      imageUrl: user.avatarUrl,
      contact: {
        email: user.email,
        websiteUrl: user.websiteUrl,
      },
    } as UserDto;
  }

  private async getPinnedRepositories(
    userId: string,
  ): Promise<RepositoryDto[]> {
    const {
      user: { pinnedItems },
    }: IPinnedRepository = await this.githubClientService.getPinnedRepositories(
      userId,
    );

    return pinnedItems.edges.map(
      ({ node: pinnedItem }) =>
        ({
          name: pinnedItem.name,
          description: pinnedItem.description,
          url: pinnedItem.url,
          language: pinnedItem?.primaryLanguage?.name,
          starCount: pinnedItem.stargazerCount,
          owner: pinnedItem.owner.login,
        } as RepositoryDto),
    );
  }

  private async getLanguageRates(userId: string) {
    const {
      user: {
        repositories: { nodes: repositoryLanguages },
      },
    } = await this.githubClientService.getRepositoriesAndLanguages(userId);

    const languageSizes: ILanguageSize[] = [];
    repositoryLanguages.forEach((repositoryLanguage) => {
      repositoryLanguage.languages.edges.forEach((language) => {
        languageSizes.push({
          name: language.node.name,
          size: language.size,
        } as ILanguageSize);
      });
    });

    return GithubService.getLanguageRatesFromRepositories(languageSizes);
  }

  private static getLanguageRatesFromRepositories(
    languageSizes: ILanguageSize[],
  ): LanguageRateDto[] {
    const languagesMap = languageSizes.reduce((languageMap, languageSize) => {
      if (!languageMap.has(languageSize.name)) {
        languageMap.set(languageSize.name, languageSize.size);
      } else {
        const totalSize =
          languageMap.get(languageSize.name) + languageSize.size;
        languageMap.set(languageSize.name, totalSize);
      }
      return languageMap;
    }, new Map());

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
      } as LanguageRateDto);
    });
    return languageRates;
  }
}
