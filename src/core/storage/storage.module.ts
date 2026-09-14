import { Global, Module } from '@nestjs/common';
import { StorageFilter } from './storage.filter';
import { StorageService } from './storage.service';

@Global()
@Module({
  providers: [StorageFilter, StorageService],
  exports: [StorageFilter, StorageService],
})
export class StorageModule {}
