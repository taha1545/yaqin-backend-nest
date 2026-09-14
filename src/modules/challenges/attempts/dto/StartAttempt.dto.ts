import { IsString, MinLength } from 'class-validator'

export class StartAttemptDto {
    @IsString()
    @MinLength(1)
    lessonId!: string
}