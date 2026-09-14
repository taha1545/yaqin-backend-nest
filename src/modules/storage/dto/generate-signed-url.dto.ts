import { IsOptional, IsString, MinLength } from 'class-validator';

export class GenerateSignedUrlDto {
  @IsString()
  @MinLength(1)
  key!: string;

  @IsOptional()
  @IsString()
  downloadName?: string;
}
