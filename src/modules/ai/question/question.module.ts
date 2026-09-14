import { Module } from '@nestjs/common'
import { QuestionController } from './question.controller'
import { QuestionService } from './question.service'
import { QuestionRepo } from './question.repo'
import { OpenRouterModule } from '../openrouter/openrouter.module'

@Module({
    imports: [OpenRouterModule],
    controllers: [QuestionController],
    providers: [
        QuestionService,
        QuestionRepo,
    ],
})
export class QuestionModule { }