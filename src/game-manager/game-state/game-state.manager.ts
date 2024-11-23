import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  GameChessPieceColorEnum,
  GameState,
  GameStateMap,
} from './game-state.interface';
import { initGameStateBoard } from './game-state.util';

// chinese-board
@Injectable()
export class GameStateManager {
  constructor() {}

  private gameStates: GameStateMap = {};

  getGameStateByRoomId(roomId: string) {
    return Object.values(this.gameStates).find(
      (game) => game.roomId === roomId,
    );
  }

  createNewGameState(
    roomId: string,
    currentPlayerId: string,
    playerIds: string[],
  ) {
    const gameId = randomUUID();
    const newGame: GameState = {
      gameId,
      roomId,
      currentPlayerId,
      playerIds,
      board: initGameStateBoard(),
      gameOver: false,
      playerIdToColorMap: {
        [currentPlayerId]: GameChessPieceColorEnum.RED,
        [playerIds.find((id) => id !== currentPlayerId)]:
          GameChessPieceColorEnum.BLACK,
      },
    };
    this.gameStates[gameId] = newGame;
    return newGame;
  }
}
