import type { Prisma } from 'generated/prisma/client';

import type { ListLessonsQueryDto } from '../dto';

export function buildWhere(query: ListLessonsQueryDto): Prisma.LessonWhereInput {
    const where: Prisma.LessonWhereInput = {};
    //
    if (query.unitId) where.unitId = query.unitId;
    if (query.gradeCode) where.unit = { gradeCode: query.gradeCode };
    if (query.moduleCode) where.unit = { ...(where.unit as Prisma.UnitWhereInput), moduleCode: query.moduleCode };
    if (query.semester !== undefined) where.unit = { ...(where.unit as Prisma.UnitWhereInput), semester: query.semester };
    //
    if (query.search) {
        where.title = {
            contains: query.search,
            mode: 'insensitive',
        };
    }
    if (query.difficulty) where.difficulty = query.difficulty as Prisma.LessonWhereInput['difficulty'];
    //
    if (query.skillId) {
        where.skills = {
            some: {
                skillId: query.skillId,
            },
        };
    }
    return where;
}

export function buildOrderBy(query: { sortBy?: string; order?: 'asc' | 'desc' },): Prisma.LessonOrderByWithRelationInput {
    const allowed = ['createdAt', 'title', 'order', 'xp'] as const
    const sortBy = allowed.includes(
        query.sortBy as (typeof allowed)[number],
    )
        ? query.sortBy as (typeof allowed)[number]
        : 'order'
    //
    const order = query.order ?? 'asc';
    return { [sortBy]: order };
}