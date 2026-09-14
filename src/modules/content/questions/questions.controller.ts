import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { Roles, Public } from '@/common/decorators'
import { UserRole } from 'generated/prisma/enums'
import { QuestionsService } from './questoins.service'
import type { CreateQuestionsDto } from './dto'

@Controller('lessons/:lessonId/questions')
export class QuestionsController {
    //
    constructor(private readonly service: QuestionsService) { }

    @Get()
    @Public()
    findAll(@Param('lessonId') lessonId: string) {
        return this.service.findAll(lessonId)
    }

    @Get(':id')
    @Public()
    findById(@Param('id') id: string) {
        return this.service.findById(id)
    }

    @Post()
    @Roles(UserRole.MEMBER, UserRole.ADMIN)
    createMany(@Param('lessonId') lessonId: string, @Body() dto: CreateQuestionsDto) {
        return this.service.createMany(lessonId, dto)
    }

    @Delete(':id')
    @Roles(UserRole.MEMBER, UserRole.ADMIN)
    remove(@Param('id') id: string) {
        return this.service.remove(id)
    }
}