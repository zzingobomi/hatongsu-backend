import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@app/common';
import { AppConfig } from '../config/app-config.type';
import { OAuth2Client } from 'google-auth-library';
import * as bcrypt from 'bcrypt';
import { GoogleLoginDto } from './dto/google-login.dto';
import { UserProvider } from '../user/const/user.provider';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

export enum TokenType {
  BASIC = 'basic',
  BEARER = 'bearer',
}

export enum AuthTokenType {
  ACCESS = 'access',
  REFRESH = 'refresh',
}

@Injectable()
export class AuthService {
  private google: OAuth2Client;

  constructor(
    private configService: ConfigService<{ app: AppConfig }>,
    private readonly userService: UserService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {
    this.google = new OAuth2Client(
      configService.get('app.google.clientId', { infer: true }),
      configService.get('app.google.clientSecret', { infer: true }),
    );
  }

  async register(rawToken: string, registerDto: RegisterDto) {
    const { email, password } = this.parseBasicToken(rawToken);

    await this.userService.create({
      ...registerDto,
      email,
      password,
      provider: UserProvider.CREDENTIALS,
    });

    return {
      success: true,
      message: SUCCESS_MESSAGES.USER_REGISTRATION_SUCCESS,
    };
  }

  parseBasicToken(rawToken: string) {
    /// basic $token
    const basicSplit = rawToken.split(' ');

    if (basicSplit.length !== 2) {
      throw new BadRequestException(ERROR_MESSAGES.INVALID_TOKEN_FORMAT);
    }

    const [basic, token] = basicSplit;

    if (basic.toLowerCase() !== TokenType.BASIC) {
      throw new BadRequestException(ERROR_MESSAGES.INVALID_BASIC_TOKEN);
    }

    const decoded = Buffer.from(token, 'base64').toString('utf-8');

    /// username:password
    const tokenSplit = decoded.split(':');

    if (tokenSplit.length !== 2) {
      throw new BadRequestException(ERROR_MESSAGES.INVALID_TOKEN_FORMAT);
    }

    const [email, password] = tokenSplit;

    return { email, password };
  }

  async parseBearerToken(rawToken: string, isRefreshToken: boolean) {
    /// Bearer $token
    const basicSplit = rawToken.split(' ');

    if (basicSplit.length !== 2) {
      throw new BadRequestException(ERROR_MESSAGES.INVALID_TOKEN_FORMAT);
    }

    const [bearer, token] = basicSplit;

    if (bearer.toLowerCase() !== TokenType.BEARER) {
      throw new BadRequestException(ERROR_MESSAGES.INVALID_BEARER_TOKEN);
    }

    try {
      const secret = isRefreshToken
        ? this.configService.getOrThrow('app.refreshTokenSecret', {
            infer: true,
          })
        : this.configService.getOrThrow('app.accessTokenSecret', {
            infer: true,
          });
      const payload = await this.jwtService.verifyAsync(token, { secret });

      if (!isRefreshToken) {
        if (payload.type !== AuthTokenType.ACCESS) {
          throw new BadRequestException(ERROR_MESSAGES.INVALID_ACCESS_TOKEN);
        }
      } else {
        if (payload.type !== AuthTokenType.REFRESH) {
          throw new BadRequestException(ERROR_MESSAGES.INVALID_REFRESH_TOKEN);
        }
      }

      return payload;
    } catch (e) {
      throw new UnauthorizedException(ERROR_MESSAGES.TOKEN_EXPIRED);
    }
  }

  async login(rawToken: string) {
    const { email, password } = this.parseBasicToken(rawToken);

    const user = await this.authenticate(email, password);

    return {
      accessToken: await this.issueToken(user, false),
      refreshToken: await this.issueToken(user, true),
    };
  }

  async authenticate(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        role: true,
        password: true,
      },
    });

    if (!user) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: ERROR_MESSAGES.USER_NOT_FOUND,
      });
    }

    const passOk = await bcrypt.compare(password, user.password);

    if (!passOk) {
      throw new RpcException({
        code: status.UNAUTHENTICATED,
        message: ERROR_MESSAGES.INCORRECT_PASSWORD,
      });
    }

    return user;
  }

  async issueToken(user: any, isRefreshToken: boolean) {
    const accessTokenSecret = this.configService.getOrThrow(
      'app.accessTokenSecret',
      { infer: true },
    );
    const refreshTokenSecret = this.configService.getOrThrow(
      'app.refreshTokenSecret',
      { infer: true },
    );

    return this.jwtService.signAsync(
      {
        sub: user.id ?? user.sub,
        role: user.role,
        type: isRefreshToken ? AuthTokenType.REFRESH : AuthTokenType.ACCESS,
      },
      {
        secret: isRefreshToken ? refreshTokenSecret : accessTokenSecret,
        expiresIn: this.configService.getOrThrow('app.tokenExpireTime', {
          infer: true,
        }),
      },
    );
  }

  async validateGoogleToken(idToken: string) {
    try {
      const ticket = await this.google.verifyIdToken({
        idToken,
        audience: this.configService.get('app.google.clientId', {
          infer: true,
        }),
      });

      const payload = ticket.getPayload();

      if (!payload) {
        throw new UnauthorizedException(ERROR_MESSAGES.INVALID_GOOGLE_TOKEN);
      }

      if (!payload.email_verified) {
        throw new UnauthorizedException(ERROR_MESSAGES.EMAIL_NOT_VERIFIED);
      }

      return {
        success: true,
        message: SUCCESS_MESSAGES.VALIDATE_GOOGLE_TOKEN_SUCCESS,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      console.error('Google token validation error:', error);
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_GOOGLE_TOKEN);
    }
  }

  async loginGoogle(loginDto: GoogleLoginDto) {
    try {
      // 1. 먼저 이메일로 모든 프로바이더의 계정 확인
      let existingUser = null;
      try {
        const { user } = await this.userService.getUserByEmail(loginDto.email);
        existingUser = user;
      } catch (error) {
        if (!(error instanceof BadRequestException)) {
          throw error;
        }
      }

      // 2. 이메일은 있지만 다른 프로바이더로 가입한 경우
      if (existingUser && existingUser.provider !== UserProvider.GOOGLE) {
        throw new ConflictException(
          `This email is already registered with ${existingUser.provider}. Please use that login method.`,
        );
      }

      // 3. Google 계정으로 이미 가입한 경우 -> 로그인 처리
      if (existingUser && existingUser.provider === UserProvider.GOOGLE) {
        return {
          accessToken: await this.issueToken(existingUser, false),
          refreshToken: await this.issueToken(existingUser, true),
        };
      }

      // 4. 새 계정 생성 (Google 프로바이더로 최초 가입)
      const newUser = await this.userService.create({
        email: loginDto.email,
        nickname: loginDto.nickname,
        password: 'google',
        profile: loginDto.profile,
        provider: UserProvider.GOOGLE,
      });

      return {
        accessToken: await this.issueToken(newUser, false),
        refreshToken: await this.issueToken(newUser, true),
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      console.error(`Google login failed: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to process Google login');
    }
  }
}
