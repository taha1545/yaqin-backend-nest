import type { Prisma } from 'generated/prisma/client'

export const COMMENT_SELECT = {
    id: true,
    content: true,
    createdAt: true,
    updatedAt: true,
    student: {
        select: {
            code: true,
            fullName: true,
            imagePath: true,
        },
    },
} as const satisfies Prisma.CommentSelect