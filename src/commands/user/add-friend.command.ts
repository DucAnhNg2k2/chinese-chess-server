import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommandBase } from 'src/commons/base/command.base';
import { UserReq } from 'src/commons/UserReq';
import { UserProfileEntity } from 'src/databases/user-profile.entity';
import { Repository } from 'typeorm';

export interface AddFriendCommandPayload {
  user: UserReq;
  phoneNumber: string;
}

@Injectable()
export class AddFriendCommand implements CommandBase<AddFriendCommandPayload> {
  constructor(
    @InjectRepository(UserProfileEntity)
    private readonly userProfileRepository: Repository<UserProfileEntity>,
  ) {}

  async execute(dto: AddFriendCommandPayload) {
    const qb = this.userProfileRepository.createQueryBuilder('userProfile');
    if (dto.phoneNumber) {
      qb.andWhere('userProfile.phoneNumber like :phoneNumber', {
        phoneNumber: dto.phoneNumber,
      });
    }
    return qb.getMany();
  }
}
