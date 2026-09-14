import { Controller, Delete, Get, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common'
import { FilesInterceptor, } from '@nestjs/platform-express'
import { Roles, } from '@/common/decorators'
import { UserRole } from 'generated/prisma/client'
import { LessonResourcesService } from './lesson-resources.service'

@Controller('lessons/:lessonId/resources')
export class LessonResourcesController {
    //
    constructor(private readonly service: LessonResourcesService) { }

    @Get()
    findAll(@Param('lessonId') lessonId: string) {
        return this.service.findAll(lessonId)
    }

    @Post()
    @Roles(UserRole.MEMBER, UserRole.ADMIN)
    @UseInterceptors(FilesInterceptor('files', 10))
    create(@Param('lessonId') lessonId: string, @UploadedFiles() files: Express.Multer.File[]) {
        return this.service.create(lessonId, files)
    }

    @Delete(':id')
    @Roles(UserRole.MEMBER, UserRole.ADMIN)
    remove(@Param('id') id: string) {
        return this.service.remove(id)
    }
}