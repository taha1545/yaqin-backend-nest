import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards, } from '@nestjs/common'
import { CurrentStudent, Public, } from '@/common/decorators'
import { StudentAuthGuard } from '@/common/guards'
import type { StudentSelf } from '@/common/interfaces'
import { CreateCommentDto, ListCommentsQueryDto, } from './dto'
import { CommentsService } from './comments.service'

@Controller('lessons/:lessonId/comments')
@Public()
@UseGuards(StudentAuthGuard)
export class CommentsController {
    //
    constructor(private readonly service: CommentsService) { }

    @Get()
    findAll(@Param('lessonId') lessonId: string, @Query() query: ListCommentsQueryDto) {
        return this.service.findAll(lessonId, query)
    }

    @Post()
    create(@Param('lessonId') lessonId: string, @Body() dto: CreateCommentDto, @CurrentStudent() student: StudentSelf) {
        return this.service.create(
            lessonId,
            dto,
            student,
        )
    }

    @Delete(':id')
    remove(@Param('id') id: string, @CurrentStudent() student: StudentSelf) {
        return this.service.remove(id, student)
    }
}