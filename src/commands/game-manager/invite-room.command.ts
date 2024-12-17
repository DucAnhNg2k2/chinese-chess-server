import { Server, Socket } from 'socket.io';
import { CommandBase } from 'src/commons/base/command.base';
import { socketEmitError } from 'src/commons/utils/socket-error';
import { InviteRoomDto } from 'src/game-manager/dtos/invite-room.dto';
import { GameStateManager } from 'src/game-manager/game-state/game-state.manager';
import { GameEventClient } from 'src/game-manager/game.event';
import { SocketToUser, UserToSocket } from 'src/game-manager/game.manager';
import { RoomStatus } from 'src/game-manager/room/room.interface';
import { RoomGameManager } from 'src/game-manager/room/room.manager';
import { UserGameStatus } from 'src/game-manager/user/user.interface';
import { UserGameManager } from 'src/game-manager/user/user.manager';

export interface InviteRoomCommandPayload {
  client: Socket;
  dto: InviteRoomDto;
}

export class InviteRoomCommand
  implements CommandBase<InviteRoomCommandPayload>
{
  constructor(
    private readonly userToSocket: UserToSocket,
    private readonly socketToUser: SocketToUser,
    private userManager: UserGameManager,
    private roomManager: RoomGameManager,
    private gameStateManager: GameStateManager,
    private server: Server,
  ) {}

  execute(payload: InviteRoomCommandPayload) {
    const { dto, client } = payload;
    const { inviteeId } = dto;
    // Check xem user có tồn tại không
    const userId = this.socketToUser[client.id];
    const user = this.userManager.getUserById(userId);
    if (!user) {
      return socketEmitError(client, 'user-không-tồn-tại');
    }
    if (user.status === UserGameStatus.IN_GAME) {
      return socketEmitError(client, 'user-đã-ở-trong-game');
    }

    // Check xem room có tồn tại không
    const room = this.roomManager.findRoomByPlayerId(userId);
    if (!room) {
      return socketEmitError(client, 'room-không-tồn-tại');
    }
    if (room.status === RoomStatus.PLAYING) {
      return socketEmitError(client, 'room-đang-chơi');
    }

    // Mời bạn bè vào trận
    const invitee = this.userManager.getUserById(inviteeId);
    if (!invitee) {
      return socketEmitError(client, 'bạn mời đang không online');
    }
    if (invitee.status !== UserGameStatus.ONLINE) {
      return socketEmitError(
        client,
        'trạng thái của bạn mời đang không online',
      );
    }

    const inviterSocket = this.userToSocket[inviteeId];
    inviterSocket.emit(GameEventClient.INVITE_FRIEND, {
      inviter: this.userManager.getUserById(userId),
      room: this.roomManager.getRoomInfo(room.id),
    });
  }
}
