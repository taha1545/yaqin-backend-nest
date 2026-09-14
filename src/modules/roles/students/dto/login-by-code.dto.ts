import { IsOptional, IsString, MinLength } from 'class-validator'

export class LoginByCodeDto {
  @IsString()
  @MinLength(1)
  code!: string

  @IsOptional()
  @IsString()
  deviceName?: string
}
