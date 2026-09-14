import { IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator'

export class CreateBadgeDto {
    @IsString()
    @MinLength(1)
    name!: string

    @IsOptional()
    @IsString()
    description?: string

    @IsOptional()
    @IsInt()
    @Min(0)
    xpReward?: number
}