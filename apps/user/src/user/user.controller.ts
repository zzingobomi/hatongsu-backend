import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { UserMicroservice } from '@app/common';

@Controller()
@UserMicroservice.UserServiceControllerMethods()
export class UserController implements UserMicroservice.UserServiceController {
  constructor(private readonly userService: UserService) {}

  getUserInfo(request: UserMicroservice.GetUserInfoRequest) {
    return this.userService.getUserById(request.userId);
  }

  getUsers(request: UserMicroservice.GetUsersRequest) {
    return this.userService.getUsers({
      page: request.page,
      limit: request.limit,
      filter: request.filter,
      sort: request.sort,
    });
  }
}
