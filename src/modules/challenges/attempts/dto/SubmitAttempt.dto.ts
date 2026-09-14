import { IsArray, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class SubmitAnswerDto {
    @IsUUID()
    questionId!: string

    @IsOptional()
    @IsUUID()
    optionId?: string

    @IsOptional()
    @IsString()
    answer?: string
}

export class SubmitAttemptDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SubmitAnswerDto)
    answers!: SubmitAnswerDto[]
}