import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/databases/user.entity';
import { AuthLoginCommand } from './auth-login.command';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  exports: [AuthLoginCommand],
  providers: [AuthLoginCommand],
})
export class AuthCommandModule {}
