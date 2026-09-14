import type { Prisma, UserRole } from 'generated/prisma/client'
import type { ListStudentsQueryDto } from '../dto'

export interface Caller {
    id: string
    role: UserRole
}

export interface StudentCaller {
    code: string
}

export function generateStudentCode(): string {
    return crypto.randomUUID()
        .replaceAll('-', '')
        .slice(0, 10)
        .toUpperCase()
}

export const STUDENT_INCLUDE = {
    grade: true,
    parent: {
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                },
            },
        },
    },
} as const satisfies Prisma.StudentInclude


export function buildWhere(query: ListStudentsQueryDto): Prisma.StudentWhereInput {
    const where: Prisma.StudentWhereInput = {}
    //
    if (query.parentId) where.parentId = query.parentId
    if (query.gradeCode) where.gradeCode = query.gradeCode
    if (query.wilaya) where.wilaya = query.wilaya
    if (query.semester !== undefined) {
        where.semester = query.semester
    }
    if (query.search) {
        where.fullName = {
            contains: query.search,
            mode: 'insensitive',
        }
    }
    return where
}

export function buildRankingWhere(query: ListStudentsQueryDto): Prisma.StudentWhereInput {
    const where: Prisma.StudentWhereInput = {}
    //
    if (query.gradeCode) where.gradeCode = query.gradeCode
    if (query.wilaya) where.wilaya = query.wilaya
    if (query.semester !== undefined) {
        where.semester = query.semester
    }
    return where
}


export function buildOrderBy(query: { sortBy?: string, order?: 'asc' | 'desc' }): Prisma.StudentOrderByWithRelationInput {
    const allowed = ['createdAt', 'fullName', 'xp'] as const
    const sortBy = allowed.includes(
        query.sortBy as (typeof allowed)[number],
    )
        ? query.sortBy as (typeof allowed)[number]
        : 'createdAt'
    //
    const order = query.order ?? 'desc'
    return { [sortBy]: order }
}




