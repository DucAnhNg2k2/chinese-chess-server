import { OnModuleInit } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { CommandBase } from 'src/commons/base/command.base';
import { socketEmitError } from 'src/commons/utils/socket-error';
import { Point } from 'src/const/point.const';
import { GameHistoryEntity } from 'src/databases/game-history.entity';
import { MovePieceChessDto } from 'src/game-manager/dtos/move-piece-chess.dto';
import { GameStateManager } from 'src/game-manager/game-state/game-state.manager';
import { getPointsResultCanMove } from 'src/game-manager/game-state/game-state.util';
import { isCheckMate } from 'src/game-manager/game-state/utils/is-checkmate';
import { isKingInCheck } from 'src/game-manager/game-state/utils/is-kingincheck';
import { GameEventClient } from 'src/game-manager/game.event';
import { SocketToUser, UserToSocket } from 'src/game-manager/game.manager';
import { RoomStatus } from 'src/game-manager/room/room.interface';
import { RoomGameManager } from 'src/game-manager/room/room.manager';
import { UserGameStatus } from 'src/game-manager/user/user.interface';
import { UserGameManager } from 'src/game-manager/user/user.manager';
import { SaveGameHistoryCommand } from './save-game-history.command';
import { GameMoveEntity } from 'src/databases/game-move.entity';

export interface MovePieceGameCommandPayload {
  dto: MovePieceChessDto;
  client: Socket;
}

export class MovePieceGameCommand
  implements CommandBase<MovePieceGameCommandPayload>, OnModuleInit
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

  onModuleInit() {}

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

    const currentPlayer = userId;
    const competitor =
      userId === gameState.playerIds[0]
        ? gameState.playerIds[1]
        : gameState.playerIds[0];

    // Lưu lại state trước khi thay đổi, để nếu hở tướng thì rollback
    const pieceBeforeMove = board[toX][toY];
    board[toX][toY] = piece;
    board[fromX][fromY] = null;

    // check xem nước đi hở tướng hay không
    const currentIsKingInCheck = isKingInCheck(
      board,
      gameState.playerIdToColorMap[currentPlayer],
    );
    if (currentIsKingInCheck) {
      // rollback
      board[toX][toY] = pieceBeforeMove;
      board[fromX][fromY] = piece;
      return socketEmitError(client, 'Nước đi hở tướng');
    }

    // lưu lại nước đi
    this.gameStateManager.saveTraceMove(gameState.gameId, {
      fromX,
      fromY,
      toX,
      toY,
      playerId: currentPlayer,
      piece,
    });

    // xem đối thủ bị chiếu tướng hay không
    const competitorKingInCheck = isKingInCheck(
      board,
      gameState.playerIdToColorMap[competitor],
    );

    if (competitorKingInCheck) {
      // xem đối thủ có hết cờ không
      const competitorIsCheckMate = isCheckMate(
        board,
        gameState.playerIdToColorMap[competitor],
      );

      if (competitorIsCheckMate) {
        const winner = this.userManager.getUserById(currentPlayer);
        const loser = this.userManager.getUserById(competitor);

        winner.status = UserGameStatus.IN_ROOM;
        loser.status = UserGameStatus.IN_ROOM;
        room.status = RoomStatus.PENDING;
        gameState.gameOver = true;
        gameState.winnerId = currentPlayer;
        gameState.endTime = new Date();

        this.server.to(room.id).emit(GameEventClient.GAME_OVER, {
          winner,
          loser,
        });
        this.server
          .to(room.id)
          .emit(
            GameEventClient.ROOM_INFORMATION,
            this.roomManager.getRoomInfo(room.id),
          );

        // todo ... add to queue
        await this.saveGameHistoryCommand.execute({
          gameHistory: new GameHistoryEntity({
            roomId: room.id,
            gameId: gameState.gameId,
            player1Id: gameState.playerIds[0],
            player2Id: gameState.playerIds[1],
            winnerId: winner.id,
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

        return;
      }
      // chưa hết cờ
      else {
        this.server.to(room.id).emit(GameEventClient.KING_IN_CHECK, {
          x: competitorKingInCheck.x,
          y: competitorKingInCheck.y,
          piece: competitorKingInCheck.piece,
        });
      }
    }

    // update game state
    gameState.currentPlayerId = competitor;

    // emit to room
    this.server.to(room.id).emit(GameEventClient.MOVE_PIECE, {
      fromX,
      fromY,
      toX,
      toY,
      piece,
      currentPlayerId: competitor,
    });
  }
}
