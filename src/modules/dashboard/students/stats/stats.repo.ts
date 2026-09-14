import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/core'

@Injectable()
export class StatsRepo {
    //
    constructor(private readonly prisma: PrismaService) { }

    findStudentProfile(studentCode: string) {
        return this.prisma.student.findUnique({
            where: { code: studentCode },
            include: {
                grade: true,
                badges: {
                    orderBy: { earnedAt: 'desc' },
                    include: { badge: true },
                },
                skills: {
                    include: { skill: true },
                },
                progress: {
                    orderBy: { updatedAt: 'desc' },
                    take: 10,
                    include: {
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
                            },
                        },
                    },
                },
                reports: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                    take: 5,
                },
            },
        })
    }

    findXpTransactions(studentCode: string, startDate: Date, endDate: Date) {
        return this.prisma.xpTransaction.findMany({
            where: {
                studentCode,
                createdAt: {
                    gte: startDate,
                    lt: endDate,
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        })
    }

    countSkills(studentCode: string, startDate?: Date, endDate?: Date) {
        return this.prisma.studentSkill.count({
            where: {
                studentCode,
                ...(startDate && endDate && {
                    createdAt: {
                        gte: startDate,
                        lt: endDate,
                    },
                }),
            },
        })
    }

    countBadges(studentCode: string, startDate?: Date, endDate?: Date) {
        return this.prisma.studentBadge.count({
            where: {
                studentCode,
                ...(startDate && endDate && {
                    earnedAt: {
                        gte: startDate,
                        lt: endDate,
                    },
                }),
            },
        })
    }

    sumXp(studentCode: string, startDate: Date, endDate: Date) {
        return this.prisma.xpTransaction.aggregate({
            where: {
                studentCode,
                createdAt: {
                    gte: startDate,
                    lt: endDate,
                },
            },
            _sum: {
                amount: true,
            },
        })
    }

    findStudentStats(studentCode: string) {
        return this.prisma.student.findUnique({
            where: { code: studentCode },
            select: {
                code: true,
                gradeCode: true,
                semester: true,
                xp: true,
            },
        })
    }

    countSemesterLessons(gradeCode: string, semester: number) {
        return this.prisma.lesson.count({
            where: {
                status: 'PUBLISHED',
                unit: {
                    gradeCode,
                    semester,
                },
            },
        })
    }

    countCompletedSemesterLessons(studentCode: string, gradeCode: string, semester: number) {
        return this.prisma.studentProgress.count({
            where: {
                studentCode,
                status: 'COMPLETED',
                lesson: {
                    status: 'PUBLISHED',
                    unit: {
                        gradeCode,
                        semester,
                    },
                },
            },
        })
    }
}