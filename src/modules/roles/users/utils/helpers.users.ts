import { ForbiddenException } from '@nestjs/common'
import { UserRole } from 'generated/prisma/client'
import type { Prisma } from 'generated/prisma/client'
import type { ListUsersQueryDto } from '../dto'


export interface Caller {
    id: string
    role: UserRole
}

export const USER_INCLUDE = {
    parent: true,
    teacher: true,
    member: true,
} as const

export function ensureAccess(targetId: string, caller: Caller): void {
    if (caller.role === UserRole.ADMIN) return
    if (caller.id === targetId) return
    //
    throw new ForbiddenException('You do not have permission to access this user.')
}

export function buildWhere(query: ListUsersQueryDto,): Prisma.UserWhereInput {
    //
    const where: Prisma.UserWhereInput = {
        role: {
            not: UserRole.ADMIN,
        },
    }
    //
    if (query.role && query.role !== UserRole.ADMIN) where.role = query.role;
    if (query.isVerified !== undefined) where.isVerified = query.isVerified === 'true';
    if (query.search) {
        where.OR = [
            {
                name: {
                    contains: query.search,
                    mode: 'insensitive',
                },
            },
            {
                email: {
                    contains: query.search,
                    mode: 'insensitive',
                },
            },
        ]
    }
    return where
}

export function buildOrderBy(query: { sortBy?: string, order?: 'asc' | 'desc' }): Prisma.UserOrderByWithRelationInput {
    //
    const allowed = ['createdAt', 'name', 'email'] as const
    const sortBy = (allowed as readonly string[]).includes(query.sortBy ?? '') ? query.sortBy as string : 'createdAt'
    const order = query.order ?? 'desc'
    //
    return {
        [sortBy]: order,
    }
}