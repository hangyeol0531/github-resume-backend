import { Injectable } from '@nestjs/common';
import { GithubClientService } from '../github-client/github-client-service';
import { UserGithubInformationDto } from './dto/user-github-information.dto';
import {
  IPinnedRepository,
  ILanguageRate,
  ILanguageSize,
} from '../github-client/types';

@Injectable()
export class GithubService {
  constructor(private readonly githubApiService: GithubClientService) {}

  async getInformation(userId: string): Promise<UserGithubInformationDto> {
    const {
      user: {
        repositories: { nodes: repositoryLanguages },
      },
    } = await this.githubApiService.getRepositoriesAndLanguages(userId);

    const pinnedRepository: IPinnedRepository =
      await this.githubApiService.getPinnedRepositories(userId);

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
    return null;
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
      languageRates.push({
        name: key,
        rate: Number(((value / totalSize) * 100).toFixed(2)),
      });
    });
    return languageRates;
  }
}
