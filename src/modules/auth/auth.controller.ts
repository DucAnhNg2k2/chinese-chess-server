import { Body, Controller, Post } from '@nestjs/common';
import { AuthLoginDto } from './dtos/auth-login.dto';
import { AuthLoginCommand } from 'src/commands/auth/auth-login.command';

@Controller('auth')
export class AuthController {
  constructor(private authLoginCommand: AuthLoginCommand) {}

  @Post('login')
  async login(@Body() dto: AuthLoginDto) {
    return this.authLoginCommand.execute(dto);
  }
}
