import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { GithubService } from './github.service';
import { GithubUserValidationPipe } from './github.user.validation.pipe';
import { UserGithubInformationDto } from './dto/user-github-information.dto';
import { HttpCacheInterceptor } from '../interceptors/http-cache.interceptor';

@ApiTags('github')
@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get('/user/:userId')
  @UsePipes(GithubUserValidationPipe)
  @UseInterceptors(HttpCacheInterceptor)
  @ApiOperation({ summary: 'get User Github Information' })
  @ApiOkResponse({
    type: UserGithubInformationDto,
  })
  @ApiParam({
    name: 'userId',
    type: 'string',
  })
  async getUserInformation(
    @Param('userId') userId,
  ): Promise<UserGithubInformationDto> {
    return this.githubService.getUserInformation(userId);
  }
}
