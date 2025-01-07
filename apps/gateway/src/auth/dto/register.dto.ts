import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  nickname: string;
}
