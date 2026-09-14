import {
    IsInt,
    IsOptional,
    IsString,
    IsUUID,
    Max,
    Min,
    MinLength,
} from 'class-validator';

import { Type } from 'class-transformer';

import { PaginationDto } from '@/common/dto';

export class ListLessonsQueryDto extends PaginationDto {
    @IsOptional()
    @IsString()
    unitId?: string;

    @IsOptional()
    @IsString()
    gradeCode?: string;

    @IsOptional()
    @IsString()
    moduleCode?: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(3)
    @Type(() => Number)
    semester?: number;

    @IsOptional()
    @IsString()
    @MinLength(1)
    search?: string;

    @IsOptional()
    @IsString()
    difficulty?: string;

    @IsOptional()
    @IsUUID()
    skillId?: string;
}