import { Controller, Get, Param } from '@nestjs/common';
import { GithubService } from './github.service';

@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get('/user/:userId')
  async getInformation(@Param('userId') userId) {
    return this.githubService.getInformation(userId);
  }
}
