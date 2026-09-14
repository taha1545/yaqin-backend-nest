import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core';
import type { Prisma } from 'generated/prisma/client';
import { LESSON_INCLUDE, LESSON_LIST_SELECT } from './utils/helpers.lessons';

@Injectable()
export class LessonsRepo {
    //
    constructor(private readonly prisma: PrismaService) { }


    findMany(args: Omit<Prisma.LessonFindManyArgs, 'select' | 'include'>) {
        return this.prisma.lesson.findMany({
            ...args,
            select: LESSON_LIST_SELECT,
        });
    }

    findManyForMember(memberId: string, args: Omit<Prisma.LessonFindManyArgs, 'select' | 'include'>) {
        return this.prisma.lesson.findMany({
            ...args,
            where: {
                ...args.where,
                memberId,
            },
            select: LESSON_LIST_SELECT,
        });
    }

    findById(id: string) {
        return this.prisma.lesson.findUnique({
            where: { id },
            include: LESSON_INCLUDE,
        });
    }

    create(data: Prisma.LessonCreateInput) {
        return this.prisma.lesson.create({
            data,
            include: LESSON_INCLUDE,
        });
    }

    update(where: Prisma.LessonWhereUniqueInput, data: Prisma.LessonUpdateInput) {
        return this.prisma.lesson.update({
            where,
            data,
            include: LESSON_INCLUDE,
        });
    }

    delete(where: Prisma.LessonWhereUniqueInput) {
        return this.prisma.lesson.delete({
            where,
        });
    }

    count(args?: Prisma.LessonCountArgs) {
        return this.prisma.lesson.count(args);
    }
}