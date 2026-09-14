import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/core'
import { CreateQuestionDto } from './dto'

@Injectable()
export class QuestionsRepo {
    constructor(private readonly prisma: PrismaService) { }

    findMany(lessonId: string) {
        return this.prisma.question.findMany({
            where: { lessonId },
            include: {
                options: {
                    orderBy: { order: 'asc' },
                },
            },
            orderBy: { order: 'asc' },
        })
    }

    findById(id: string) {
        return this.prisma.question.findUnique({
            where: { id },
            include: {
                options: {
                    orderBy: { order: 'asc' },
                },
            },
        })
    }

    async createMany(lessonId: string, questions: CreateQuestionDto[]) {
        return this.prisma.$transaction(
            questions.map(question =>
                this.prisma.question.create({
                    data: {
                        lesson: { connect: { id: lessonId } },
                        type: question.type,
                        question: question.question,
                        explanation: question.explanation,
                        correctAnswer: question.correctAnswer,
                        order: question.order,
                        options: {
                            create: question.options?.map(option => ({
                                text: option.text,
                                order: option.order,
                                isCorrect: option.isCorrect ?? false,
                            })),
                        },
                    },
                    include: {
                        options: { orderBy: { order: 'asc' } },
                    },
                }),
            ),
        )
    }

    delete(id: string) {
        return this.prisma.question.delete({
            where: { id },
        })
    }

    deleteOptions(questionId: string) {
        return this.prisma.questionOption.deleteMany({
            where: { questionId },
        })
    }

    findLesson(lessonId: string) {
        return this.prisma.lesson.findUnique({
            where: { id: lessonId },
            select: { id: true },
        })
    }
}