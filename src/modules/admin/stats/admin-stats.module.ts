import { Module } from '@nestjs/common'

import { AdminStatsController } from './admin-stats.controller'
import { AdminStatsService } from './admin-stats.service'
import { AdminStatsRepo } from './admin-stats.repo'

@Module({
    controllers: [
        AdminStatsController,
    ],
    providers: [
        AdminStatsService,
        AdminStatsRepo,
    ],
})
export class AdminStatsModule { }