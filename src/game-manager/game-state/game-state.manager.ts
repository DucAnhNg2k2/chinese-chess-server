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

  getPieceCanMove(gameStateId: number, x: number, y: number) {
    const gameState = this.gameStates[gameStateId];
    const boards = gameState.board;

    const piece = boards[x][y];
    if (!piece) {
      return false;
    }
    return piece;
  }

  getById(id: string) {
    return this.gameStates[id];
  }

  deleteById(id: string) {
    delete this.gameStates[id];
  }

  deleteByRoomId(roomId: string) {
    const gameState = this.getGameStateByRoomId(roomId);
    if (gameState) {
      delete this.gameStates[gameState.gameId];
    }
  }
}
