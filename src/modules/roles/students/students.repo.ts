import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/core'
import type { Prisma } from 'generated/prisma/client'
import { STUDENT_INCLUDE } from './utils/helpers.students'


@Injectable()
export class StudentsRepo {
    //
    constructor(private readonly prisma: PrismaService) { }

    findMany(args: Omit<Prisma.StudentFindManyArgs, 'include'>) {
        return this.prisma.student.findMany({ ...args, include: STUDENT_INCLUDE })
    }

    findUnique(where: Prisma.StudentWhereUniqueInput) {
        return this.prisma.student.findUnique({ where, include: STUDENT_INCLUDE })
    }

    findByCode(code: string) {
        return this.findUnique({ code })
    }

    findByParentId(parentId: string) {
        return this.prisma.student.findMany({ where: { parentId }, include: STUDENT_INCLUDE })
    }

    create(data: Prisma.StudentCreateInput) {
        return this.prisma.student.create({ data, include: STUDENT_INCLUDE })
    }

    update(where: Prisma.StudentWhereUniqueInput, data: Prisma.StudentUpdateInput,) {
        return this.prisma.student.update({ where, data, include: STUDENT_INCLUDE })
    }

    delete(where: Prisma.StudentWhereUniqueInput) {
        return this.prisma.student.delete({ where, include: STUDENT_INCLUDE })
    }

    count(args?: Prisma.StudentCountArgs) {
        return this.prisma.student.count(args)
    }
}