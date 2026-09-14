import { IsOptional, IsString, IsInt, IsUUID } from 'class-validator';

import { PaginationDto } from '@/common/dto';
import { Type } from 'class-transformer';

export class ListStudentsQueryDto extends PaginationDto {
  @IsOptional()
  @IsUUID()
  parentId?: string;

  @IsOptional()
  @IsString()
  gradeCode?: string;

  @IsOptional()
  @IsString()
  wilaya?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  semester?: number
}
