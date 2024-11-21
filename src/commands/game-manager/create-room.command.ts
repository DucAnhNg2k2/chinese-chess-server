import { randomUUID } from 'crypto';
import { Socket } from 'socket.io';
import { socketEmitError } from 'src/commons/utils/socket-error';
import { GameStateManager } from 'src/game-manager/game-state/game-state.manager';
import { RoomGameManager } from 'src/game-manager/room/room.manager';
import { UserGameStatus } from 'src/game-manager/user/user.interface';
import { UserGameManager } from 'src/game-manager/user/user.manager';
import { CommandBase } from './../../commons/base/command.base';
import { SocketToUser, UserToSocket } from './../../game-manager/game.manager';
import { Room } from 'src/game-manager/room/room.interface';

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
  ) {}

  async execute(payload: CreateRoomCommandPayload): Promise<any> {
    const { client } = payload;

    const userId = this.socketToUser[client.id];
    const user = this.userManager.getUserById(userId);
    if (user.status !== UserGameStatus.ONLINE) {
      return socketEmitError(client, 'user-đang-không-online');
    }

    const roomId = randomUUID();
    const room = this.roomManager.createRoom({
      id: roomId,
      ownerId: userId,
      playerIds: [userId],
    });
    user.status = UserGameStatus.IN_ROOM;

    client.join(roomId);
    return room;
  }
}
