import { MessageJoinRoomDto } from 'src/game-manager/dtos/message-join-room.dto';
import { Server, Socket } from 'socket.io';
import { CommandBase } from 'src/commons/base/command.base';
import { SocketToUser, UserToSocket } from 'src/game-manager/game.manager';
import { UserGameManager } from 'src/game-manager/user/user.manager';
import { RoomGameManager } from 'src/game-manager/room/room.manager';
import { GameStateManager } from 'src/game-manager/game-state/game-state.manager';
import { socketEmitError } from 'src/commons/utils/socket-error';
import { UserGameStatus } from 'src/game-manager/user/user.interface';
import { GameEventClient } from 'src/game-manager/game.event';

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
    private server: Server,
  ) {}

  async execute(payload: JoinRoomCommandPayload) {
    const { dto, client } = payload;

    const userId = this.socketToUser[client.id];
    const user = this.userManager.getUserById(userId);
    if (user.status === UserGameStatus.IN_ROOM) {
      return socketEmitError(client, 'user-đã-ở-trong-room');
    }
    if (user.status !== UserGameStatus.ONLINE) {
      return socketEmitError(client, 'user-đang-không-online');
    }

    const room = this.roomManager.getRoomById(dto.roomId);
    if (!room) {
      return socketEmitError(client, 'room-không-tồn-tại');
    }

    room.playerIds = [...room.playerIds, userId];
    user.status = UserGameStatus.IN_ROOM;

    // gửi message room cho tất cả người chơi trong room
    this.server.to(room.id).emit(GameEventClient.PLAYER_JOIN_ROOM, userId);

    client.join(dto.roomId);
    client.emit(
      GameEventClient.ROOM_INFORMATION,
      this.roomManager.getRoomInfo(dto.roomId),
    );
    return room;
  }
}
