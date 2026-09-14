import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { GenerateSignedUrlDto } from './dto';
import { StorageApiService } from './storage.service';
import { Public } from '@/common/decorators'

@Controller('storage')
export class StorageApiController {
  //
  constructor(private readonly storageApiService: StorageApiService) { }

  @Public()
  @Post('signed-url')
  @HttpCode(HttpStatus.OK)
  async signedUrl(@Body() dto: GenerateSignedUrlDto) {
    return this.storageApiService.generateSignedUrl(dto.key, dto.downloadName);
  }

}
