import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator'

export class GenerateQuestionsDto {
    @IsString()
    lessonId!: string

    @IsInt()
    @Min(1)
    @Max(20)
    count!: number

    @IsOptional()
    @IsString()
    prompt?: string
}