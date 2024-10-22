import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UserReq } from '../UserReq';
import { PUBLIC_ENDPOINT } from './public-endpoint.guard';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      PUBLIC_ENDPOINT,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      return true;
    }

    const req: Request = context.switchToHttp().getRequest();
    if (!req.headers['user']) {
      throw new BadRequestException('invalid_user');
    }

    const userReq = JSON.parse(req.headers['user'] as string) as UserReq;
    if (!userReq) {
      throw new BadRequestException('invalid_user');
    }

    return true;
  }
}
