import { Module } from '@nestjs/common';
import { UpdateUserProfileCommand } from './update-user-profile.command';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfileEntity } from 'src/databases/user-profile.entity';
import { GetUserProfileCommand } from './get-user-profile.command';
import { GetListUserCommand } from './get-list-user.command';
import { UserFriendEntity } from 'src/databases/user-friend.entity';
import { AddFriendCommand } from './add-friend.command';

const commands = [
  UpdateUserProfileCommand,
  GetUserProfileCommand,
  GetListUserCommand,
  AddFriendCommand,
];

@Module({
  imports: [TypeOrmModule.forFeature([UserProfileEntity, UserFriendEntity])],
  providers: [...commands],
  exports: [...commands],
})
export class UserCommandModule {}
