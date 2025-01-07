import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@app/common';

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
  constructor(
    private readonly userService: UserService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async register(rawToken: string, registerDto: RegisterDto) {
    try {
      const { email, password } = this.parseBasicToken(rawToken);

      await this.userService.create({
        ...registerDto,
        email,
        password,
      });

      return {
        success: true,
        message: SUCCESS_MESSAGES.USER_REGISTRATION_SUCCESS,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || ERROR_MESSAGES.USER_REGISTRATION_FAILED,
      };
    }
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
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.getOrThrow<string>(
          isRefreshToken ? 'REFRESH_TOKEN_SECRET' : 'ACCESS_TOKEN_SECRET',
        ),
      });

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
        password: true,
      },
    });

    if (!user) {
      throw new BadRequestException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const passOk = await bcrypt.compare(password, user.password);

    if (!passOk) {
      throw new BadRequestException(ERROR_MESSAGES.INCORRECT_PASSWORD);
    }

    return user;
  }

  async issueToken(user: any, isRefreshToken: boolean) {
    const accessTokenSecret = this.configService.getOrThrow<string>(
      'ACCESS_TOKEN_SECRET',
    );
    const refreshTokenSecret = this.configService.getOrThrow<string>(
      'REFRESH_TOKEN_SECRET',
    );

    return this.jwtService.signAsync(
      {
        sub: user.id ?? user.sub,
        role: user.role,
        type: isRefreshToken ? AuthTokenType.REFRESH : AuthTokenType.ACCESS,
      },
      {
        secret: isRefreshToken ? refreshTokenSecret : accessTokenSecret,
        expiresIn: '3600h',
      },
    );
  }
}
