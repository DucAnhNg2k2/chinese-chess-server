import { CommandBase } from './../../commons/base/command.base';
import { UserGameManager } from 'src/game-manager/user/user.manager';
import { SocketToUser, UserToSocket } from './../../game-manager/game.manager';
import { RoomGameManager } from 'src/game-manager/room/room.manager';
import { MessageJoinRoomDto } from 'src/game-manager/dtos/message-join-room.dto';
import { Socket } from 'socket.io';
import { GameStateManager } from 'src/game-manager/game-state/game-state.manager';
import { MessageStartGameDto } from 'src/game-manager/dtos/message-start-game.dto';
import { UserGameStatus } from 'src/game-manager/user/user.interface';
import { socketEmitError } from 'src/commons/utils/socket-error';

export interface StartGameCommandPayload {
  dto: MessageStartGameDto;
  client: Socket;
}

export class StartGameCommand implements CommandBase<StartGameCommandPayload> {
  constructor(
    private readonly userToSocket: UserToSocket,
    private readonly socketToUser: SocketToUser,
    private userManager: UserGameManager,
    private roomManager: RoomGameManager,
    private gameStateManager: GameStateManager,
  ) {}

  async execute(payload: StartGameCommandPayload) {
    const { dto, client } = payload;

    // Check xem user có tồn tại không
    const userId = this.socketToUser[client.id];
    if (!userId) {
      return socketEmitError(client, 'user-không-tồn-tại');
    }
    // Check xem room có tồn tại không
    const room = this.roomManager.getRoomById(dto.roomId);
    if (!room) {
      return socketEmitError(client, 'room-không-tồn-tại');
    }
    // Check xem user có phải là owner không
    if (room.ownerId !== userId) {
      return socketEmitError(client, 'user-không-phải-owner');
    }
    if (room.playerIds.length < 2) {
      return socketEmitError(client, 'số-người-chơi-chưa-đủ');
    }

    // Check xem game đã bắt đầu chưa
    const currentGame = this.gameStateManager.getGameStateByRoomId(dto.roomId);
    if (currentGame && !currentGame.gameOver) {
      return socketEmitError(client, 'game-đã-bắt-đầu');
    }
    const newGame = this.gameStateManager.createNewGameState(
      dto.roomId,
      userId,
    );

    room.playerIds.forEach((playerId) => {
      const user = this.userManager.getUserById(playerId);
      user.status = UserGameStatus.IN_GAME;
    });

    return newGame;
  }
}
