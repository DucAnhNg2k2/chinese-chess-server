import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { UserReq } from 'src/commons/UserReq';

@Injectable()
export class JwtCoreService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  signAccessToken(id: string) {
    const payload = { id, jti: randomUUID() };
    const token = this.jwtService.sign(JSON.stringify(payload), {
      secret: this.configService.get('JWT_SECRET'),
    });

    return {
      accessToken: token,
    };
  }

  verify(token: string) {
    const payload = this.jwtService.verify(token, {
      secret: this.configService.get('JWT_SECRET'),
    });
    const user: UserReq = payload;
    return user;
  }
}
