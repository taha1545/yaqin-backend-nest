import { IsOptional, IsString, MinLength } from 'class-validator';

import { RegisterBaseDto } from './register-base.dto';

export class RegisterTeacherDto extends RegisterBaseDto {
  @IsString()
  @MinLength(1)
  level!: string;

  @IsString()
  @MinLength(1)
  wilaya!: string;

  @IsOptional()
  @IsString()
  school?: string;

  @IsOptional()
  @IsString()
  bio?: string;
}
