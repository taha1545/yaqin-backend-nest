import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/core'
import type { Prisma } from 'generated/prisma/client'

import { BADGE_INCLUDE, BADGE_LIST_SELECT } from './utils/helpers.badges'

@Injectable()
export class BadgesRepo {
    //
    constructor(private readonly prisma: PrismaService) { }

    findMany(args: Omit<Prisma.BadgeFindManyArgs, 'select' | 'include'>) {
        return this.prisma.badge.findMany({
            ...args,
            select: BADGE_LIST_SELECT,
        })
    }

    findById(id: string) {
        return this.prisma.badge.findUnique({
            where: { id },
            include: BADGE_INCLUDE,
        })
    }


    create(data: Prisma.BadgeCreateInput) {
        return this.prisma.badge.create({
            data,
            include: BADGE_INCLUDE,
        })
    }

    update(id: string, data: Prisma.BadgeUpdateInput) {
        return this.prisma.badge.update({
            where: { id },
            data,
            include: BADGE_INCLUDE,
        })
    }

    delete(id: string) {
        return this.prisma.badge.delete({
            where: { id },
        })
    }

    count(args?: Prisma.BadgeCountArgs) {
        return this.prisma.badge.count(args)
    }

    findStudents(studentCodes: string[]) {
        return this.prisma.student.findMany({
            where: {
                code: {
                    in: studentCodes,
                },
            },
            select: {
                code: true,
            },
        })
    }

    findExistingAssignments(badgeId: string, studentCodes: string[]) {
        return this.prisma.studentBadge.findMany({
            where: {
                badgeId,
                studentCode: {
                    in: studentCodes,
                },
            },
            select: {
                studentCode: true,
            },
        })
    }

    assignToStudents(badgeId: string, studentCodes: string[], xpReward: number) {
        return this.prisma.$transaction(async tx => {
            const existing = await tx.studentBadge.findMany({
                where: {
                    badgeId,
                    studentCode: { in: studentCodes },
                },
                select: {
                    studentCode: true,
                },
            })
            //
            const existingCodes = new Set(existing.map(item => item.studentCode));
            const newCodes = studentCodes.filter(code => !existingCodes.has(code));
            //
            if (!newCodes.length) return { assignedCount: 0, studentCodes: [] };
            //
            await tx.studentBadge.createMany({
                data: newCodes.map(studentCode => ({
                    studentCode,
                    badgeId,
                })),
            })
            //
            if (xpReward > 0) {
                await tx.student.updateMany({
                    where: {
                        code: {
                            in: newCodes,
                        },
                    },
                    data: {
                        xp: {
                            increment: xpReward,
                        },
                    },
                })
                await tx.xpTransaction.createMany({
                    data: newCodes.map(studentCode => ({
                        studentCode,
                        amount: xpReward,
                        source: 'BADGE',
                        referenceId: badgeId,
                    })),
                })
            }
            //
            return {
                assignedCount: newCodes.length,
                studentCodes: newCodes,
            }
        })
    }
}