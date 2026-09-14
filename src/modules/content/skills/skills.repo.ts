import { Injectable } from '@nestjs/common'

import { PrismaService } from '@/core'
import type { Prisma } from 'generated/prisma/client'
import { SKILL_INCLUDE, SKILL_LESSON_SELECT } from './skills.utils'


@Injectable()
export class SkillsRepo {
    //
    constructor(private readonly prisma: PrismaService) { }


    findMany(args: Omit<Prisma.SkillFindManyArgs, 'include'>) {
        return this.prisma.skill.findMany({
            ...args,
            include: SKILL_INCLUDE,
        })
    }


    findById(id: string) {
        return this.prisma.skill.findUnique({
            where: { id },
            include: SKILL_INCLUDE,
        })
    }


    findByIdWithLessons(id: string) {
        return this.prisma.skill.findUnique({
            where: { id },
            include: {
                ...SKILL_INCLUDE,
                lessons: {
                    orderBy: {
                        lesson: {
                            order: 'asc',
                        },
                    },
                    include: {
                        lesson: {
                            select: SKILL_LESSON_SELECT,
                        },
                    },
                },
            },
        })
    }


    findLessonsByIds(ids: string[]) {
        return this.prisma.lesson.findMany({
            where: {
                id: {
                    in: ids,
                },
            },
            select: { id: true },
        })
    }


    create(data: Prisma.SkillCreateInput) {
        return this.prisma.skill.create({
            data,
            include: SKILL_INCLUDE,
        })
    }


    update(where: Prisma.SkillWhereUniqueInput, data: Prisma.SkillUpdateInput) {
        return this.prisma.skill.update({
            where,
            data,
            include: SKILL_INCLUDE,
        })
    }


    delete(where: Prisma.SkillWhereUniqueInput) {
        return this.prisma.skill.delete({
            where,
        })
    }


    count(args?: Prisma.SkillCountArgs) {
        return this.prisma.skill.count(args)
    }


    addLessons(skillId: string, lessonIds: string[]) {
        return this.prisma.lessonSkill.createMany({
            data: lessonIds.map((lessonId) => ({
                skillId,
                lessonId,
            })),
            skipDuplicates: true,
        })
    }
}