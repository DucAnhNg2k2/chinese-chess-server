import { Controller, Get, Param } from '@nestjs/common';
import { initGameStateBoard } from './game-state/game-state.util';
import { Public } from 'src/commons/decorators/public-endpoint.decorator';
import { GameStateManager } from './game-state/game-state.manager';

@Controller('games-dev')
export class GameControllerDev {
  constructor(private gameStateManager: GameStateManager) {}

  @Get('init-board')
  @Public()
  initBoard() {
    return initGameStateBoard();
  }

  @Get('start-game')
  @Public()
  startGame() {
    return 'Game started';
  }

  @Get('board/:id')
  @Public()
  getDetailBoardDev(@Param('id') id: string) {
    return this.gameStateManager.getById(id);
  }
}
