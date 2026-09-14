import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, } from '@nestjs/common'
import { Public, Roles } from '@/common/decorators'
import { UserRole } from 'generated/prisma/client'
import { AddSkillLessonsDto, CreateSkillDto, ListSkillsQueryDto, UpdateSkillDto } from './dto'
import { SkillsService } from './skills.service'


@Controller('skills')
export class SkillsController {
    //
    constructor(private readonly service: SkillsService) { }

    @Public()
    @Get()
    findAll(@Query() query: ListSkillsQueryDto) {
        return this.service.findAll(query)
    }

    @Public()
    @Get(':id')
    findById(@Param('id') id: string) {
        return this.service.findById(id)
    }

    // Member / Admin

    @Get('manage')
    @Roles(UserRole.MEMBER, UserRole.ADMIN)
    findAllForMember(@Query() query: ListSkillsQueryDto,) {
        return this.service.findAllForMember(query)
    }

    @Get('manage/:id')
    @Roles(UserRole.MEMBER, UserRole.ADMIN)
    findByIdForMember(@Param('id') id: string) {
        return this.service.findByIdForMember(id)
    }

    @Post()
    @Roles(UserRole.MEMBER, UserRole.ADMIN)
    @HttpCode(HttpStatus.CREATED)
    create(@Body() dto: CreateSkillDto) {
        return this.service.create(dto)
    }


    @Patch(':id')
    @Roles(UserRole.MEMBER, UserRole.ADMIN)
    update(@Param('id') id: string, @Body() dto: UpdateSkillDto) {
        return this.service.update(id, dto)
    }


    @Delete(':id')
    @Roles(UserRole.MEMBER, UserRole.ADMIN)
    @HttpCode(HttpStatus.OK)
    remove(@Param('id') id: string) {
        return this.service.remove(id)
    }


    @Post(':id/lessons')
    @Roles(UserRole.MEMBER, UserRole.ADMIN)
    @HttpCode(HttpStatus.OK)
    addLessons(@Param('id') id: string, @Body() dto: AddSkillLessonsDto) {
        return this.service.addLessons(id, dto)
    }
}