import { Module } from '@nestjs/common'

import { StatsModule } from './students/stats/stats.module'
import { ProgressModule } from './students/progress/progress.module'
import { ParentDashboardModule } from './parents/parent-dashboard.module'


@Module({
    imports: [
        StatsModule,
        ProgressModule,
        ParentDashboardModule
    ],
})
export class DashboardModule { }