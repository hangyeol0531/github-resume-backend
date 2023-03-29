import { Controller, Get, Param } from '@nestjs/common';
import { GithubService } from './github.service';

@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get(':id/:repositoryName')
  async getInformation(
    @Param('id') id,
    @Param('repositoryName') repositoryName,
  ) {
    const data = await this.githubService.getLanguages(id, repositoryName);
    return data;
  }
}
