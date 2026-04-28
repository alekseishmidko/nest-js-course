import { Controller, Get, Param, Version } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Version('2')
  @Get('/artists/:id')
  async getArtist(@Param('id') id: string) {
    return this.appService.getArtist(id);
  }

  @Get('/albums/:id')
  async getAlbum(@Param('id') id: string) {
    return this.appService.getAlbum(id);
  }
}
