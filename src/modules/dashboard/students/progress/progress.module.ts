import { Module } from '@nestjs/common'
import { ProgressController } from './progress.controller'
import { ProgressService } from './progress.service'
import { StudentDashboardRepo } from './progress.repo'

@Module({
    controllers: [ProgressController],
    providers: [
        ProgressService,
        StudentDashboardRepo,
    ],
    exports: [ProgressService],
})
export class ProgressModule { }