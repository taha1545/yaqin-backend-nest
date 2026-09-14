import { IsBooleanString, IsEnum, IsOptional, IsString } from 'class-validator'

import { PaginationDto } from '@/common/dto'
import { UserRole } from '../../../../../generated/prisma/client'

export class ListUsersQueryDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole

  @IsOptional()
  @IsBooleanString()
  isVerified?: string
}