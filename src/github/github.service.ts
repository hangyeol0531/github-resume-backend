import { Injectable } from '@nestjs/common';
import { GithubClientService } from '../github-client/github-client-service';
import {
  LanguageRateDto,
  RepositoryDto,
  UserDto,
  UserGithubInformationDto,
} from './dto/user-github-information.dto';
import { IPinnedRepository, ILanguageSize } from '../github-client/types';

@Injectable()
export class GithubService {
  constructor(private readonly githubApiService: GithubClientService) {}

  async getInformation(userId: string): Promise<UserGithubInformationDto> {
    const user: UserDto = await this.getUser(userId);

    const [repositories, languages]: [
      repositories: RepositoryDto[],
      languages: LanguageRateDto[],
    ] = await Promise.all([
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
    const { user } = await this.githubApiService.getUserInformation(userId);
    return {
      name: user.name,
      introduce: user.bio,
      imageUrl: user.avatarUrl,
      contact: {
        email: user.email,
        websiteUrl: user.websiteUrl,
      },
    };
  }

  private async getPinnedRepositories(
    userId: string,
  ): Promise<RepositoryDto[]> {
    const {
      user: { pinnedItems },
    }: IPinnedRepository = await this.githubApiService.getPinnedRepositories(
      userId,
    );

    return pinnedItems.edges.map(({ node: pinnedItem }) => ({
      name: pinnedItem.name,
      description: pinnedItem.description,
      url: pinnedItem.url,
      language: pinnedItem?.primaryLanguage?.name,
      starCount: pinnedItem.stargazerCount,
      owner: pinnedItem.owner.login,
    }));
  }

  private async getLanguageRates(userId: string) {
    const {
      user: {
        repositories: { nodes: repositoryLanguages },
      },
    } = await this.githubApiService.getRepositoriesAndLanguages(userId);

    const languageSizes: ILanguageSize[] = [];
    repositoryLanguages.forEach((repositoryLanguage) => {
      repositoryLanguage.languages.edges.forEach((language) => {
        languageSizes.push({
          name: language.node.name,
          size: language.size,
        });
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
      });
    });
    return languageRates;
  }
}
