import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/core'
import type { Prisma } from 'generated/prisma/client'

import { UNIT_INCLUDE, UNIT_LESSON_SELECT } from './units.utils'

@Injectable()
export class UnitsRepo {
    //
    constructor(private readonly prisma: PrismaService) { }

    findMany(args: Omit<Prisma.UnitFindManyArgs, 'include'>) {
        return this.prisma.unit.findMany({
            ...args,
            include: UNIT_INCLUDE,
        })
    }

    findById(id: string) {
        return this.prisma.unit.findUnique({
            where: { id },
            include: UNIT_INCLUDE,
        })
    }

    findByIdWithLessons(id: string, publishedOnly = true) {
        return this.prisma.unit.findUnique({
            where: { id },
            include: {
                ...UNIT_INCLUDE,
                lessons: {
                    where: publishedOnly ? { status: 'PUBLISHED' } : undefined,
                    orderBy: { order: 'asc' },
                    select: UNIT_LESSON_SELECT,
                },
            },
        })
    }

    create(data: Prisma.UnitCreateInput) {
        return this.prisma.unit.create({
            data,
            include: UNIT_INCLUDE,
        })
    }

    update(where: Prisma.UnitWhereUniqueInput, data: Prisma.UnitUpdateInput) {
        return this.prisma.unit.update({
            where,
            data,
            include: UNIT_INCLUDE,
        })
    }

    delete(where: Prisma.UnitWhereUniqueInput) {
        return this.prisma.unit.delete({
            where,
        })
    }

    count(args?: Prisma.UnitCountArgs) {
        return this.prisma.unit.count(args)
    }
}