import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommandBase } from 'src/commons/base/command.base';
import { UserReq } from 'src/commons/UserReq';
import { UserProfileEntity } from 'src/databases/user-profile.entity';
import { Repository } from 'typeorm';

export interface GetUserProfileCommandPayload {
  user: UserReq;
  phoneNumber: string;
}

@Injectable()
export class GetListUserCommand
  implements CommandBase<GetUserProfileCommandPayload>
{
  constructor(
    @InjectRepository(UserProfileEntity)
    private readonly userProfileRepository: Repository<UserProfileEntity>,
  ) {}

  async execute(dto: GetUserProfileCommandPayload) {
    const qb = this.userProfileRepository.createQueryBuilder('userProfile');
    qb.andWhere('userProfile.userId != :userId', { userId: dto.user.id });

    if (dto.phoneNumber) {
      qb.andWhere('userProfile.phoneNumber like :phoneNumber', {
        phoneNumber: `%${dto.phoneNumber}%`,
      });
    }

    return qb.getMany();
  }
}
