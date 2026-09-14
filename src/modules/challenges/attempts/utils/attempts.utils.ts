import type { Prisma } from 'generated/prisma/client'

import type { ListAttemptsQueryDto } from '../dto'

export function buildWhere(studentCode: string, query: ListAttemptsQueryDto): Prisma.QuizAttemptWhereInput {
    const where: Prisma.QuizAttemptWhereInput = { studentCode }

    if (query.lessonId) { where.lessonId = query.lessonId }

    return where
}

export function buildOrderBy(): Prisma.QuizAttemptOrderByWithRelationInput {
    return {
        createdAt: 'desc',
    }
}