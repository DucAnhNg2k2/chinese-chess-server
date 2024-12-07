import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { GetUserProfileCommand } from 'src/commands/user/get-user-profile.command';
import { UpdateUserProfileCommand } from 'src/commands/user/update-user-profile.command';
import { User } from 'src/commons/decorators/user.decorator';
import { UserReq } from 'src/commons/UserReq';
import { UpdateUserProfileDto } from './dtos/update-user-profile.dto';
import { GetListUserCommand } from 'src/commands/user/get-list-user.command';

@Controller('users')
export class UserController {
  constructor(
    private updateUserProfileCommand: UpdateUserProfileCommand,
    private getUserProfileCommand: GetUserProfileCommand,
    private getListUserCommand: GetListUserCommand,
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
  async addFriend(@User() user: UserReq, @Body() dto: { friendId: string }) {
    return this.updateUserProfileCommand.addFriend(user, dto.friendId);
  }
}
