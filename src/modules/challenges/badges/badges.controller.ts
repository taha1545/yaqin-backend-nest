import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Roles, Public } from '@/common/decorators'
import { UserRole } from 'generated/prisma/client'
import type { AssignBadgeDto, CreateBadgeDto, ListBadgesQueryDto, UpdateBadgeDto } from './dto'
import { BadgesService } from './badges.service'

@Controller('badges')
export class BadgesController {
    //
    constructor(private readonly service: BadgesService) { }

    @Get()
    @Public()
    findAll(@Query() query: ListBadgesQueryDto) {
        return this.service.findAll(query)
    }

    @Get(':id')
    @Public()
    findById(@Param('id') id: string) {
        return this.service.findById(id)
    }

    @Post()
    @Roles(UserRole.ADMIN)
    @UseInterceptors(FileInterceptor('file'))
    create(@Body() dto: CreateBadgeDto, @UploadedFile() file?: Express.Multer.File) {
        return this.service.create(dto, file)
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN)
    update(@Param('id') id: string, @Body() dto: UpdateBadgeDto) {
        return this.service.update(id, dto)
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    remove(@Param('id') id: string) {
        return this.service.remove(id)
    }

    @Post(':id/students')
    @Roles(UserRole.ADMIN)
    assignToStudents(@Param('id') badgeId: string, @Body() dto: AssignBadgeDto) {
        return this.service.assignToStudents(
            badgeId,
            dto,
        )
    }
}