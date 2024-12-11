import { RoomStatus } from './../../game-manager/room/room.interface';
import { randomUUID } from 'crypto';
import { Server, Socket } from 'socket.io';
import { socketEmitError } from 'src/commons/utils/socket-error';
import { GameStateManager } from 'src/game-manager/game-state/game-state.manager';
import { GameEventClient } from 'src/game-manager/game.event';
import { RoomGameManager } from 'src/game-manager/room/room.manager';
import { UserGameStatus } from 'src/game-manager/user/user.interface';
import { UserGameManager } from 'src/game-manager/user/user.manager';
import { CommandBase } from './../../commons/base/command.base';
import { SocketToUser, UserToSocket } from './../../game-manager/game.manager';
import { generateRandom6Digits } from 'src/commons/utils/random';

export interface CreateRoomCommandPayload {
  client: Socket;
}

export class CreateRoomCommand
  implements CommandBase<CreateRoomCommandPayload>
{
  constructor(
    private readonly userToSocket: UserToSocket,
    private readonly socketToUser: SocketToUser,
    private userManager: UserGameManager,
    private roomManager: RoomGameManager,
    private gameStateManager: GameStateManager,
    private server: Server,
  ) {}

  async execute(payload: CreateRoomCommandPayload): Promise<any> {
    const { client } = payload;

    const userId = this.socketToUser[client.id];
    const user = this.userManager.getUserById(userId);
    if (user.status === UserGameStatus.IN_ROOM) {
      return socketEmitError(client, 'user-đã-ở-trong-room');
    }
    if (user.status !== UserGameStatus.ONLINE) {
      return socketEmitError(client, 'user-đang-không-online');
    }

    const checkRoomExists = this.roomManager.findRoomByPlayerId(userId);
    if (checkRoomExists) {
      return socketEmitError(client, 'user-đã-ở-trong-room');
    }

    const roomId = generateRandom6Digits();
    const room = this.roomManager.createRoom({
      id: roomId,
      ownerId: userId,
      playerIds: [userId],
      status: RoomStatus.PENDING,
      createdAt: new Date(),
    });
    user.status = UserGameStatus.IN_ROOM;

    // gửi message tạo room thành công
    client.emit(
      GameEventClient.ROOM_INFORMATION,
      this.roomManager.getRoomInfo(roomId),
    );
    client.join(roomId);

    return room;
  }
}
