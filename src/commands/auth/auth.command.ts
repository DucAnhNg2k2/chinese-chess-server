import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/databases/user.entity';
import { AuthLoginCommand } from './auth-login.command';
import { AuthRegisterCommand } from './auth-register.command';
import { JwtCoreModule } from 'src/modules/jwt/jwt.core.module';

const command = [AuthLoginCommand, AuthRegisterCommand];
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), JwtCoreModule],
  exports: [...command],
  providers: [...command],
})
export class AuthCommandModule {}
