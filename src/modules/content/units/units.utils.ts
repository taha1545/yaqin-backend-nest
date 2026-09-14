import type { Prisma } from 'generated/prisma/client';
import type { ListUnitsQueryDto } from './dto'

export interface Caller {
    id: string
    role: string
}

export const UNIT_LESSON_SELECT = {
    id: true,
    title: true,
    description: true,
    difficulty: true,
    xp: true,
    order: true,
} as const satisfies Prisma.LessonSelect

export const UNIT_INCLUDE = {
    grade: true,
    module: true,
} as const satisfies Prisma.UnitInclude


export function buildWhere(query: ListUnitsQueryDto): Prisma.UnitWhereInput {
    const where: Prisma.UnitWhereInput = {}
    //
    if (query.gradeCode) where.gradeCode = query.gradeCode;
    if (query.moduleCode) where.moduleCode = query.moduleCode;
    if (query.semester !== undefined) where.semester = query.semester;
    if (query.search) where.title = { contains: query.search, mode: 'insensitive' };
    //
    return where
}

export function buildOrderBy(query: { sortBy?: string; order?: 'asc' | 'desc' }): Prisma.UnitOrderByWithRelationInput {
    const allowed = ['createdAt', 'title', 'order'] as const

    const sortBy = allowed.includes(
        query.sortBy as (typeof allowed)[number],
    )
        ? query.sortBy as (typeof allowed)[number]
        : 'order'
    //
    const order = query.order ?? 'asc';
    return { [sortBy]: order };
}