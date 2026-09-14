import {
    IsInt,
    IsOptional,
    IsString,
    Min,
    MinLength,
} from 'class-validator'

export class CreateUnitDto {
    @IsString()
    @MinLength(1)
    gradeCode!: string

    @IsString()
    @MinLength(1)
    moduleCode!: string

    @IsInt()
    @Min(1)
    semester!: number

    @IsString()
    @MinLength(1)
    title!: string

    @IsOptional()
    @IsString()
    description?: string

    @IsInt()
    @Min(1)
    order!: number
}