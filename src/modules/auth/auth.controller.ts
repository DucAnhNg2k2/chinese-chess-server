import { Body, Controller, Post } from '@nestjs/common';
import { AuthLoginDto } from './dtos/auth-login.dto';
import { AuthLoginCommand } from 'src/commands/auth/auth-login.command';
import { AuthRegisterDto } from './dtos/auth-register.dto';
import { AuthRegisterCommand } from 'src/commands/auth/auth-register.command';

@Controller('auth')
export class AuthController {
  constructor(
    private authLoginCommand: AuthLoginCommand,
    private authRegisterCommand: AuthRegisterCommand,
  ) {}

  @Post('login')
  async login(@Body() dto: AuthLoginDto) {
    return this.authLoginCommand.execute(dto);
  }

  @Post('register')
  async register(@Body() dto: AuthRegisterDto) {
    return this.authRegisterCommand.execute(dto);
  }
}
