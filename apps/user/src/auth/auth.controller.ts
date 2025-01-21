import { Controller, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ERROR_MESSAGES, UserMicroservice } from '@app/common';
import { Metadata } from '@grpc/grpc-js';
import { Observable } from 'rxjs';

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

  validateGoogleToken(request: UserMicroservice.ValidateGoogleTokenRequest) {
    return this.authService.validateGoogleToken(request.idToken);
  }

  loginGoogle(request: UserMicroservice.LoginGoogleRequest) {
    return this.authService.loginGoogle(request);
  }
}
