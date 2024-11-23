import { MessageJoinRoomDto } from 'src/game-manager/dtos/message-join-room.dto';
import { Socket } from 'socket.io';
import { CommandBase } from 'src/commons/base/command.base';
import { SocketToUser, UserToSocket } from 'src/game-manager/game.manager';
import { UserGameManager } from 'src/game-manager/user/user.manager';
import { RoomGameManager } from 'src/game-manager/room/room.manager';
import { GameStateManager } from 'src/game-manager/game-state/game-state.manager';
import { socketEmitError } from 'src/commons/utils/socket-error';
import { UserGameStatus } from 'src/game-manager/user/user.interface';
import { MessageLeaveRoomDto } from 'src/game-manager/dtos/message-leave-room.dto';

export interface LeaveRoomCommandPayload {
  dto: MessageLeaveRoomDto;
  client: Socket;
}

export class LeaveRoomCommand implements CommandBase<LeaveRoomCommandPayload> {
  constructor(
    private readonly userToSocket: UserToSocket,
    private readonly socketToUser: SocketToUser,
    private userManager: UserGameManager,
    private roomManager: RoomGameManager,
    private gameStateManager: GameStateManager,
  ) {}

  async execute(payload: LeaveRoomCommandPayload) {
    const { dto, client } = payload;

    const userId = this.socketToUser[client.id];
    const user = this.userManager.getUserById(userId);
    if (user.status === UserGameStatus.ONLINE) {
      return socketEmitError(client, 'user-đang-không-trong-room');
    }

    const room = this.roomManager.findRoomByPlayerId(userId);
    if (!room) {
      return socketEmitError(client, 'user-không-ở-trong-room');
    }

    room.playerIds = room.playerIds.filter((playerId) => playerId !== userId);
    user.status = UserGameStatus.ONLINE;

    if (room.playerIds.length === 0) {
      this.roomManager.deleteRoom(room.id);
    }

    client.leave(room.id);
  }
}
