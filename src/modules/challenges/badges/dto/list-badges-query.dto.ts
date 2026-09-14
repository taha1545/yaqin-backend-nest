import { IsOptional, IsString, MinLength } from 'class-validator'

import { PaginationDto } from '@/common/dto'

export class ListBadgesQueryDto extends PaginationDto {
    @IsOptional()
    @IsString()
    @MinLength(1)
    search?: string
}