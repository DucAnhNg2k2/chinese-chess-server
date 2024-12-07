import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommandBase } from 'src/commons/base/command.base';
import { UserEntity } from 'src/databases/user.entity';
import { AuthRegisterDto } from 'src/modules/auth/dtos/auth-register.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtCoreService } from 'src/modules/jwt/jwt.core.service';
import { UserProfileEntity } from 'src/databases/user-profile.entity';

@Injectable()
export class AuthRegisterCommand implements CommandBase<AuthRegisterDto> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtCoreService: JwtCoreService,
    @InjectRepository(UserProfileEntity)
    private readonly userProfileRepository: Repository<UserProfileEntity>,
  ) {}

  async execute(dto: AuthRegisterDto) {
    const password = bcrypt.hashSync(dto.password, 10);
    const user = await this.userRepository.save(
      new UserEntity({
        username: dto.username,
        password,
      }),
    );
    // generate token
    const { accessToken } = this.jwtCoreService.signAccessToken(user.id);
    user.accessToken = accessToken;

    await this.userRepository.save(user);
    await this.userProfileRepository.save(
      new UserProfileEntity({
        userId: user.id,
        fullName: '',
        phoneNumber: '',
        address: '',
      }),
    );
    return { accessToken };
  }
}
