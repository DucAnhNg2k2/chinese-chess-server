import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { JwtCoreService } from 'src/modules/jwt/jwt.core.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtCoreService: JwtCoreService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const bearerToken = req.headers?.['authorization'];
    if (!bearerToken) {
      return next();
    }

    const token = bearerToken.split(' ')[1];
    const user = this.jwtCoreService.verify(token);
    if (!user) {
      throw new ForbiddenException('token-is-invalid');
    }
    req.headers['user'] = JSON.stringify(user);
    next();
  }
}
