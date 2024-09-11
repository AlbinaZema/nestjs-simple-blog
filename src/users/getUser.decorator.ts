import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument } from './schemas/user.schema';
import { GqlExecutionContext } from '@nestjs/graphql';

export const GetUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): UserDocument => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  },
);
