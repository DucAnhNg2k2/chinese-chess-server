import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommandBase } from 'src/commons/base/command.base';
import { UserReq } from 'src/commons/UserReq';
import { UserProfileEntity } from 'src/databases/user-profile.entity';
import { Repository } from 'typeorm';

export interface UpdateUserProfileCommandParams {
  user: UserReq;
  fullName: string;
  address: string;
  phoneNumber: string;
  avatar: string;
}

@Injectable()
export class UpdateUserProfileCommand
  implements CommandBase<UpdateUserProfileCommandParams>
{
  constructor(
    @InjectRepository(UserProfileEntity)
    private readonly userProfileRepository: Repository<UserProfileEntity>,
  ) {}

  async execute(dto: UpdateUserProfileCommandParams) {
    const userProfile = await this.userProfileRepository.findOne({
      where: { userId: dto.user.id },
    });

    if (!userProfile) {
      return await this.userProfileRepository.save(
        new UserProfileEntity({
          address: dto.address,
          fullName: dto.fullName,
          phoneNumber: dto.phoneNumber,
          userId: dto.user.id,
          avatar: dto.avatar,
        }),
      );
    }

    userProfile.fullName = dto.fullName;
    userProfile.address = dto.address;
    userProfile.phoneNumber = dto.phoneNumber;
    userProfile.avatar = dto.avatar;

    return this.userProfileRepository.save(userProfile);
  }
}
