import { Server, Socket } from 'socket.io';
import { socketEmitError } from 'src/commons/utils/socket-error';
import { MessageStartGameDto as PlayerReadyGameDto } from 'src/game-manager/dtos/player-ready-game.dto';
import { GameStateManager } from 'src/game-manager/game-state/game-state.manager';
import { RoomGameManager } from 'src/game-manager/room/room.manager';
import { UserGameStatus } from 'src/game-manager/user/user.interface';
import { UserGameManager } from 'src/game-manager/user/user.manager';
import { CommandBase } from '../../commons/base/command.base';
import { SocketToUser, UserToSocket } from '../../game-manager/game.manager';
import { GameEventClient } from 'src/game-manager/game.event';

export interface PlayerReadyGameCommandPayload {
  dto: PlayerReadyGameDto;
  client: Socket;
}

export class PlayerReadyGameCommand
  implements CommandBase<PlayerReadyGameCommandPayload>
{
  constructor(
    private readonly userToSocket: UserToSocket,
    private readonly socketToUser: SocketToUser,
    private userManager: UserGameManager,
    private roomManager: RoomGameManager,
    private gameStateManager: GameStateManager,
    private server: Server,
  ) {}

  async execute(payload: PlayerReadyGameCommandPayload) {
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

    if (user.status === UserGameStatus.IN_GAME) {
      return socketEmitError(client, 'user-đã-ở-trong-game');
    }
    if (user.status === UserGameStatus.READY) {
      return socketEmitError(client, 'user-đã-sẵn-sàng');
    }
    user.status = UserGameStatus.READY;

    this.server
      .to(room.id)
      .emit(GameEventClient.PLAYER_READY, this.userManager.getUserById(userId));

    // Check xem cả 2 người chơi đã sẵn sàng chưa
  }
}