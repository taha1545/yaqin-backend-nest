import { Injectable, NotFoundException } from '@nestjs/common'
import { QuestionRepo } from './question.repo'
import { buildQuestionPrompt } from './utils/question.utils'
import { OpenRouterService } from '../openrouter/openrouter.service'
import type { GenerateQuestionsDto } from './dto/generate-questions.dto'
import type { QuestionLessonContext } from './utils/question.types'

@Injectable()
export class QuestionService {
    //
    constructor(private readonly repo: QuestionRepo, private readonly openRouter: OpenRouterService) { }

    async generate(dto: GenerateQuestionsDto) {
        //
        const lesson = await this.repo.findLesson(dto.lessonId);
        if (!lesson) throw new NotFoundException('Lesson not found.');
        //
        const context: QuestionLessonContext = {
            id: lesson.id,
            title: lesson.title,
            description: lesson.description,
            content: lesson.content,
            difficulty: lesson.difficulty,
            module: lesson.unit.module,
            unit: {
                id: lesson.unit.id,
                title: lesson.unit.title,
            },
            grade: lesson.unit.grade,
            skills: lesson.skills.map(({ skill }) => ({
                name: skill.name,
                description: skill.description,
                target: skill.target,
            })),
        }
        //
        const prompt = buildQuestionPrompt(
            context,
            dto.count,
            dto.prompt,
        )
        //
        return this.openRouter.generateJson(prompt)
    }
}