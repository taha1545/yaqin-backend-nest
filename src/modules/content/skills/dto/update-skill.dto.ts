import {
    IsEnum,
    IsOptional,
    IsString,
    MinLength,
} from 'class-validator'

import { LessonStatus } from 'generated/prisma/client'

export class UpdateSkillDto {
    @IsOptional()
    @IsString()
    @MinLength(1)
    name?: string

    @IsOptional()
    @IsString()
    description?: string

    @IsOptional()
    @IsString()
    target?: string

    @IsOptional()
    @IsEnum(LessonStatus)
    status?: LessonStatus
}