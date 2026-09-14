import { Injectable, NotFoundException, } from '@nestjs/common'
import { paginated } from '@/common/utils'
import type { StudentSelf } from '@/common/interfaces'
import type { CreateCommentDto, ListCommentsQueryDto } from './dto'
import { CommentsRepo } from './comments.repo'

@Injectable()
export class CommentsService {
    constructor(private readonly repo: CommentsRepo) { }

    async findAll(lessonId: string, query: ListCommentsQueryDto) {
        const where = { lessonId };
        const [comments, total] = await Promise.all([
            this.repo.findMany({
                where,
                skip: query.skip,
                take: query.take,
                orderBy: {
                    createdAt: 'asc',
                },
            }),
            this.repo.count({ where }),
        ])
        return paginated(comments, total, query)
    }

    async create(lessonId: string, dto: CreateCommentDto, student: StudentSelf) {
        return this.repo.create({
            lesson: { connect: { id: lessonId } },
            student: { connect: { code: student.code } },
            content: dto.content,
        })
    }

    async remove(id: string, student: StudentSelf) {
        const comment = await this.repo.findById(id)
        //
        if (!comment) throw new NotFoundException('Comment not found.');
        if (comment.studentCode !== student.code) {
            throw new NotFoundException('Comment not found.')
        }
        //
        await this.repo.delete({ id });
        return { message: 'Comment deleted successfully.' };
    }
}