import { Module } from '@nestjs/common';
import { UpdateUserProfileCommand } from './update-user-profile.command';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfileEntity } from 'src/databases/user-profile.entity';
import { GetUserProfileCommand } from './get-user-profile.command';
import { GetListUserCommand } from './get-list-user.command';

const commands = [
  UpdateUserProfileCommand,
  GetUserProfileCommand,
  GetListUserCommand,
];

@Module({
  imports: [TypeOrmModule.forFeature([UserProfileEntity])],
  providers: [...commands],
  exports: [...commands],
})
export class UserCommandModule {}
