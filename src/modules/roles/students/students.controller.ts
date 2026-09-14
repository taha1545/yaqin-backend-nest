import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentStudent, CurrentUser, Public, Roles, } from '@/common/decorators';
import { StudentAuthGuard } from '@/common/guards/student-auth.guard';
import { UserRole } from 'generated/prisma/client';
import type { Caller, StudentCaller } from './utils/helpers.students';
import { CreateStudentDto, ListStudentsQueryDto, LoginByCodeDto, UpdateStudentDto, } from './dto';
import { StudentsService } from './students.service';


@Controller('students')
export class StudentsController {
  //
  constructor(private readonly service: StudentsService) { }

  @Get()
  @Roles(UserRole.ADMIN)
  findAll(@Query() query: ListStudentsQueryDto) {
    return this.service.findAll(query);
  }

  @Get('rankings')
  @Public()
  rankings(@Query() query: ListStudentsQueryDto) {
    return this.service.rankings(query);
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginByCodeDto) {
    return this.service.login(dto);
  }

  @Get('me')
  @Public()
  @UseGuards(StudentAuthGuard)
  me(@CurrentStudent() student: StudentCaller) {
    return this.service.findMe(student);
  }

  @Patch('me')
  @Public()
  @UseGuards(StudentAuthGuard)
  updateMe(@Body() dto: UpdateStudentDto, @CurrentStudent() student: StudentCaller) {
    return this.service.updateMe(dto, student);
  }

  @Post()
  @Roles(UserRole.PARENT)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateStudentDto, @CurrentUser() caller: Caller) {
    return this.service.create(dto, caller);
  }

  @Post('signup')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() dto: CreateStudentDto) {
    return this.service.create(dto);
  }

  @Delete(':code')
  @Roles(UserRole.PARENT)
  @HttpCode(HttpStatus.OK)
  remove(@Param('code') code: string, @CurrentUser() caller: Caller) {
    return this.service.remove(code, caller);
  }

  @Post('me/image')
  @Public()
  @UseGuards(StudentAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  addImage(@UploadedFile() file: Express.Multer.File, @CurrentStudent() student: StudentCaller) {
    return this.service.addImage(file, student);
  }

  @Delete('me/image')
  @Public()
  @UseGuards(StudentAuthGuard)
  @HttpCode(HttpStatus.OK)
  removeImage(@CurrentStudent() student: StudentCaller,) {
    return this.service.removeImage(student);
  }
}