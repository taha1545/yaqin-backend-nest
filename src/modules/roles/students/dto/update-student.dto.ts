import { IsInt, IsOptional, IsString, Max, Min, MinLength } from 'class-validator'

export class UpdateStudentDto {
  @IsOptional()
  @IsString()
  gradeCode?: string

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(3)
  semester?: number

  @IsOptional()
  @IsString()
  @MinLength(2)
  fullName?: string

  @IsOptional()
  @IsString()
  dateOfBirth?: string

  @IsOptional()
  @IsString()
  schoolName?: string

  @IsOptional()
  @IsString()
  @MinLength(1)
  wilaya?: string

  @IsOptional()
  @IsString()
  deviceName?: string
}
