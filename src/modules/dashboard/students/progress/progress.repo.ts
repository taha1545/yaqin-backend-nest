import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/core'

import { LESSON_INCLUDE } from '@/modules/content/lessons/utils/helpers.lessons'

@Injectable()
export class StudentDashboardRepo {
    //
    constructor(private readonly prisma: PrismaService) { }

    findStudent(studentCode: string) {
        return this.prisma.student.findUnique({
            where: { code: studentCode },
            select: {
                code: true,
                gradeCode: true,
                semester: true,
            },
        })
    }

    // load modules progress for student
    findModulesProgress(studentCode: string, gradeCode: string, semester: number) {
        return this.prisma.module.findMany({
            where: {
                units: {
                    some: {
                        gradeCode,
                        semester,
                        lessons: {
                            some: {
                                status: 'PUBLISHED',
                            },
                        },
                    },
                },
            },
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
                                progress: {
                                    where: {
                                        studentCode,
                                    },
                                    select: {
                                        progress: true,
                                        status: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        })
    }

    // load singlemodule progress with units progress and lessons progress
    findModuleProgress(studentCode: string, moduleCode: string, gradeCode: string, semester: number) {
        return this.prisma.module.findFirst({
            where: {
                code: moduleCode,
                units: {
                    some: {
                        gradeCode,
                        semester,
                    },
                },
            },
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
                        description: true,
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
                                description: true,
                                order: true,
                                difficulty: true,
                                xp: true,
                                progress: {
                                    where: {
                                        studentCode,
                                    },
                                    select: {
                                        progress: true,
                                        status: true,
                                        completedAt: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        })
    }

    // load single lesson details with student progress
    findLessonProgress(studentCode: string, lessonId: string) {
        return this.prisma.lesson.findFirst({
            where: {
                id: lessonId,
                status: 'PUBLISHED',
            },
            include: {
                ...LESSON_INCLUDE,
                progress: {
                    where: {
                        studentCode,
                    },
                    select: {
                        progress: true,
                        status: true,
                        completedAt: true,
                    },
                },
            },
        })
    }
}