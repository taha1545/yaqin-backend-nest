import {
    IsInt,
    IsOptional,
    IsString,
    Min,
    MinLength,
} from 'class-validator'

export class UpdateUnitDto {
    @IsOptional()
    @IsString()
    @MinLength(1)
    gradeCode?: string

    @IsOptional()
    @IsString()
    @MinLength(1)
    moduleCode?: string

    @IsOptional()
    @IsInt()
    @Min(1)
    semester?: number

    @IsOptional()
    @IsString()
    @MinLength(1)
    title?: string

    @IsOptional()
    @IsString()
    description?: string

    @IsOptional()
    @IsInt()
    @Min(1)
    order?: number
}