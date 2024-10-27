import { MessageJoinRoomDto } from 'src/game-manager/dtos/message-join-room.dto';
import { Socket } from 'socket.io';
import { CommandBase } from 'src/commons/base/command.base';
import { SocketToUser, UserToSocket } from 'src/game-manager/game.manager';
import { UserGameManager } from 'src/game-manager/user/user.manager';
import { RoomGameManager } from 'src/game-manager/room/room.manager';
import { GameStateManager } from 'src/game-manager/game-state/game-state.manager';
import { socketEmitError } from 'src/commons/utils/socket-error';
import { UserGameStatus } from 'src/game-manager/user/user.interface';

export interface JoinRoomCommandPayload {
  dto: MessageJoinRoomDto;
  client: Socket;
}

export class JoinRoomCommand implements CommandBase<JoinRoomCommandPayload> {
  constructor(
    private readonly userToSocket: UserToSocket,
    private readonly socketToUser: SocketToUser,
    private userManager: UserGameManager,
    private roomManager: RoomGameManager,
    private gameStateManager: GameStateManager,
  ) {}

  async execute(payload: JoinRoomCommandPayload) {
    const { dto, client } = payload;

    const userId = this.socketToUser[client.id];
    const user = this.userManager.getUserById(userId);
    if (user.status !== UserGameStatus.ONLINE) {
      return socketEmitError(client, 'user-đang-không-online');
    }

    const room = this.roomManager.getRoomById(dto.roomId);
    if (!room) {
      return socketEmitError(client, 'room-không-tồn-tại');
    }

    room.playerIds = [...room.playerIds, userId];
    user.status = UserGameStatus.IN_ROOM;

    client.join(dto.roomId);
  }
}
