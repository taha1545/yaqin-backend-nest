import { Module } from '@nestjs/common';

import { StorageApiController } from './storage.controller';
import { StorageApiService } from './storage.service';

@Module({
  controllers: [StorageApiController],
  providers: [StorageApiService],
  exports: [StorageApiService],
})
export class StorageApiModule {}
