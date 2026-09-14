// utils/badges.utils.ts

import type { Prisma } from 'generated/prisma/client'
import type { ListBadgesQueryDto } from '../dto'

export function buildWhere(query: ListBadgesQueryDto): Prisma.BadgeWhereInput {
    const where: Prisma.BadgeWhereInput = {}
    //
    if (query.search) {
        where.name = {
            contains: query.search,
            mode: 'insensitive',
        }
    }
    //
    return where
}

export function buildOrderBy(): Prisma.BadgeOrderByWithRelationInput {
    return {
        createdAt: 'desc',
    }
}