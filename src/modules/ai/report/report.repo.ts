import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/core'
import type { StudentReport } from './utils/report.types'
import type { Prisma } from 'generated/prisma/client'

@Injectable()
export class ReportRepo {
    //
    constructor(private readonly prisma: PrismaService) { }

    async findStudent(code: string) {
        return this.prisma.student.findUnique({
            where: { code },
            select: {
                code: true,
                fullName: true,
                xp: true,
                semester: true,
                grade: {
                    select: {
                        code: true,
                        name: true,
                    },
                },
            },
        })
    }

    async findLatestReport(studentCode: string) {
        return this.prisma.studentReport.findFirst({
            where: { studentCode },
            orderBy: {
                createdAt: 'desc',
            }
        })
    }

    async findReports(studentCode: string, skip: number, take: number) {
        const [items, total] = await this.prisma.$transaction([
            this.prisma.studentReport.findMany({
                where: { studentCode },
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take,
            }),
            this.prisma.studentReport.count({ where: { studentCode } }),
        ])
        return { items, total }
    }

    async findActivity(studentCode: string, coveredUntil: Date | null, take = 20) {
        return this.prisma.studentProgress.findMany({
            where: {
                studentCode,
                ...(coveredUntil ? { updatedAt: { gt: coveredUntil } } : {}),
            },
            orderBy: { updatedAt: 'asc' },
            take,
            select: {
                progress: true,
                status: true,
                completedAt: true,
                updatedAt: true,
                lesson: {
                    select: {
                        id: true,
                        title: true,
                        difficulty: true,
                        xp: true,
                        unit: {
                            select: {
                                id: true,
                                title: true,
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
                },
                attempt: {
                    select: {
                        status: true,
                        completedAt: true,
                        answers: {
                            select: {
                                answer: true,
                                isCorrect: true,
                                question: {
                                    select: {
                                        question: true,
                                        type: true,
                                        correctAnswer: true,
                                    },
                                },
                                option: {
                                    select: {
                                        text: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        })
    }

    async createReport(studentCode: string, report: StudentReport, coveredUntil: Date | null) {
        return this.prisma.studentReport.create({
            data: {
                studentCode,
                report: this.toJson(report),
                coveredUntil,
            },
        })
    }

    private toJson<T>(value: T): Prisma.InputJsonValue {
        return value as Prisma.InputJsonValue
    }

}