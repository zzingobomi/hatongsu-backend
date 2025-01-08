import { USER_SERVICE, UserMicroservice } from '@app/common';
import { UserPayloadDto } from '@app/common/dto';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class UserService implements OnModuleInit {
  userService: UserMicroservice.UserServiceClient;

  constructor(
    @Inject(USER_SERVICE)
    private readonly userMicroservice: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userService =
      this.userMicroservice.getService<UserMicroservice.UserServiceClient>(
        USER_SERVICE,
      );
  }

  getUserInfo(userPayload: UserPayloadDto) {
    return lastValueFrom(
      this.userService.getUserInfo({ userId: userPayload.sub }),
    );
  }
}
