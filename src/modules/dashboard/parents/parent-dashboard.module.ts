import { Module } from '@nestjs/common'
import { ParentDashboardController } from './parent-dashboard.controller'
import { ParentDashboardService } from './parent-dashboard.service'
import { ParentDashboardRepo } from './parent-dashboard.repo'

@Module({
    controllers: [
        ParentDashboardController,
    ],
    providers: [
        ParentDashboardService,
        ParentDashboardRepo,
    ],
    exports: [
        ParentDashboardService,
    ],
})
export class ParentDashboardModule { }