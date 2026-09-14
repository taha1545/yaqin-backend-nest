import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import type { CreateQuestionsDto } from './dto'
import { QuestionsRepo } from './questions.repo'

@Injectable()
export class QuestionsService {
    //
    constructor(private readonly repo: QuestionsRepo) { }

    async findAll(lessonId: string) {
        return this.repo.findMany(lessonId)
    }

    async findById(id: string) {
        const question = await this.repo.findById(id);
        if (!question) throw new NotFoundException('Question not found.');
        //
        return question
    }

    async createMany(lessonId: string, dto: CreateQuestionsDto,) {
        if (!dto.questions.length) throw new BadRequestException('At least one question is required.',);
        //
        const lesson = await this.repo.findLesson(lessonId);
        if (!lesson) throw new NotFoundException('Lesson not found.');
        //
        return this.repo.createMany(lessonId, dto.questions)
    }

    async remove(id: string) {
        const question = await this.repo.findById(id)
        if (!question) throw new NotFoundException('Question not found.');
        await this.repo.delete(id)
        //
        return {
            message: 'Question deleted successfully.',
        }
    }
}