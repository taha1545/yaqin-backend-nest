import { Module } from '@nestjs/common'

import { OpenRouterModule } from './openrouter/openrouter.module'
import { ReportModule } from './report/report.module'

@Module({
    imports: [
        OpenRouterModule,
        ReportModule,
    ],
})
export class AiModule { }