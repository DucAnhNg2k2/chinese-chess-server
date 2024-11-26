import { Controller, Get } from '@nestjs/common';
import { initGameStateBoard } from './game-state/game-state.util';
import { Public } from 'src/commons/decorators/public-endpoint.decorator';

@Controller('games-dev')
export class GameControllerDev {
  constructor() {}

  @Get('/init-board')
  @Public()
  initBoard() {
    return initGameStateBoard();
  }

  @Get('/start-game')
  @Public()
  startGame() {
    return 'Game started';
  }
}
