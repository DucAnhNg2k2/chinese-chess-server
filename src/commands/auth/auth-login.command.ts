import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommandBase } from 'src/commons/base/command.base';
import { UserEntity } from 'src/databases/user.entity';
import { AuthLoginDto } from 'src/modules/auth/dtos/auth-login.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtCoreService } from 'src/modules/jwt/jwt.core.service';

@Injectable()
export class AuthLoginCommand implements CommandBase<AuthLoginDto> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtCoreService: JwtCoreService,
  ) {}

  async execute(dto: AuthLoginDto) {
    const user = await this.userRepository.findOne({
      where: { username: dto.username },
    });
    if (!user) {
      throw new BadRequestException('username_not_found');
    }

    const isPasswordMatch = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordMatch) {
      throw new BadRequestException('password_not_match');
    }

    const { accessToken } = this.jwtCoreService.signAccessToken(user.id);
    user.accessToken = accessToken;
    await this.userRepository.save(user);

    return { accessToken };
  }
}
