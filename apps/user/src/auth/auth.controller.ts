import { Controller, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ERROR_MESSAGES, UserMicroservice } from '@app/common';

@Controller('auth')
@UserMicroservice.AuthServiceControllerMethods()
export class AuthController implements UserMicroservice.AuthServiceController {
  constructor(private readonly authService: AuthService) {}

  registerUser(request: UserMicroservice.RegisterUserRequest) {
    const { credentials } = request;

    if (credentials === null) {
      throw new UnauthorizedException(ERROR_MESSAGES.UNAUTHORIZED_TOKEN);
    }

    return this.authService.register(credentials, request);
  }

  loginUser(loginDto: UserMicroservice.LoginUserRequest) {
    const { credentials } = loginDto;

    if (credentials === null) {
      throw new UnauthorizedException(ERROR_MESSAGES.UNAUTHORIZED_TOKEN);
    }

    return this.authService.login(credentials);
  }

  parseBearerToken(request: UserMicroservice.ParseBearerTokenRequest) {
    return this.authService.parseBearerToken(request.token, false);
  }
}
