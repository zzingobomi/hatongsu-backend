import { AUTH_SERVICE, USER_SERVICE, UserMicroservice } from '@app/common';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { RegisterDto } from './dto/register.dto';
import { GoogleLoginDto } from './dto/google-login.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  authService: UserMicroservice.AuthServiceClient;

  constructor(
    @Inject(USER_SERVICE)
    private readonly userMicroservice: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authService =
      this.userMicroservice.getService<UserMicroservice.AuthServiceClient>(
        AUTH_SERVICE,
      );
  }

  register(credentials: string, registerDto: RegisterDto) {
    return lastValueFrom(
      this.authService.registerUser({ ...registerDto, credentials }),
    );
  }

  login(credentials: string) {
    return lastValueFrom(this.authService.loginUser({ credentials }));
  }

  async loginGoogle(loginDto: GoogleLoginDto) {
    // 구글 idToken 유효성 검사
    const result = await lastValueFrom(
      this.authService.validateGoogleToken({ idToken: loginDto.idToken }),
    );

    // 구글 로그인 처리
    if (result.success) {
      return lastValueFrom(this.authService.loginGoogle({ ...loginDto }));
    } else {
      return result;
    }
  }
}
