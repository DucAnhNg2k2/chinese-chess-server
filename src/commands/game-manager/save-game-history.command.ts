import { Server, Socket } from 'socket.io';
import { socketEmitError } from 'src/commons/utils/socket-error';
import { MessagePlayerReadyGameDto as PlayerReadyGameDto } from 'src/game-manager/dtos/player-ready-game.dto';
import { GameStateManager } from 'src/game-manager/game-state/game-state.manager';
import { GameEventClient } from 'src/game-manager/game.event';
import { RoomStatus } from 'src/game-manager/room/room.interface';
import { RoomGameManager } from 'src/game-manager/room/room.manager';
import { UserGameStatus } from 'src/game-manager/user/user.interface';
import { UserGameManager } from 'src/game-manager/user/user.manager';
import { CommandBase } from '../../commons/base/command.base';
import { SocketToUser, UserToSocket } from '../../game-manager/game.manager';
import { convertTo1D } from 'src/game-manager/game-state/game-state.util';
import { SaveGameHistoryDto } from 'src/game-manager/dtos/save-game-history.dto';

export interface SaveGameHistoryCommandPayload {
  dto: SaveGameHistoryDto;
}

export class SaveGameHistoryCommand
  implements CommandBase<SaveGameHistoryCommandPayload>
{
  constructor() {}

  async execute(dto: SaveGameHistoryCommandPayload): Promise<any> {}
}
