import type { Prisma, UserRole } from 'generated/prisma/client';

export interface Caller {
    id: string;
    role: UserRole;
}

export interface StudentCaller {
    code: string;
}

export const LESSON_LIST_SELECT = {
    id: true,
    title: true,
    description: true,
    difficulty: true,
    xp: true,
    status: true,
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
} as const satisfies Prisma.LessonSelect;

export const LESSON_INCLUDE = {
    unit: {
        include: {
            grade: true,
            module: true,
        },
    },
    member: {
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                },
            },
        },
    },
    resources: true,
    comments: {
        orderBy: { createdAt: 'asc' },
        include: {
            student: {
                select: {
                    code: true,
                    fullName: true,
                    imagePath: true,
                },
            },
        },
    },
    skills: {
        include: {
            skill: true,
        },
    },
} as const satisfies Prisma.LessonInclude