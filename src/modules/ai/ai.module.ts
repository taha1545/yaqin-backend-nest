import { Module } from '@nestjs/common'

import { OpenRouterModule } from './openrouter/openrouter.module'
import { ReportModule } from './report/report.module'
import { QuestionModule } from './question/question.module'

@Module({
    imports: [
        OpenRouterModule,
        ReportModule,
        QuestionModule,
    ],
})
export class AiModule { }