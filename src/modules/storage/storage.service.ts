import { Injectable, NotFoundException } from '@nestjs/common';
import type { Response } from 'express';
import { StorageFilter, StorageService } from '@/core/storage';

@Injectable()
export class StorageApiService {
  //
  constructor(private readonly storage: StorageService, private readonly filter: StorageFilter,) { }

  async generateSignedUrl(key: string, downloadName?: string) {
    const url = await this.storage.getSignedUrl(key, { downloadName });
    return { key, url };
  }

  async getImage(key: string, response: Response) {
    if (!key) throw new NotFoundException('KEY IS REQUIRED');
    //
    const image = await this.storage.getObject(key);
    //
    response.setHeader('Content-Type', image.contentType);
    response.setHeader('Content-Length', image.body.length);
    response.end(image.body);
  }
}
