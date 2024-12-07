import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommandBase } from 'src/commons/base/command.base';
import { UserReq } from 'src/commons/UserReq';
import { UserFriendEntity } from 'src/databases/user-friend.entity';
import { Repository } from 'typeorm';

export interface AddFriendCommandPayload {
  user: UserReq;
  friendId: string;
}

@Injectable()
export class AddFriendCommand implements CommandBase<AddFriendCommandPayload> {
  constructor(
    @InjectRepository(UserFriendEntity)
    private readonly userFiendRepository: Repository<UserFriendEntity>,
  ) {}

  async execute(dto: AddFriendCommandPayload) {
    if (+dto.user.id === +dto.friendId) {
      throw new BadRequestException('bạn không thể kết bạn với chính mình');
    }

    let userFriend = await this.userFiendRepository.findOne({
      where: {
        userId: dto.user.id,
        friendId: dto.friendId,
      },
    });
    if (userFriend) {
      return userFriend;
    }

    userFriend = new UserFriendEntity({
      userId: dto.user.id,
      friendId: dto.friendId,
    });
    return this.userFiendRepository.save(userFriend);
  }
}
