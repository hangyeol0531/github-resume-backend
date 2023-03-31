import { Injectable } from '@nestjs/common';
import { GithubClientService } from '../github-client/github-client-service';
import { UserGithubInformationDto } from './dto/user-github-information.dto';

@Injectable()
export class GithubService {
  constructor(private readonly githubApiService: GithubClientService) {}

  async getInformation(userId: string): Promise<UserGithubInformationDto> {
    const { data: repositories } = await this.githubApiService.getRepositories(
      userId,
    );
    const repositoryNames = repositories.map((repository) => repository.name);

    const languages = (
      await Promise.all(
        repositoryNames.map((repositoryName) =>
          this.githubApiService.getLanguages(userId, repositoryName),
        ),
      )
    ).map(({ data }) => data);

    const pinnedRepository = await this.githubApiService.getPinnedRepositories(
      userId,
    );
    console.log(pinnedRepository);

    return null;
  }
}
