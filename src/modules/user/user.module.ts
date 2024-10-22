import { Module } from '@nestjs/common';
import { UserCommandModule } from 'src/commands/user/user.command';
import { UserController } from './user.controller';

@Module({
  imports: [UserCommandModule],
  controllers: [UserController],
})
export class UserModule {}
