import { ERROR_MESSAGES } from '@app/common';
import { UserPayloadDto } from '@app/common/dto';
import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const UserPayload = createParamDecorator<UserPayloadDto>(
  (data: any, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();

    const { user } = req;

    if (!user) {
      throw new InternalServerErrorException(
        ERROR_MESSAGES.TOKEN_GUARD_MISSING,
      );
    }

    return req.user;
  },
);
