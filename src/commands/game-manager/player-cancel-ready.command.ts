import { MessagePlayerCancelReadyGameDto } from 'src/game-manager/dtos/player-cancel-ready-game.dto';
import { Server, Socket } from 'socket.io';
import { CommandBase } from 'src/commons/base/command.base';
import { SocketToUser, UserToSocket } from 'src/game-manager/game.manager';
import { RoomGameManager } from 'src/game-manager/room/room.manager';
import { UserGameManager } from 'src/game-manager/user/user.manager';
import { GameStateManager } from 'src/game-manager/game-state/game-state.manager';
import { socketEmitError } from 'src/commons/utils/socket-error';
import { RoomStatus } from 'src/game-manager/room/room.interface';
import { UserGameStatus } from 'src/game-manager/user/user.interface';
import { GameEventClient } from 'src/game-manager/game.event';

export interface PlayerCancelReadyGameCommandPayload {
  dto: MessagePlayerCancelReadyGameDto;
  client: Socket;
}

export class PlayerCancelReadyGameCommand
  implements CommandBase<PlayerCancelReadyGameCommandPayload>
{
  constructor(
    private readonly userToSocket: UserToSocket,
    private readonly socketToUser: SocketToUser,
    private userManager: UserGameManager,
    private roomManager: RoomGameManager,
    private gameStateManager: GameStateManager,
    private server: Server,
  ) {}

  execute(payload: PlayerCancelReadyGameCommandPayload) {
    const { dto, client } = payload;

    // Check xem user có tồn tại không
    const userId = this.socketToUser[client.id];
    const user = this.userManager.getUserById(userId);
    if (!user) {
      return socketEmitError(client, 'user-không-tồn-tại');
    }

    // Check xem room có tồn tại không
    const room = this.roomManager.findRoomByPlayerId(userId);
    if (!room) {
      return socketEmitError(client, 'room-không-tồn-tại');
    }
    if (room.status === RoomStatus.PLAYING) {
      return socketEmitError(client, 'room-đang-chơi');
    }

    if (user.status === UserGameStatus.IN_GAME) {
      return socketEmitError(client, 'user-đã-ở-trong-game');
    }
    if (user.status !== UserGameStatus.READY) {
      return socketEmitError(client, 'user-chưa-sẵn-sàng');
    }
    user.status = UserGameStatus.IN_ROOM;

    this.server
      .to(room.id)
      .emit(
        GameEventClient.PLAYER_CANCEL_READY,
        this.userManager.getUserById(userId),
      );

    return;
  }
}
