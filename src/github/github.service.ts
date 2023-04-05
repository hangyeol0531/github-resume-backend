import { Injectable } from '@nestjs/common';
import { GithubClientService } from '../github-client/github-client-service';
import { UserGithubInformationDto } from './dto/user-github-information.dto';
import {
  IPinnedRepository,
  ILanguageRate,
  ILanguageSize,
  IProject,
} from '../github-client/types';

@Injectable()
export class GithubService {
  constructor(private readonly githubApiService: GithubClientService) {}

  async getInformation(userId: string): Promise<Object> {
    const {
      user: {
        repositories: { nodes: repositoryLanguages },
      },
    } = await this.githubApiService.getRepositoriesAndLanguages(userId);

    const {
      user: { pinnedItems },
    }: IPinnedRepository = await this.githubApiService.getPinnedRepositories(
      userId,
    );

    const project: IProject[] = pinnedItems.edges.map(
      ({ node: pinnedItem }) => ({
        name: pinnedItem.name,
        description: pinnedItem.description,
        url: pinnedItem.url,
        language: pinnedItem?.primaryLanguage?.name,
        starCount: pinnedItem.stargazerCount,
        owner: pinnedItem.owner.login,
      }),
    );

    const languageSizes: ILanguageSize[] = [];
    repositoryLanguages.forEach((repositoryLanguage) => {
      repositoryLanguage.languages.edges.forEach((language) => {
        languageSizes.push({
          name: language.node.name,
          size: language.size,
        });
      });
    });

    const languageRates: ILanguageRate[] =
      this.getLanguageRatesFromRepositories(languageSizes);

    return {
      user: null,
      commitCount: null,
      project,
      language: languageRates,
    };
  }

  private getLanguageRatesFromRepositories(
    languageSizes: ILanguageSize[],
  ): ILanguageRate[] {
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

    const languageRates: ILanguageRate[] = [];
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
