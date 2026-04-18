import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import type { Request } from 'express';
import { User } from '../../../generated/prisma/browser';

export const Authorized = createParamDecorator(
  (data: keyof User, ctx: ExecutionContext) => {
    const request = GqlExecutionContext.create(ctx).getContext().req as Request;
    // request.user появляется после успешного прохождения JwtGuard/JwtStrategy.
    const user = request.user;

    return data ? user![data] : user;
  },
);
