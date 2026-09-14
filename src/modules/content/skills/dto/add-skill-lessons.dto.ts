import {
    ArrayNotEmpty,
    IsArray,
    IsUUID,
} from 'class-validator'

export class AddSkillLessonsDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsUUID('4', { each: true })
    lessonIds!: string[]
}