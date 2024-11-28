import { Server, Socket } from 'socket.io';
import { CommandBase } from 'src/commons/base/command.base';
import { socketEmitError } from 'src/commons/utils/socket-error';
import { Point } from 'src/const/point.const';
import { MovePieceChessDto } from 'src/game-manager/dtos/move-piece-chess.dto';
import { GameStateManager } from 'src/game-manager/game-state/game-state.manager';
import { getPointsResultCanMove } from 'src/game-manager/game-state/game-state.util';
import { GameEventClient } from 'src/game-manager/game.event';
import { SocketToUser, UserToSocket } from 'src/game-manager/game.manager';
import { RoomGameManager } from 'src/game-manager/room/room.manager';
import { UserGameStatus } from 'src/game-manager/user/user.interface';
import { UserGameManager } from 'src/game-manager/user/user.manager';

export interface MovePieceGameCommandPayload {
  dto: MovePieceChessDto;
  client: Socket;
}

export class MovePieceGameCommand
  implements CommandBase<MovePieceGameCommandPayload>
{
  constructor(
    private readonly userToSocket: UserToSocket,
    private readonly socketToUser: SocketToUser,
    private userManager: UserGameManager,
    private roomManager: RoomGameManager,
    private gameStateManager: GameStateManager,
    private server: Server,
  ) {}

  async execute(payload: MovePieceGameCommandPayload) {
    const { dto, client } = payload;

    const userId = this.socketToUser[client.id];
    const user = this.userManager.getUserById(userId);
    if (user.status !== UserGameStatus.IN_GAME) {
      return socketEmitError(client, 'user-đang-không-trong-trận-đấu');
    }

    const room = this.roomManager.findRoomByPlayerId(userId);
    if (!room) {
      return socketEmitError(client, 'user-không-ở-trong-room');
    }

    const gameState = this.gameStateManager.getGameStateByRoomId(room.id);
    if (!gameState) {
      return socketEmitError(client, 'game-state-không-tồn-tại');
    }
    if (gameState.currentPlayerId !== userId) {
      return socketEmitError(client, 'không-phải-lượt-của-bạn');
    }

    const board = gameState.board;
    const { fromX, fromY, toX, toY } = dto;
    const piece = board[fromX][fromY];
    if (!piece) {
      return socketEmitError(client, 'không-tìm-thấy-quân-cờ');
    }
    if (piece.color !== gameState.playerIdToColorMap[userId]) {
      return socketEmitError(client, 'không-phải-quân-cờ-của-bạn');
    }

    // check move ... todo ...
    if (board[toX][toY]?.color === piece.color) {
      return socketEmitError(client, 'không-thể-ăn-quân-cờ-cùng-màu');
    }

    const validMoves: Array<Point> = getPointsResultCanMove(
      {
        x: fromX,
        y: fromY,
      },
      board,
    );
    if (!validMoves.some((point) => point.x === toX && point.y === toY)) {
      return socketEmitError(client, 'không thể đi đến điểm này');
    }

    board[toX][toY] = piece;
    board[fromX][fromY] = null;

    // update game state
    const currentPlayerId =
      userId === gameState.playerIds[0]
        ? gameState.playerIds[1]
        : gameState.playerIds[0];
    gameState.currentPlayerId = currentPlayerId;

    // emit to room
    this.server.to(room.id).emit(GameEventClient.MOVE_PIECE, {
      fromX,
      fromY,
      toX,
      toY,
      piece,
    });
  }
}
