import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/core'

@Injectable()
export class QuestionRepo {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async findLesson(id: string) {
        return this.prisma.lesson.findUnique({
            where: { id },
            select: {
                id: true,
                title: true,
                description: true,
                content: true,
                difficulty: true,
                unit: {
                    select: {
                        id: true,
                        title: true,
                        grade: {
                            select: {
                                code: true,
                                name: true,
                            },
                        },
                        module: {
                            select: {
                                code: true,
                                name: true,
                            },
                        },
                    },
                },
                skills: {
                    select: {
                        skill: {
                            select: {
                                name: true,
                                description: true,
                                target: true,
                            },
                        },
                    },
                },
            },
        })
    }
}