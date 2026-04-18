import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../../../generated/prisma/enums';
import { User } from '../../../generated/prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesContext = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!rolesContext) return true;

    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    const user = request.user as User;

    if (!rolesContext.includes(user.role))
      throw new ForbiddenException('У вас недостаточно прав');

    return true;
  }
}
