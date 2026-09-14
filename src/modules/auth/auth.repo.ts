import { ConflictException, Injectable } from '@nestjs/common'

import { Prisma, UserRole, } from 'generated/prisma/client'
import type { User } from 'generated/prisma/client'

import { PrismaService } from '@/core'
import { toSafeUser } from '@/common/utils'

@Injectable()
export class AuthRepo {
  //
  constructor(private readonly prisma: PrismaService,) { }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        parent: true,
        teacher: true,
        member: true,
      },
    })
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        parent: true,
        teacher: true,
        member: true,
      },
    })
  }

  async findIdByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
      },
    })
  }

  async ensureEmailAvailable(email: string, tx: Prisma.TransactionClient,): Promise<void> {
    const existing = await tx.user.findUnique({ where: { email } })
    //
    if (existing) {
      throw new ConflictException(
        'Email is already registered.',
      )
    }
  }


  async createParent(
    data: {
      email: string
      name: string
      password: string
      phone?: string
    },
    tx: Prisma.TransactionClient,
  ) {
    return tx.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: data.password,
        phone: data.phone,
        role: UserRole.PARENT,
        isVerified: true,
        parent: {
          create: {},
        },
      },
      include: {
        parent: true,
        teacher: true,
        member: true,
      },
    })
  }

  async createTeacher(
    data: {
      email: string
      name: string
      password: string
      phone?: string
      level: string
      wilaya: string
      school?: string
      bio?: string
    },
    tx: Prisma.TransactionClient,
  ) {
    return tx.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: data.password,
        phone: data.phone,
        role: UserRole.TEACHER,
        isVerified: false,

        teacher: {
          create: {
            level: data.level,
            wilaya: data.wilaya,
            school: data.school,
            bio: data.bio,
          },
        },
      },
      include: {
        parent: true,
        teacher: true,
        member: true,
      },
    })
  }


  async attachGoogleId(userId: string, googleId: string,) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        googleId,
      },
      include: {
        parent: true,
        teacher: true,
        member: true,
      },
    })
  }

  async createGoogleParent(data: {
    email: string
    name: string
    googleId: string
  }) {
    return this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        googleId: data.googleId,
        role: UserRole.PARENT,
        isVerified: true,
        parent: {
          create: {},
        },
      },
      include: {
        parent: true,
        teacher: true,
        member: true,
      },
    })
  }

  async updatePassword(
    userId: string,
    password: string,
  ) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password,
      },
    })
  }

  safeUser<T extends User>(user: T) {
    return toSafeUser(user)
  }

  async transaction<T>(
    callback: (
      tx: Prisma.TransactionClient,
    ) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction(callback)
  }
}