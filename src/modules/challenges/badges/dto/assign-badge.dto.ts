// dto/assign-badge.dto.ts

import {
    ArrayMinSize,
    IsArray,
    IsString,
    MinLength,
} from 'class-validator'

export class AssignBadgeDto {
    @IsArray()
    @ArrayMinSize(1)
    @IsString({ each: true })
    @MinLength(1, { each: true })
    studentCodes!: string[]
}