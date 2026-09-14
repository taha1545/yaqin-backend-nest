import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { ReportController } from './report.controller'
import { ReportService } from './report.service'
import { ReportRepo } from './report.repo'
import { OpenRouterService } from '../openrouter/openrouter.service'

@Module({
    imports: [
        HttpModule,
    ],
    controllers: [
        ReportController,
    ],
    providers: [
        ReportService,
        ReportRepo,
        OpenRouterService,
    ],
})
export class ReportModule { }