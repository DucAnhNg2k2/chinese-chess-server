import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { GetUserProfileCommand } from 'src/commands/user/get-user-profile.command';
import { UpdateUserProfileCommand } from 'src/commands/user/update-user-profile.command';
import { User } from 'src/commons/decorators/user.decorator';
import { UserReq } from 'src/commons/UserReq';
import { UpdateUserProfileDto } from './dtos/update-user-profile.dto';
import { GetListUserCommand } from 'src/commands/user/get-list-user.command';
import { AddFriendCommand } from 'src/commands/user/add-friend.command';
import { AddFriendDto } from './dtos/add-friend.dto';

@Controller('users')
export class UserController {
  constructor(
    private updateUserProfileCommand: UpdateUserProfileCommand,
    private getUserProfileCommand: GetUserProfileCommand,
    private getListUserCommand: GetListUserCommand,
    private addFriendCommand: AddFriendCommand,
  ) {}

  @Get('')
  async getUsers(
    @User() user: UserReq,
    @Query('phoneNumber') phoneNumber: string,
  ) {
    return this.getListUserCommand.execute({ user, phoneNumber });
  }

  @Post('profile')
  async getProfile(@User() user: UserReq, @Body() dto: UpdateUserProfileDto) {
    return this.updateUserProfileCommand.execute({
      ...dto,
      user,
    });
  }

  @Get('profile')
  async updateProfile(@User() user: UserReq) {
    return this.getUserProfileCommand.execute(user);
  }

  @Post('add-friend')
  async addFriend(@User() user: UserReq, @Body() dto: AddFriendDto) {
    return this.addFriendCommand.execute({
      user,
      friendId: dto.friendId,
    });
  }
}
