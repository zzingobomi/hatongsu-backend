import {
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { TokenGuard } from '../auth/guard/token.huard';
import { UserPayload } from '../auth/decorator/user-payload.decorator';
import { UserPayloadDto } from '@app/common/dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(TokenGuard)
  async getUserInfo(@UserPayload() userPayload: UserPayloadDto) {
    return this.userService.getUserInfo(userPayload);
  }
}
