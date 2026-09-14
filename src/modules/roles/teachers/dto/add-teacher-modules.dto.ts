import { ArrayNotEmpty, IsString } from 'class-validator'

export class AddTeacherModulesDto {
  @IsString()
  @ArrayNotEmpty()
  moduleCode!: string[]
}