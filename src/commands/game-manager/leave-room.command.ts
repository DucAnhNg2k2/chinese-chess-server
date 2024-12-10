import { Server, Socket } from 'socket.io';
import { CommandBase } from 'src/commons/base/command.base';
import { socketEmitError } from 'src/commons/utils/socket-error';
import { MessageLeaveRoomDto } from 'src/game-manager/dtos/message-leave-room.dto';
import { GameStateManager } from 'src/game-manager/game-state/game-state.manager';
import { GameEventClient } from 'src/game-manager/game.event';
import { SocketToUser, UserToSocket } from 'src/game-manager/game.manager';
import { RoomStatus } from 'src/game-manager/room/room.interface';
import { RoomGameManager } from 'src/game-manager/room/room.manager';
import { UserGameStatus } from 'src/game-manager/user/user.interface';
import { UserGameManager } from 'src/game-manager/user/user.manager';
import { SaveGameHistoryCommand } from './save-game-history.command';
import { OnModuleInit } from '@nestjs/common';
import { GameHistoryEntity } from 'src/databases/game-history.entity';
import { GameMoveEntity } from 'src/databases/game-move.entity';

export interface LeaveRoomCommandPayload {
  dto: MessageLeaveRoomDto;
  client: Socket;
}

export class LeaveRoomCommand
  implements CommandBase<LeaveRoomCommandPayload>, OnModuleInit
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

  async execute(payload: LeaveRoomCommandPayload) {
    const { dto, client } = payload;

    // Kiểm tra xem user có tồn tại không
    const userId = this.socketToUser[client.id];
    const user = this.userManager.getUserById(userId);
    if (user.status === UserGameStatus.ONLINE) {
      return socketEmitError(client, 'user-đang-không-trong-room');
    }

    // Kiểm tra xem user có trong phòng nào không
    const room = this.roomManager.findRoomByPlayerId(userId);
    if (!room) {
      return socketEmitError(client, 'user-không-ở-trong-room');
    }

    // Kiểm tra xem room đang pending hay playing rồi
    if (room.status === RoomStatus.PENDING) {
      // Nếu phòng không còn ai => xóa bỏ phòng
      if (room.playerIds.length === 1) {
        this.roomManager.deleteRoom(room.id);
      }
      // Nếu phòng còn người => nhường lại chủ phòng
      else {
        room.ownerId = room.playerIds.find((playerId) => playerId !== userId);
      }
    }

    let isGameOver = false;
    if (room.status === RoomStatus.PLAYING) {
      const winnerId = room.playerIds.find((playerId) => playerId !== userId);
      const loserId = userId;

      const winner = this.userManager.getUserById(winnerId);
      const loser = this.userManager.getUserById(loserId);

      winner.status = UserGameStatus.IN_ROOM;

      room.status = RoomStatus.PENDING;
      room.ownerId = winnerId;

      isGameOver = true;
      this.server.to(room.id).emit(GameEventClient.GAME_OVER, {
        winner,
        loser,
      });

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
    }

    room.playerIds = room.playerIds.filter((playerId) => playerId !== userId);
    user.status = UserGameStatus.ONLINE;

    // Clear game state của room
    this.gameStateManager.deleteByRoomId(room.id);

    client.leave(room.id);

    // gửi message room cho tất cả người chơi trong room
    this.server
      .to(room.id)
      .emit(
        GameEventClient.PLAYER_LEAVE_ROOM,
        this.userManager.getUserById(userId),
      );

    if (isGameOver) {
      this.server
        .to(room.id)
        .emit(
          GameEventClient.ROOM_INFORMATION,
          this.roomManager.getRoomInfo(room.id),
        );
    }
  }
}
