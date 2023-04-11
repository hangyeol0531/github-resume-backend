import { Controller, Get, Param, UsePipes } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { GithubService } from './github.service';
import { GithubUserValidationPipe } from './github.user.validation.pipe';
import { UserGithubInformationDto } from './dto/user-github-information.dto';

@ApiTags('github')
@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get('/user/:userId')
  @UsePipes(GithubUserValidationPipe)
  @ApiOperation({ summary: 'get User Github Information' })
  @ApiOkResponse({
    type: UserGithubInformationDto,
  })
  @ApiParam({
    name: 'userId',
    type: 'string',
  })
  async getInformation(
    @Param('userId') userId,
  ): Promise<UserGithubInformationDto> {
    return this.githubService.getInformation(userId);
  }
}
