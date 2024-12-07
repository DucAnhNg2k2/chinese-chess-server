import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommandBase } from 'src/commons/base/command.base';
import { UserReq } from 'src/commons/UserReq';
import { UserProfileEntity } from 'src/databases/user-profile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GetUserProfileCommand implements CommandBase<UserReq> {
  constructor(
    @InjectRepository(UserProfileEntity)
    private readonly userProfileRepository: Repository<UserProfileEntity>,
  ) {}

  async execute(dto: UserReq) {
    const data = await this.userProfileRepository.findOne({
      where: { userId: dto.id },
    });

    return new UserProfileEntity({
      userId: dto.id,
      fullName: data?.fullName ?? '',
      address: data?.address ?? '',
      phoneNumber: data?.phoneNumber ?? '',
      avatar: data?.avatar ?? '',
      totalWins: data?.totalGames ?? 0,
      totalLoses: data?.totalLoses ?? 0,
      totalGames: data?.totalGames ?? 0,
    });
  }
}
