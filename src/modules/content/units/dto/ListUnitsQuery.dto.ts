import { IsInt, IsOptional, IsString, Min } from 'class-validator'
import { Type } from 'class-transformer'

import { PaginationDto } from '@/common/dto'

export class ListUnitsQueryDto extends PaginationDto {
    @IsOptional()
    @IsString()
    gradeCode?: string

    @IsOptional()
    @IsString()
    moduleCode?: string

    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    semester?: number

    @IsOptional()
    @IsString()
    search?: string
}