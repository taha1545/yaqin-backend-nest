import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common'
import { UserRole } from 'generated/prisma/client'
import { CurrentUser, Public, Roles } from '@/common/decorators'
import type { Caller } from './utils/helpers.lessons'
import { CreateLessonDto, ListLessonsQueryDto, UpdateLessonDto } from './dto'
import { LessonsService } from './lessons.service'

@Controller('lessons')
export class LessonsController {
    //
    constructor(private readonly service: LessonsService) { }

    @Public()
    @Get()
    findAll(@Query() query: ListLessonsQueryDto) {
        return this.service.findAll(query)
    }

    @Get('manage')
    @Roles(UserRole.MEMBER, UserRole.ADMIN)
    findAllForMember(@CurrentUser() caller: Caller, @Query() query: ListLessonsQueryDto) {
        return this.service.findAllForMember(caller, query)
    }

    @Public()
    @Get(':id')
    findById(@Param('id') id: string) {
        return this.service.findById(id)
    }

    @Post()
    @Roles(UserRole.MEMBER, UserRole.ADMIN)
    create(@Body() dto: CreateLessonDto, @CurrentUser() caller: Caller,
    ) {
        return this.service.create(dto, caller)
    }

    @Patch(':id')
    @Roles(UserRole.MEMBER, UserRole.ADMIN)
    update(@Param('id') id: string, @Body() dto: UpdateLessonDto) {
        return this.service.update(id, dto)
    }

    @Delete(':id')
    @Roles(UserRole.MEMBER, UserRole.ADMIN)
    @HttpCode(HttpStatus.OK)
    remove(@Param('id') id: string) {
        return this.service.remove(id)
    }
}