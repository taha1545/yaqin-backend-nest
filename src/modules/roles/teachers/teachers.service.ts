import { Injectable, NotFoundException } from '@nestjs/common'
import { paginated } from '@/common/utils'
import { PrismaService } from '@/core'
import type { AddTeacherModulesDto, ListTeachersQueryDto, UpdateTeacherProfileDto, } from './dto'
import { buildOrderBy, buildWhere, TEACHER_INCLUDE, toTeacherProfile, } from './teachers.utils'
import type { Caller } from './teachers.utils'

@Injectable()
export class TeachersService {
  //
  constructor(private readonly prisma: PrismaService) { }

  async findAll(query: ListTeachersQueryDto) {
    const where = buildWhere(query, true);
    const [teachers, total] = await Promise.all([
      this.prisma.teacher.findMany({
        where,
        skip: query.skip,
        take: query.take,
        orderBy: buildOrderBy(query),
        include: TEACHER_INCLUDE,
      }),
      this.prisma.teacher.count({
        where,
      }),
    ])
    return paginated(teachers.map(toTeacherProfile), total, query)
  }

  async findAllAdmin(query: ListTeachersQueryDto) {
    const where = buildWhere(query, query.isVerified !== false);
    const [teachers, total] = await Promise.all([
      this.prisma.teacher.findMany({
        where,
        skip: query.skip,
        take: query.take,
        orderBy: buildOrderBy(query),
        include: TEACHER_INCLUDE,
      }),
      this.prisma.teacher.count({
        where,
      }),
    ])
    return paginated(teachers.map(toTeacherProfile), total, query);
  }

  async getById(id: string) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id },
      include: TEACHER_INCLUDE,
    })
    if (!teacher) throw new NotFoundException('Teacher not found.');
    //
    return toTeacherProfile(teacher);
  }

  async findMe(caller: Caller) {
    const teacher = await this.prisma.teacher.findUnique({
      where: {
        userId: caller.id,
      },
      include: TEACHER_INCLUDE,
    })
    if (!teacher) throw new NotFoundException('Teacher profile not found.');
    return toTeacherProfile(teacher)
  }

  async updateMe(dto: UpdateTeacherProfileDto, caller: Caller) {
    const teacher = await this.prisma.teacher.findUnique({ where: { userId: caller.id } });
    if (!teacher) throw new NotFoundException('Teacher profile not found.');
    //
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: {
          id: caller.id,
        },
        data: {
          name: dto.name,
          phone: dto.phone,
        },
      }),
      this.prisma.teacher.update({
        where: {
          id: teacher.id,
        },
        data: {
          level: dto.level,
          wilaya: dto.wilaya,
          school: dto.school,
          bio: dto.bio,
        },
      }),
    ]);
    return this.findMe(caller)
  }

  async addModules(id: string, dto: AddTeacherModulesDto, caller: Caller) {
    const teacher = await this.getOwnTeacher(id, caller);
    await this.prisma.teacherModule.createMany({
      data: dto.moduleCode.map((moduleCode) => ({
        teacherId: teacher.id,
        moduleCode,
      })),
      skipDuplicates: true,
    })
    return this.findMe(caller)
  }

  async removeModule(id: string, moduleCode: string, caller: Caller) {
    const teacher = await this.getOwnTeacher(id, caller)
    const teacherModule = await this.prisma.teacherModule.findUnique({
      where: {
        teacherId_moduleCode: {
          teacherId: teacher.id,
          moduleCode,
        },
      },
    })
    if (!teacherModule) throw new NotFoundException('Module is not assigned to this teacher.');
    await this.prisma.teacherModule.delete({
      where: {
        teacherId_moduleCode: {
          teacherId: teacher.id,
          moduleCode,
        },
      },
    })
    return this.findMe(caller);
  }

  private async getOwnTeacher(id: string, caller: Caller) {
    const teacher = await this.prisma.teacher.findUnique({
      where: {
        id,
      },
    })
    if (!teacher) throw new NotFoundException('Teacher not found.');
    if (teacher.userId !== caller.id) throw new NotFoundException('Teacher not found.')
    //
    return teacher
  }
}