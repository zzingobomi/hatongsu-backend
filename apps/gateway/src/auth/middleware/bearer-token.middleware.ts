import { AUTH_SERVICE, USER_SERVICE, UserMicroservice } from '@app/common';
import {
  Inject,
  Injectable,
  NestMiddleware,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class BearerTokenMiddleware implements NestMiddleware, OnModuleInit {
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

  async use(req: any, res: any, next: (error?: Error | any) => void) {
    const token = this.getRawToken(req);
    if (!token) {
      next();
      return;
    }

    const payload = await this.verifyToken(token);
    req.user = payload;

    next();
  }

  getRawToken(req: any): string | null {
    const authHeader = req.headers['authorization'];
    return authHeader;
  }

  async verifyToken(token: string) {
    const result = await lastValueFrom(
      this.authService.parseBearerToken({ token }),
    );

    return result;
  }
}
