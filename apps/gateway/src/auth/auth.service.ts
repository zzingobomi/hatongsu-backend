import { AUTH_SERVICE, USER_SERVICE, UserMicroservice } from '@app/common';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc, ClientProxy, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { RegisterDto } from './dto/register.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import { status } from '@grpc/grpc-js';
import { GrpcError } from '@app/common/grpc/proto/user';

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

  async register(credentials: string, registerDto: RegisterDto) {
    try {
      const response = await lastValueFrom(
        this.authService.registerUser({ ...registerDto, credentials }),
      );
      return response;
    } catch (error) {
      const grpcError = error as GrpcError;
      switch (grpcError.code) {
        case status.ALREADY_EXISTS:
          throw new HttpException(grpcError.details, HttpStatus.CONFLICT);
        default:
          throw new HttpException(
            grpcError.details,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }
  }

  async login(credentials: string) {
    try {
      const response = await lastValueFrom(
        this.authService.loginUser({ credentials }),
      );
      return response;
    } catch (error) {
      const grpcError = error as GrpcError;
      switch (grpcError.code) {
        case status.NOT_FOUND:
          throw new HttpException(grpcError.details, HttpStatus.NOT_FOUND);
        case status.UNAUTHENTICATED:
          throw new HttpException(grpcError.details, HttpStatus.UNAUTHORIZED);
        default:
          throw new HttpException(
            grpcError.details,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }
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
