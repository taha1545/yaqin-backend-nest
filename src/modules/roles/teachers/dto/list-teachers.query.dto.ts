import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

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

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isVerified?: boolean;
}
