import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common'
import { Public, Roles } from '@/common/decorators'
import { ParseUuidPipe } from '@/common/pipes'
import { UserRole } from 'generated/prisma/client'
import { CreateUnitDto, ListUnitsQueryDto, UpdateUnitDto, } from './dto'
import { UnitsService } from './units.service'

@Controller('units')
export class UnitsController {
    //
    constructor(private readonly service: UnitsService) { }

    @Public()
    @Get()
    findAll(@Query() query: ListUnitsQueryDto) {
        return this.service.findAll(query)
    }

    @Public()
    @Get(':id')
    findById(@Param('id', ParseUuidPipe) id: string) {
        return this.service.findById(id)
    }

    @Post()
    @Roles(UserRole.ADMIN, UserRole.MEMBER)
    @HttpCode(HttpStatus.CREATED)
    create(@Body() dto: CreateUnitDto) {
        return this.service.create(dto)
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN, UserRole.MEMBER)
    update(@Param('id', ParseUuidPipe) id: string, @Body() dto: UpdateUnitDto) {
        return this.service.update(id, dto)
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN, UserRole.MEMBER)
    @HttpCode(HttpStatus.OK)
    remove(@Param('id', ParseUuidPipe) id: string) {
        return this.service.remove(id)
    }
}