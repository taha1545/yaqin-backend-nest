import { Injectable } from '@nestjs/common'

import type { Prisma } from 'generated/prisma/client'

import { PrismaService } from '@/core/database'
import { COMMENT_SELECT } from './utils/helpers.comments'

@Injectable()
export class CommentsRepo {
    constructor(private readonly prisma: PrismaService) { }

    findMany(
        args: Omit<Prisma.CommentFindManyArgs, 'select' | 'include'>,
    ) {
        return this.prisma.comment.findMany({
            ...args,
            select: COMMENT_SELECT,
        })
    }

    findById(id: string) {
        return this.prisma.comment.findUnique({
            where: { id },
            select: {
                id: true,
                studentCode: true,
            },
        })
    }

    create(data: Prisma.CommentCreateInput) {
        return this.prisma.comment.create({
            data,
            select: COMMENT_SELECT,
        })
    }

    delete(where: Prisma.CommentWhereUniqueInput) {
        return this.prisma.comment.delete({
            where,
        })
    }

    count(args?: Prisma.CommentCountArgs) {
        return this.prisma.comment.count(args)
    }
}