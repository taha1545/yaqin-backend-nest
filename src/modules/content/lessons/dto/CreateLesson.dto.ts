import {
    IsInt,
    IsOptional,
    IsString,
    Min,
    MinLength,
    IsEnum
} from 'class-validator';

import { LessonDifficulty } from 'generated/prisma/enums';

export class CreateLessonDto {
    @IsString()
    @MinLength(1)
    unitId!: string;

    @IsString()
    @MinLength(1)
    title!: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsString()
    @MinLength(1)
    content!: string;

    @IsOptional()
    @IsEnum(LessonDifficulty)
    difficulty?: LessonDifficulty

    @IsInt()
    @Min(0)
    xp!: number;

    @IsInt()
    @Min(1)
    order!: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    minPresent?: number;
}