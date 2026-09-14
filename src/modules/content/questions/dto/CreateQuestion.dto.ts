import { IsArray, IsBoolean, IsEnum, IsInt, IsOptional, IsString, Min, MinLength, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

import { QuestionType } from 'generated/prisma/enums'

export class CreateQuestionOptionDto {
    @IsString()
    @MinLength(1)
    text!: string

    @IsOptional()
    @IsBoolean()
    isCorrect?: boolean

    @IsInt()
    @Min(1)
    order!: number
}

export class CreateQuestionDto {
    @IsEnum(QuestionType)
    type!: QuestionType

    @IsString()
    @MinLength(1)
    question!: string

    @IsOptional()
    @IsString()
    explanation?: string

    @IsOptional()
    @IsString()
    correctAnswer?: string

    @IsInt()
    @Min(1)
    order!: number

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateQuestionOptionDto)
    options?: CreateQuestionOptionDto[]
}

export class CreateQuestionsDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateQuestionDto)
    questions!: CreateQuestionDto[]
}