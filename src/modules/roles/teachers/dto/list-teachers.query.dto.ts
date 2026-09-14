import { IsOptional, IsString, MinLength } from 'class-validator';

import { PaginationDto } from '@/common/dto';

export class ListTeachersQueryDto extends PaginationDto {
  @IsOptional()
  @IsString()
  moduleCode?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  level?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  wilaya?: string;

  @IsOptional()
  @IsString()
  search?: string;

  isVerified?: boolean;
}
