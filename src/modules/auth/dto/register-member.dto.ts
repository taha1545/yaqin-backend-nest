import { IsString, IsOptional } from 'class-validator';
import { RegisterBaseDto } from './register-base.dto';

export class RegisterMemberDto extends RegisterBaseDto {

    @IsOptional()
    @IsString()
    target?: string;

}
