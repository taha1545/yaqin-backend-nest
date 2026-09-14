import { Module } from '@nestjs/common'
import { QuestionsController } from './questions.controller'
import { QuestionsService } from './questoins.service'
import { QuestionsRepo } from './questions.repo'

@Module({
    controllers: [QuestionsController],
    providers: [
        QuestionsService,
        QuestionsRepo,
    ],
    exports: [
        QuestionsService,
    ],
})
export class QuestionsModule { }