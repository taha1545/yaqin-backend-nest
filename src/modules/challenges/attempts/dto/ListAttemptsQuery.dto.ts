import { IsOptional, IsString, MinLength } from 'class-validator'

import { PaginationDto } from '@/common/dto'

export class ListAttemptsQueryDto extends PaginationDto {
    @IsString()
    @MinLength(1)
    studentCode!: string

    @IsOptional()
    @IsString()
    @MinLength(1)
    lessonId?: string
}