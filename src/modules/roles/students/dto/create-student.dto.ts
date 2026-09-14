import { IsInt, IsOptional, IsString, MinLength } from 'class-validator'

export class CreateStudentDto {

  @IsString()
  gradeCode!: string

  @IsInt()
  semester!: number

  @IsString()
  @MinLength(2)
  fullName!: string

  @IsOptional()
  @IsString()
  dateOfBirth?: string

  @IsOptional()
  @IsString()
  schoolName?: string

  @IsString()
  @MinLength(1)
  wilaya!: string
}
