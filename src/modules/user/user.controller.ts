import { Body, Controller, Get, Post } from '@nestjs/common';
import { GetUserProfileCommand } from 'src/commands/user/get-user-profile.command';
import { UpdateUserProfileCommand } from 'src/commands/user/update-user-profile.command';
import { User } from 'src/commons/decorators/user.decorator';
import { UserReq } from 'src/commons/UserReq';
import { UpdateUserProfileDto } from './dtos/update-user-profile.dto';

@Controller('users')
export class UserController {
  constructor(
    private updateUserProfileCommand: UpdateUserProfileCommand,
    private getUserProfileCommand: GetUserProfileCommand,
  ) {}

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
}
