import { SurrenderGameDto } from 'src/game-manager/dtos/surrender.dto';
import { Server, Socket } from 'socket.io';
import { CommandBase } from 'src/commons/base/command.base';
import { SocketToUser, UserToSocket } from 'src/game-manager/game.manager';
import { UserGameManager } from 'src/game-manager/user/user.manager';
import { RoomGameManager } from 'src/game-manager/room/room.manager';
import { GameStateManager } from 'src/game-manager/game-state/game-state.manager';
import { socketEmitError } from 'src/commons/utils/socket-error';
import { RoomStatus } from 'src/game-manager/room/room.interface';
import { UserGameStatus } from 'src/game-manager/user/user.interface';
import { SaveGameHistoryCommand } from './save-game-history.command';
import { GameHistoryEntity } from 'src/databases/game-history.entity';
import { GameMoveEntity } from 'src/databases/game-move.entity';
import { GameEventClient } from 'src/game-manager/game.event';

export interface SurrenderGameCommandPayload {
  dto: SurrenderGameDto;
  client: Socket;
}

export class SurrenderGameCommand
  implements CommandBase<SurrenderGameCommandPayload>
{
  constructor(
    private readonly userToSocket: UserToSocket,
    private readonly socketToUser: SocketToUser,
    private userManager: UserGameManager,
    private roomManager: RoomGameManager,
    private gameStateManager: GameStateManager,
    private server: Server,
    private readonly saveGameHistoryCommand: SaveGameHistoryCommand,
  ) {}

  async execute(payload: SurrenderGameCommandPayload) {
    const { dto, client } = payload;

    // Check xem user có tồn tại không
    const userId = this.socketToUser[client.id];
    const user = this.userManager.getUserById(userId);
    if (!user) {
      return socketEmitError(client, 'user-không-tồn-tại');
    }
    if (user.status === UserGameStatus.ONLINE) {
      return socketEmitError(client, 'user-đang-không-trong-room');
    }

    // Check xem room có tồn tại không
    const room = this.roomManager.findRoomByPlayerId(userId);
    if (!room) {
      return socketEmitError(client, 'room-không-tồn-tại');
    }
    if (room.status !== RoomStatus.PLAYING) {
      return socketEmitError(client, 'room-chưa-bắt-đầu');
    }

    const winnerId = room.playerIds.find((playerId) => playerId !== userId);
    const loserId = userId;

    const winner = this.userManager.getUserById(winnerId);
    const loser = this.userManager.getUserById(loserId);

    // hết cờ. lưu lại history vào database. add vào queue
    // todo ... add to queue
    const gameState = this.gameStateManager.getGameStateByRoomId(room.id);
    gameState.endTime = new Date();
    await this.saveGameHistoryCommand.execute({
      gameHistory: new GameHistoryEntity({
        roomId: room.id,
        gameId: gameState.gameId,
        player1Id: gameState.playerIds[0],
        player2Id: gameState.playerIds[1],
        winnerId: winnerId,
        startTime: gameState.startTime,
        endTime: gameState.endTime,
        player1Color: gameState.playerIdToColorMap[gameState.playerIds[0]],
        player2Color: gameState.playerIdToColorMap[gameState.playerIds[1]],
      }),
      gameMove: gameState.traceMoves.map((move) => {
        return new GameMoveEntity({
          playerId: move.playerId,
          fromX: move.fromX,
          fromY: move.fromY,
          toX: move.toX,
          toY: move.toY,
          piece: move.piece,
        });
      }),
    });

    this.server.to(room.id).emit(GameEventClient.GAME_OVER, {
      winner,
      loser,
    });
  }
}
