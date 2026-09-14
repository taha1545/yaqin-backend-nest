import {
    IsOptional,
    IsString,
    MinLength,
} from 'class-validator'

export class CreateSkillDto {
    @IsString()
    @MinLength(1)
    name!: string

    @IsOptional()
    @IsString()
    description?: string

    @IsOptional()
    @IsString()
    target?: string
}