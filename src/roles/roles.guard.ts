import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Role } from '../enums/role.enum';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export default class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean {
    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const user = GqlExecutionContext.create(context).getContext().req.user;
    console.log('roles guard - user', user);
    console.log('roles guard - roles', roles);
    return true;
  }
}
