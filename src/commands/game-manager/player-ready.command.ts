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
import { RoomStatus } from 'src/game-manager/room/room.interface';

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
    if (room.status === RoomStatus.PLAYING) {
      return socketEmitError(client, 'room-đang-chơi');
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
    const playerIds = room.playerIds;
    if (playerIds.length !== 2) {
      return;
    }

    const player1 = this.userManager.getUserById(playerIds[0]);
    const player2 = this.userManager.getUserById(playerIds[1]);
    if (
      player1.status === UserGameStatus.READY &&
      player2.status === UserGameStatus.READY
    ) {
      // Tìm xem có game cũ không
      const oldGameState = this.gameStateManager.getGameStateByRoomId(room.id);
      let winnerId = null;
      if (oldGameState) {
        oldGameState.gameOver = true;
        winnerId = oldGameState.winnerId;
      }

      // Tạo game mới
      // Nếu có winnerId thì người còn lại sẽ là người đi trước, ngược lại chủ phòng sẽ đi trước
      const currentPlayerId = (function () {
        if (!winnerId) {
          return room.ownerId;
        }
        return playerIds.find((id) => id !== winnerId);
      })();
      const newGameState = this.gameStateManager.createNewGameState(
        room.id,
        currentPlayerId,
        playerIds,
      );

      // Gửi thông báo bắt đầu game
      this.server.to(room.id).emit(GameEventClient.START_GAME, newGameState);
      player1.status = UserGameStatus.IN_GAME;
      player2.status = UserGameStatus.IN_GAME;
      this.roomManager.updateRoomStatus(room.id, RoomStatus.PLAYING);
    }
  }
}
