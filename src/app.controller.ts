import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Santé de l’API' })
  @ApiOkResponse({ description: 'Message de bienvenue', schema: { type: 'string' } })
  getHello(): string {
    return this.appService.getHello();
  }
}
