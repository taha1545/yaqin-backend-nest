import { Module } from '@nestjs/common'

import { StorageApiModule } from '@/modules/storage'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
  imports: [StorageApiModule],
})
export class UsersModule {}