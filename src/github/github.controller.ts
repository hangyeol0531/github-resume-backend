import { Controller, Get, Param, UsePipes } from '@nestjs/common';
import { GithubService } from './github.service';
import { GithubUserValidationPipe } from './github.user.validation.pipe';

@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get('/user/:userId')
  @UsePipes(GithubUserValidationPipe)
  async getInformation(@Param('userId') userId) {
    return this.githubService.getInformation(userId);
  }
}
