import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommandBase } from 'src/commons/base/command.base';
import { UserReq } from 'src/commons/UserReq';
import { UserFriendEntity } from 'src/databases/user-friend.entity';
import { Repository } from 'typeorm';

export interface UnFriendCommandPayload {
  user: UserReq;
  friendId: string;
}

@Injectable()
export class UnFriendCommand implements CommandBase<UnFriendCommandPayload> {
  constructor(
    @InjectRepository(UserFriendEntity)
    private readonly userFiendRepository: Repository<UserFriendEntity>,
  ) {}

  async execute(dto: UnFriendCommandPayload) {
    const userFriend = await this.userFiendRepository.findOne({
      where: {
        userId: dto.user.id,
        friendId: dto.friendId,
      },
    });
    if (!userFriend) {
      throw new NotFoundException('Không tìm thấy bạn bè');
    }
    return this.userFiendRepository.remove(userFriend);
  }
}
