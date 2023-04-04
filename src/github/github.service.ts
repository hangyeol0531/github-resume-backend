import { Injectable } from '@nestjs/common';
import { GithubClientService } from '../github-client/github-client-service';
import { UserGithubInformationDto } from './dto/user-github-information.dto';

@Injectable()
export class GithubService {
  constructor(private readonly githubApiService: GithubClientService) {}

  async getInformation(userId: string): Promise<UserGithubInformationDto> {
    const {
      user: { repositories },
    } = await this.githubApiService.getRepositoriesAndLanguages(userId);

    const pinnedRepository = await this.githubApiService.getPinnedRepositories(
      userId,
    );
    console.log(pinnedRepository);

    return null;
  }
}
