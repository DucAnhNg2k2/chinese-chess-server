import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { GameState, GameStateMap } from './game-state.interface';

@Injectable()
export class GameStateManager {
  constructor() {}

  private gameStates: GameStateMap = {};

  getGameStateByRoomId(roomId: string) {
    return Object.values(this.gameStates).find(
      (game) => game.roomId === roomId,
    );
  }

  createNewGameState(roomId: string, currentPlayerId: string) {
    const gameId = randomUUID();
    const newGame: GameState = {
      gameId,
      roomId,
      currentPlayerId,
      board: [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
      ],
      gameOver: false,
    };
    this.gameStates[gameId] = newGame;
    return newGame;
  }
}
