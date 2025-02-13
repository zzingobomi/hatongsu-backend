import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { TokenGuard } from '../auth/guard/token.guard';
import { UserPayload } from '../auth/decorator/user-payload.decorator';
import { UserPayloadDto } from '@app/common/dto';
import { QueryUserDto } from './dto/query-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(TokenGuard)
  async getUserInfo(@UserPayload() userPayload: UserPayloadDto) {
    return this.userService.getUserInfo(userPayload);
  }

  @Get('all')
  @UseGuards(TokenGuard)
  async getUsers(
    @UserPayload() userPayload: UserPayloadDto,
    @Query() query: QueryUserDto,
  ) {
    return this.userService.getUsers(query);
  }
}
