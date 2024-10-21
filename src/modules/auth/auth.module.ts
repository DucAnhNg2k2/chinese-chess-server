import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthCommandModule } from 'src/commands/auth/auth.command';

@Module({
  imports: [AuthCommandModule],
  controllers: [AuthController],
  providers: [],
  exports: [],
})
export class AuthModule {}
