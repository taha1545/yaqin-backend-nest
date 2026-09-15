import { Controller, Get, Post, Body, Query, HttpCode, HttpStatus, Res } from '@nestjs/common';
import type { Response } from 'express';
import { GenerateSignedUrlDto } from './dto';
import { StorageApiService } from './storage.service';
import { Public } from '@/common/decorators';

@Controller('storage')
export class StorageApiController {
  constructor(private readonly storageApiService: StorageApiService) { }

  @Public()
  @Post('signed-url')
  @HttpCode(HttpStatus.OK)
  async signedUrl(@Body() dto: GenerateSignedUrlDto) {
    return this.storageApiService.generateSignedUrl(dto.key, dto.downloadName);
  }

  @Public()
  @Get('image')
  async image(@Query('key') key: string, @Res() response: Response) {
    return this.storageApiService.getImage(key, response);
  }
}