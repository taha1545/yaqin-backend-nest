import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/core'

@Injectable()
export class ParentDashboardRepo {
    //
    constructor(private readonly prisma: PrismaService) { }


    findParentByUserId(userId: string) {
        return this.prisma.parent.findUnique({
            where: { userId, },
            select: { id: true },
        })
    }

    async findDashboard(parentId: string, startDate: Date, endDate: Date) {
        return this.prisma.$transaction(async tx => {
            // get students for parent
            const students = await tx.student.findMany({
                where: { parentId },
                orderBy: { createdAt: 'asc' },
                select: {
                    code: true,
                    fullName: true,
                    gradeCode: true,
                    semester: true,
                    xp: true,
                    imagePath: true,
                    schoolName: true,
                    wilaya: true,
                },
            })
            if (!students.length) return { students: [], curriculum: [], progress: [], xpTransactions: [] };
            // comination of gradecode ,semster to get all lesons,units for students
            const combinations = Array.from(new Map(
                students.map(student => [
                    `${student.gradeCode}:${student.semester}`,
                    {
                        gradeCode: student.gradeCode,
                        semester: student.semester,
                    },
                ]),
            ).values(),
            );
            // load all lessons units module for students 
            const curriculum = await Promise.all(
                combinations.map(({ gradeCode, semester }) =>
                    tx.module.findMany({
                        where: {
                            units: {
                                some: {
                                    gradeCode,
                                    semester,
                                    lessons: {
                                        some: { status: 'PUBLISHED' },
                                    },
                                },
                            },
                        },
                        orderBy: { code: 'asc' },
                        select: {
                            code: true,
                            name: true,
                            units: {
                                where: {
                                    gradeCode,
                                    semester,
                                },
                                orderBy: {
                                    order: 'asc',
                                },
                                select: {
                                    id: true,
                                    title: true,
                                    order: true,
                                    lessons: {
                                        where: {
                                            status: 'PUBLISHED',
                                        },
                                        orderBy: {
                                            order: 'asc',
                                        },
                                        select: {
                                            id: true,
                                            title: true,
                                            order: true,
                                        },
                                    },
                                },
                            },
                        },
                    }).then(modules => ({
                        gradeCode,
                        semester,
                        modules,
                    })),
                ),
            )
            // load progress of students in thiere semster 
            const progress = await tx.studentProgress.findMany({
                where: {
                    studentCode: {
                        in: students.map(student => student.code),
                    },
                    lesson: {
                        status: 'PUBLISHED',
                        unit: {
                            OR: combinations.map(({ gradeCode, semester }) => ({
                                gradeCode,
                                semester,
                            })),
                        },
                    },
                },
                orderBy: {
                    updatedAt: 'desc',
                },
                select: {
                    studentCode: true,
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
                                    gradeCode: true,
                                    semester: true,
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
            })
            // load xp of student last month
            const xpTransactions = await tx.xpTransaction.findMany({
                where: {
                    studentCode: {
                        in: students.map(student => student.code),
                    },
                    createdAt: {
                        gte: startDate,
                        lt: endDate,
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
                select: {
                    id: true,
                    studentCode: true,
                    amount: true,
                    source: true,
                    referenceId: true,
                    createdAt: true,
                },
            })
            //
            return {
                students,
                curriculum,
                progress,
                xpTransactions,
            }
        })
    }
}