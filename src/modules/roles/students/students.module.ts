import { Module } from '@nestjs/common'

import { StorageApiModule } from '@/modules/storage'

import { StudentsController } from './students.controller'
import { StudentsRepo } from './students.repo'
import { StudentsService } from './students.service'

@Module({
  imports: [StorageApiModule],
  controllers: [StudentsController],
  providers: [StudentsService, StudentsRepo],
  exports: [StudentsService],
})
export class StudentsModule { }