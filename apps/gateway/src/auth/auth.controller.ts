import {
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Authorization } from './decorator/authorization.decorator';
import { ERROR_MESSAGES } from '@app/common/const/messages';
import { RegisterDto } from './dto/register.dto';
import { GoogleLoginDto } from './dto/google-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerUser(
    @Authorization() credentials: string,
    @Body() registerDto: RegisterDto,
  ) {
    console.log('register', credentials);
    if (credentials === null) {
      throw new UnauthorizedException(ERROR_MESSAGES.UNAUTHORIZED_TOKEN);
    }

    return this.authService.register(credentials, registerDto);
  }

  @Post('login')
  loginUser(@Authorization() credentials: string) {
    if (credentials === null) {
      throw new UnauthorizedException(ERROR_MESSAGES.UNAUTHORIZED_TOKEN);
    }

    return this.authService.login(credentials);
  }

  @Post('google/login')
  loginGoogle(@Body() loginDto: GoogleLoginDto) {
    return this.authService.loginGoogle(loginDto);
  }
}
