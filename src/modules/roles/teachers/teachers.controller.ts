import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, } from '@nestjs/common'
import { CurrentUser, Roles, Public } from '@/common/decorators';
import { ParseUuidPipe } from '@/common/pipes';
import { UserRole } from 'generated/prisma/client';
import { AddTeacherModulesDto, ListTeachersQueryDto, UpdateTeacherProfileDto, } from './dto';
import { TeachersService } from './teachers.service';
import type { Caller } from './teachers.utils';


@Controller('teachers')
export class TeachersController {
  //
  constructor(private readonly service: TeachersService) { }

  @Public()
  @Get()
  findAll(@Query() query: ListTeachersQueryDto) {
    return this.service.findAll(query)
  }

  @Public()
  @Get(':id')
  getById(@Param('id', ParseUuidPipe) id: string) {
    return this.service.getById(id)
  }

  @Get('me')
  @Roles(UserRole.TEACHER)
  me(@CurrentUser() caller: Caller) {
    return this.service.findMe(caller)
  }

  @Patch('me')
  @Roles(UserRole.TEACHER)
  updateMe(@Body() dto: UpdateTeacherProfileDto, @CurrentUser() caller: Caller) {
    return this.service.updateMe(dto, caller)
  }

  @Get('admin')
  @Roles(UserRole.ADMIN)
  findAllAdmin(@Query() query: ListTeachersQueryDto) {
    return this.service.findAllAdmin(query)
  }

  @Post(':id/modules')
  @Roles(UserRole.TEACHER)
  @HttpCode(HttpStatus.OK)
  addModules(
    @Param('id', ParseUuidPipe) id: string,
    @Body() dto: AddTeacherModulesDto,
    @CurrentUser() caller: Caller,
  ) {
    return this.service.addModules(id, dto, caller)
  }

  @Delete(':id/modules/:moduleId')
  @Roles(UserRole.TEACHER)
  @HttpCode(HttpStatus.OK)
  removeModule(
    @Param('id', ParseUuidPipe) id: string,
    @Param('moduleId', ParseUuidPipe) moduleId: string,
    @CurrentUser() caller: Caller,
  ) {
    return this.service.removeModule(id, moduleId, caller)
  }

}