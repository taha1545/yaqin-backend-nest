import {
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    Min,
    MinLength,
} from 'class-validator'

import {
    LessonDifficulty,
    LessonStatus,
} from 'generated/prisma/enums'

export class UpdateLessonDto {
    @IsOptional()
    @IsString()
    @MinLength(1)
    unitId?: string

    @IsOptional()
    @IsString()
    @MinLength(1)
    title?: string

    @IsOptional()
    @IsString()
    description?: string

    @IsOptional()
    @IsString()
    @MinLength(1)
    content?: string

    @IsOptional()
    @IsEnum(LessonDifficulty)
    difficulty?: LessonDifficulty

    @IsOptional()
    @IsInt()
    @Min(0)
    xp?: number

    @IsOptional()
    @IsInt()
    @Min(1)
    order?: number

    @IsOptional()
    @IsInt()
    @Min(0)
    minPresent?: number

    @IsOptional()
    @IsEnum(LessonStatus)
    status?: LessonStatus
}