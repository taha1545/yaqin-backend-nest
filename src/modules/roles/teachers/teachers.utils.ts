import { toSafeUser } from '@/common/utils'
import type { Prisma, User, Module } from '../../../../generated/prisma/client'
import type { UserRole } from '../../../../generated/prisma/client'
import type { ListTeachersQueryDto } from './dto'


export interface Caller {
  id: string
  role: UserRole
}

export const TEACHER_INCLUDE = {
  user: true,
  teacherModules: {
    include: {
      module: true,
    },
  },
} as const satisfies Prisma.TeacherInclude

export function toTeacherProfile(teacher: {
  user: User
  level: string
  wilaya: string
  school: string | null
  bio: string | null
  teacherModules: {
    module: Module
  }[]
}) {
  return {
    ...toSafeUser(teacher.user),
    level: teacher.level,
    wilaya: teacher.wilaya,
    school: teacher.school,
    bio: teacher.bio,
    modules: teacher.teacherModules.map(
      (teacherModule) => teacherModule.module,
    ),
  }
}

export function buildWhere(query: ListTeachersQueryDto, verifiedOnly = true): Prisma.TeacherWhereInput {
  const user: Prisma.UserWhereInput = {}
  //
  if (verifiedOnly) user.isVerified = true;
  if (query.search) {
    user.name = {
      contains: query.search,
      mode: 'insensitive',
    }
  }
  const where: Prisma.TeacherWhereInput = {}
  //
  if (Object.keys(user).length > 0) where.user = user;
  if (query.level) where.level = query.level;
  if (query.wilaya) where.wilaya = query.wilaya;
  if (query.moduleCode) {
    where.teacherModules = {
      some: {
        moduleCode: query.moduleCode,
      },
    }
  }
  return where
}

export function buildOrderBy(query: { sortBy?: string; order?: 'asc' | 'desc' },): Prisma.TeacherOrderByWithRelationInput {
  const allowed = ['createdAt', 'level', 'wilaya'] as const
  const sortBy = allowed.includes(query.sortBy as (typeof allowed)[number]) ? (query.sortBy as (typeof allowed)[number]) : 'createdAt';
  const order = query.order ?? 'desc'
  //
  return {
    [sortBy]: order,
  }
}