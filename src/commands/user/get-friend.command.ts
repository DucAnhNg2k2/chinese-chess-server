import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommandBase } from 'src/commons/base/command.base';
import { UserReq } from 'src/commons/UserReq';
import { UserFriendEntity } from 'src/databases/user-friend.entity';
import { Repository } from 'typeorm';

export interface GetFriendCommandPayload {
  user: UserReq;
}

@Injectable()
export class GetFriendCommand implements CommandBase<GetFriendCommandPayload> {
  constructor(
    @InjectRepository(UserFriendEntity)
    private readonly userFiendRepository: Repository<UserFriendEntity>,
  ) {}

  async execute(dto: GetFriendCommandPayload) {
    const qb = this.userFiendRepository.createQueryBuilder('userFriend');
    qb.where('userFriend.userId = :userId', { userId: dto.user.id });
    qb.leftJoinAndSelect('userFriend.friend', 'friend');
    return qb.getMany();
  }
}