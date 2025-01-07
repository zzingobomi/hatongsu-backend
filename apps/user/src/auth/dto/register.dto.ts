import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  credentials: string;

  @IsString()
  @IsNotEmpty()
  nickname: string;
}
