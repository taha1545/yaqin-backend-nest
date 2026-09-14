import type { Prisma } from 'generated/prisma/client'
import type { ListSkillsQueryDto } from './dto'


export const SKILL_LESSON_SELECT = {
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
} as const satisfies Prisma.LessonSelect


export const SKILL_INCLUDE = {
    _count: {
        select: {
            lessons: true,
            students: true,
        },
    },
} as const satisfies Prisma.SkillInclude


export function buildWhere(query: ListSkillsQueryDto): Prisma.SkillWhereInput {
    const where: Prisma.SkillWhereInput = {}
    //
    if (query.search) where.name = { contains: query.search, mode: 'insensitive' };
    if (query.target) where.target = { contains: query.target, mode: 'insensitive' };
    if (query.status) where.status = query.status;
    //
    return where
}


export function buildOrderBy(query: { sortBy?: string, order?: 'asc' | 'desc' }): Prisma.SkillOrderByWithRelationInput {
    const allowed = ['createdAt', 'updatedAt', 'name'] as const;
    //
    const sortBy = allowed.includes(
        query.sortBy as (typeof allowed)[number],
    )
        ? query.sortBy as (typeof allowed)[number]
        : 'createdAt'
    //
    const order = query.order ?? 'desc';
    return { [sortBy]: order };
}