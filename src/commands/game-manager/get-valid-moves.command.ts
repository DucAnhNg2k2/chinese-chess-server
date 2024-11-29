import { CommandBase } from 'src/commons/base/command.base';
import { Server, Socket } from 'socket.io';
import { SocketToUser, UserToSocket } from 'src/game-manager/game.manager';
import { RoomGameManager } from 'src/game-manager/room/room.manager';
import { UserGameManager } from 'src/game-manager/user/user.manager';
import { GameStateManager } from 'src/game-manager/game-state/game-state.manager';
import { GameEventClient } from 'src/game-manager/game.event';
import { socketEmitError } from 'src/commons/utils/socket-error';
import { GetValidMoveChessDto } from 'src/game-manager/dtos/get-valid-move.dto';
import { getPointsResultCanMove } from 'src/game-manager/game-state/game-state.util';
import { Point } from 'src/const/point.const';

export interface GetValidMovesCommandPayload {
  client: Socket;
  dto: GetValidMoveChessDto;
}

export class GetValidMovesCommand
  implements CommandBase<GetValidMovesCommandPayload>
{
  constructor(
    private readonly userToSocket: UserToSocket,
    private readonly socketToUser: SocketToUser,
    private userManager: UserGameManager,
    private roomManager: RoomGameManager,
    private gameStateManager: GameStateManager,
    private server: Server,
  ) {}

  execute(payload: GetValidMovesCommandPayload) {
    const { client, dto } = payload;

    const userId = this.socketToUser[client.id];
    const user = this.userManager.getUserById(userId);
    if (!user) {
      return socketEmitError(client, 'user-không-tồn-tại');
    }

    const gameState = this.gameStateManager.getById(dto.gameId);
    if (!gameState) {
      return socketEmitError(client, 'game-state-không-tồn-tại');
    }

    const points: Point[] = getPointsResultCanMove(
      { x: +dto.x, y: +dto.y },
      gameState.board,
    );

    client.emit(GameEventClient.GET_VALID_MOVES, { points });
  }
}
