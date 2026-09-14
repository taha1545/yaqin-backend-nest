import { Body, Controller, Post } from '@nestjs/common'
import { QuestionService } from './question.service'
import { GenerateQuestionsDto } from './dto/generate-questions.dto'
import { Roles } from '@/common'

@Controller('ai/question')
export class QuestionController {
    //
    constructor(private readonly questionService: QuestionService) { }

    //
    @Post()
    @Roles('MEMBER', 'ADMIN')
    generate(@Body() dto: GenerateQuestionsDto) {
        return this.questionService.generate(dto)
    }
}