import { Module } from '@nestjs/common'
import { StatsController } from './stats.controller'
import { StatsService } from './stats.service'
import { StatsRepo } from './stats.repo'

@Module({
    controllers: [StatsController],
    providers: [
        StatsService,
        StatsRepo,
    ],
    exports: [StatsService],
})
export class StatsModule { }