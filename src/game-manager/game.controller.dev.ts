import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  getPointsResultCanMove,
  initGameStateBoard,
} from './game-state/game-state.util';
import { Public } from 'src/commons/decorators/public-endpoint.decorator';
import { GameStateManager } from './game-state/game-state.manager';
import { GetValidMoveChessDto } from './dtos/get-valid-move.dto';

@Controller('games-dev')
export class GameControllerDev {
  constructor(private gameStateManager: GameStateManager) {}

  @Get('init-board')
  @Public()
  initBoard() {
    return initGameStateBoard();
  }

  @Get('game-state/:id')
  @Public()
  getDetailGameStateDev(@Param('id') id: string) {
    return this.gameStateManager.getById(id);
  }

  @Get('valid-move/:boardId')
  @Public()
  getValidMoveDev(
    @Param('boardId') id: string,
    @Query() dto: GetValidMoveChessDto,
  ) {
    const gameState = this.gameStateManager.getById(id);
    return getPointsResultCanMove({ x: +dto.x, y: +dto.y }, gameState.board);
  }
}
