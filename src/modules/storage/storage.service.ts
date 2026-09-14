import { Injectable } from '@nestjs/common';

import { StorageFilter, StorageService } from '@/core/storage';

@Injectable()
export class StorageApiService {
  //
  constructor(private readonly storage: StorageService, private readonly filter: StorageFilter,) { }

  async generateSignedUrl(key: string, downloadName?: string) {
    const url = await this.storage.getSignedUrl(key, { downloadName });
    return { key, url };
  }

}
