import { Injectable } from '@nestjs/common';
import { GithubClientService } from '../github-client/github-client-service';

@Injectable()
export class GithubService {
  constructor(private readonly githubApiService: GithubClientService) {}

  async getLanguages(id: string, repositoryName: string) {
    const { data } = await this.githubApiService.getLanguages(
      id,
      repositoryName,
    );
    return data;
  }
}
