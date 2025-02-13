import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../const/user.role';
import { ROLE_KEY } from '../decorator/role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride<UserRole>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRole) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user?.role) {
      throw new ForbiddenException('No permission');
    }

    const hasPermission = requiredRole === user.role;
    if (!hasPermission) {
      throw new ForbiddenException('No permission');
    }

    return true;
  }
}
