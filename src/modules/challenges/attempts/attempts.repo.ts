import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/core'
import type { Prisma } from 'generated/prisma/client'

import { ProgressStatus } from 'generated/prisma/enums'
import { ATTEMPT_INCLUDE, ATTEMPT_LIST_SELECT } from './utils/helpers.attempts'

@Injectable()
export class AttemptsRepo {
    //
    constructor(private readonly prisma: PrismaService) { }


    // Student attempts history
    findMany(args: Omit<Prisma.QuizAttemptFindManyArgs, 'select' | 'include'>) {
        return this.prisma.quizAttempt.findMany({
            ...args,
            select: ATTEMPT_LIST_SELECT,
        })
    }

    // Full attempt with answers/questions/options/progress
    findById(id: string) {
        return this.prisma.quizAttempt.findUnique({
            where: { id },
            include: ATTEMPT_INCLUDE,
        })
    }

    // Check whether student already has an attempt for this lesson
    findByStudentAndLesson(studentCode: string, lessonId: string) {
        return this.prisma.quizAttempt.findUnique({
            where: {
                studentCode_lessonId: {
                    studentCode,
                    lessonId,
                },
            },
            include: {
                progress: true,
            },
        })
    }

    // Load lesson + questions + options when starting an attempt
    findLesson(lessonId: string) {
        return this.prisma.lesson.findUnique({
            where: { id: lessonId },
            select: {
                id: true,
                status: true,
                xp: true,
                minPresent: true,
                questions: {
                    orderBy: { order: 'asc' },
                    select: {
                        id: true,
                        type: true,
                        question: true,
                        order: true,
                        options: {
                            orderBy: { order: 'asc' },
                            select: {
                                id: true,
                                text: true,
                                order: true,
                            },
                        },
                    },
                },
            },
        })
    }

    findLessonForGrading(lessonId: string) {
        return this.prisma.lesson.findUnique({
            where: { id: lessonId },
            select: {
                id: true,
                minPresent: true,
                xp: true,
                questions: {
                    orderBy: { order: 'asc' },
                    select: {
                        id: true,
                        type: true,
                        correctAnswer: true,
                        options: {
                            select: {
                                id: true,
                                isCorrect: true,
                            },
                        },
                    },
                },
            },
        })
    }

    create(data: Prisma.QuizAttemptCreateInput) {
        return this.prisma.quizAttempt.create({
            data,
            include: ATTEMPT_INCLUDE,
        })
    }

    update(where: Prisma.QuizAttemptWhereUniqueInput, data: Prisma.QuizAttemptUpdateInput) {
        return this.prisma.quizAttempt.update({
            where,
            data,
            include: ATTEMPT_INCLUDE,
        })
    }

    count(args?: Prisma.QuizAttemptCountArgs) {
        return this.prisma.quizAttempt.count(args)
    }

    // Complete attempt + answers + progress + XP
    async submit(
        data: {
            attemptId: string
            studentCode: string
            answers: Prisma.QuizAnswerCreateManyInput[]
            progress: {
                lessonId: string
                status: ProgressStatus
                progress: number
                completedAt: Date | null
            }
            xpEarned: number
        }) {
        return this.prisma.$transaction(async tx => {
            // Save all answers +  Complete attempt
            await tx.quizAnswer.createMany({ data: data.answers });
            await tx.quizAttempt.update({
                where: { id: data.attemptId },
                data: {
                    status: 'COMPLETED',
                    completedAt: new Date(),
                },
            });
            // Save lesson progress
            await tx.studentProgress.create({
                data: {
                    studentCode: data.studentCode,
                    lessonId: data.progress.lessonId,
                    attemptId: data.attemptId,
                    status: data.progress.status,
                    progress: data.progress.progress,
                    completedAt: data.progress.completedAt,
                },
            })
            // XP
            if (data.xpEarned > 0) {
                await tx.student.update({
                    where: { code: data.studentCode },
                    data: {
                        xp: { increment: data.xpEarned },
                    },
                });
                await tx.xpTransaction.create({
                    data: {
                        studentCode: data.studentCode,
                        amount: data.xpEarned,
                        source: 'QUIZ',
                        referenceId: data.attemptId,
                    },
                })
            };
            //
            return {
                status: data.progress.status,
                progress: data.progress.progress,
                xpEarned: data.xpEarned,
            }
        })
    }


}