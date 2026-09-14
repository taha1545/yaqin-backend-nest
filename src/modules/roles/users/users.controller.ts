import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UploadedFile, UseInterceptors, } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { CurrentUser, Roles } from '@/common/decorators'
import { ParseUuidPipe } from '@/common/pipes'
import { UserRole } from 'generated/prisma/client'
import { ListUsersQueryDto, UpdateUserDto, } from './dto'
import { UsersService } from './users.service'
import type { Caller } from './utils/helpers.users'

@Controller('users')
export class UsersController {
  //
  constructor(private readonly usersService: UsersService,) { }

  @Get()
  @Roles(UserRole.ADMIN)
  findAll(@Query() query: ListUsersQueryDto) {
    return this.usersService.findAll(query)
  }

  @Post(':id/image')
  @Roles(UserRole.ADMIN, UserRole.PARENT, UserRole.TEACHER, UserRole.MEMBER)
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  addImage(
    @Param('id', ParseUuidPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() caller: Caller,
  ) {
    return this.usersService.addImage(id, file, caller)
  }

  @Delete(':id/image')
  @Roles(UserRole.ADMIN, UserRole.PARENT, UserRole.TEACHER, UserRole.MEMBER)
  @HttpCode(HttpStatus.OK)
  removeImage(
    @Param('id', ParseUuidPipe) id: string,
    @CurrentUser() caller: Caller,
  ) {
    return this.usersService.removeImage(id, caller)
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.PARENT, UserRole.TEACHER, UserRole.MEMBER)
  findOne(
    @Param('id', ParseUuidPipe) id: string,
    @CurrentUser() caller: Caller,
  ) {
    return this.usersService.findOne(id, caller)
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.PARENT, UserRole.TEACHER, UserRole.MEMBER)
  update(
    @Param('id', ParseUuidPipe) id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() caller: Caller,
  ) {
    return this.usersService.update(id, dto, caller)
  }

  @Patch(':id/verify')
  @Roles(UserRole.ADMIN)
  verifyUser(@Param('id', ParseUuidPipe) id: string) {
    return this.usersService.verifyUser(id)
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseUuidPipe) id: string) {
    return this.usersService.remove(id)
  }
}