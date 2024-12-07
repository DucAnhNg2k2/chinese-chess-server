import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/databases/user.entity';
import { AuthLoginCommand } from './auth-login.command';
import { AuthRegisterCommand } from './auth-register.command';
import { JwtCoreModule } from 'src/modules/jwt/jwt.core.module';
import { UserProfileEntity } from 'src/databases/user-profile.entity';

const command = [AuthLoginCommand, AuthRegisterCommand];
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserProfileEntity]),
    JwtCoreModule,
  ],
  exports: [...command],
  providers: [...command],
})
export class AuthCommandModule {}
