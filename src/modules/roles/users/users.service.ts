import { BadRequestException, Injectable, NotFoundException, } from '@nestjs/common'
import { paginated, toSafeUser, } from '@/common/utils'
import { StorageService, resolveMimeType, } from '@/core/storage'
import { PrismaService } from '@/core'
import type { ListUsersQueryDto, UpdateUserDto, } from './dto'
import { buildOrderBy, buildWhere, ensureAccess, USER_INCLUDE, type Caller } from './utils/helpers.users'
import { USER_IMAGE_VALIDATION } from './utils/storage.users'

@Injectable()
export class UsersService {
  //
  constructor(private readonly prisma: PrismaService, private readonly storage: StorageService,) { }


  async findAll(query: ListUsersQueryDto) {
    const where = buildWhere(query)
    //
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip: query.skip,
        take: query.take,
        orderBy: buildOrderBy(query),
        include: USER_INCLUDE,
      }),
      this.prisma.user.count({
        where,
      }),
    ])
    return paginated(users.map(toSafeUser), total, query)
  }

  async findOne(id: string, caller: Caller) {
    ensureAccess(id, caller);
    //
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: USER_INCLUDE,
    })
    if (!user) throw new NotFoundException('User not found.');
    return toSafeUser(user)
  }

  async update(id: string, dto: UpdateUserDto, caller: Caller) {
    ensureAccess(id, caller);
    //
    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        name: dto.name,
        phone: dto.phone,
      },
      include: USER_INCLUDE,
    })
    //
    return toSafeUser(updated)
  }

  async verifyUser(id: string) {
    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        isVerified: true,
      },
      include: USER_INCLUDE,
    })
    //
    return toSafeUser(updated)
  }

  async addImage(id: string, file: Express.Multer.File, caller: Caller) {
    ensureAccess(id, caller);
    if (!file) throw new BadRequestException('No file provided.');
    //
    const mimeType = resolveMimeType(file.mimetype, file.originalname);
    const result = await this.storage.upload({
      buffer: file.buffer,
      mimeType,
      size: file.size,
      originalName: file.originalname,
      prefix: 'pfp',
      validation: USER_IMAGE_VALIDATION,
    })
    //
    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        imageKey: result.key,
      },
      include: USER_INCLUDE,
    })
    //
    return toSafeUser(updated);
  }

  async removeImage(id: string, caller: Caller,) {
    ensureAccess(id, caller)
    //
    const user = await this.findOrFail(id)
    if (user.imageKey) await this.storage.delete({ key: user.imageKey, });
    //
    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        imageKey: null,
      },
      include: USER_INCLUDE,
    })
    //
    return toSafeUser(updated)
  }

  async remove(id: string) {
    await this.findOrFail(id);
    await this.prisma.user.delete({
      where: { id },
    });
    //
    return { message: 'User deleted successfully.' };
  }

  private async findOrFail(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    })
    if (!user) throw new NotFoundException('User not found.');
    //
    return user
  }
}