import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/health')
  @ApiOperation({ summary: 'healthCheck' })
  async healthCheck() {
    return true;
  }
}
