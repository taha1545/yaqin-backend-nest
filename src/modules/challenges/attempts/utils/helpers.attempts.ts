import type { Prisma } from 'generated/prisma/client'

export const ATTEMPT_LIST_SELECT = {
    id: true,
    studentCode: true,
    lessonId: true,
    status: true,
    completedAt: true,
    createdAt: true,
    updatedAt: true,
    lesson: {
        select: {
            id: true,
            title: true,
            order: true,
            unit: {
                select: {
                    id: true,
                    title: true,
                    gradeCode: true,
                    moduleCode: true,
                    semester: true,
                },
            },
        },
    },
} as const satisfies Prisma.QuizAttemptSelect;

export const ATTEMPT_INCLUDE = {
    lesson: {
        select: {
            id: true,
            title: true,
            description: true,
            difficulty: true,
            xp: true,
            minPresent: true,
            order: true,
            unit: {
                select: {
                    id: true,
                    title: true,
                    gradeCode: true,
                    moduleCode: true,
                    semester: true,
                },
            },
        },
    },
    answers: {
        orderBy: {
            question: {
                order: 'asc',
            },
        },
        include: {
            question: {
                select: {
                    id: true,
                    type: true,
                    question: true,
                    explanation: true,
                    correctAnswer: true,
                    order: true,
                    options: {
                        orderBy: {
                            order: 'asc',
                        },
                        select: {
                            id: true,
                            text: true,
                            isCorrect: true,
                            order: true,
                        },
                    },
                },
            },
            option: {
                select: {
                    id: true,
                    text: true,
                    order: true,
                },
            },
        },
    },
    progress: true,
} as const satisfies Prisma.QuizAttemptInclude