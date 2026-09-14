// utils/helpers.badges.ts

import type { Prisma } from 'generated/prisma/client'

export const BADGE_LIST_SELECT = {
    id: true,
    name: true,
    description: true,
    imagePath: true,
    xpReward: true,
    createdAt: true,
    updatedAt: true,
    _count: {
        select: {
            students: true,
        },
    },
} as const satisfies Prisma.BadgeSelect

export const BADGE_INCLUDE = {
    students: {
        orderBy: {
            earnedAt: 'desc',
        },
        select: {
            studentCode: true,
            earnedAt: true,
            student: {
                select: {
                    code: true,
                    fullName: true,
                    gradeCode: true,
                    imagePath: true,
                },
            },
        },
    },
} as const satisfies Prisma.BadgeInclude