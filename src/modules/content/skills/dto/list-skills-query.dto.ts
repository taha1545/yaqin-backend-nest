import {
    IsEnum,
    IsOptional,
    IsString,
    MinLength,
} from 'class-validator'

import { PaginationDto } from '@/common/dto'

import { LessonStatus } from 'generated/prisma/client'

export class ListSkillsQueryDto extends PaginationDto {
    @IsOptional()
    @IsString()
    @MinLength(1)
    search?: string

    @IsOptional()
    @IsString()
    target?: string

    @IsOptional()
    @IsEnum(LessonStatus)
    status?: LessonStatus
}