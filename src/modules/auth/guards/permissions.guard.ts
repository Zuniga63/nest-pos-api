import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'src/modules/users/schema/user.schema';
import { PERMISSIONS_KEY } from '../decorators/required-permissions.decorator';
import { Permission } from '../permission.enum';

@Injectable()
export class PermissionsGuards implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(contex: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [contex.getHandler(), contex.getClass()]
    );

    if (!requiredPermissions) return true;

    const req = contex.switchToHttp().getRequest();
    const { user } = contex.switchToHttp().getRequest();

    console.log(req, user, Object.keys(user));
    if (user && (user as User).isAdmin) return true;

    if (user.role && user.role.permissions?.length > 0) {
      return requiredPermissions.every((permission) =>
        user.role.permissions?.includes(permission)
      );
    }

    return false;
  }
}
