import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  getPointsResultCanMove,
  initGameStateBoard,
} from './game-state/game-state.util';
import { Public } from 'src/commons/decorators/public-endpoint.decorator';
import { GameStateManager } from './game-state/game-state.manager';
import { GetValidMoveChessDto } from './dtos/get-valid-move.dto';
import { isKingInCheck } from './game-state/utils/is-kingincheck';

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
    return getPointsResultCanMove(
      { x: +dto.x, y: +dto.y },
      gameState.board,
      true,
    );
  }

  @Get('king-in-check/:boardId')
  @Public()
  checkKingInCheckDev(@Param('boardId') id: string) {
    const gameState = this.gameStateManager.getById(id);
    return gameState.playerIds.map((id) => {
      return isKingInCheck(gameState.board, gameState.playerIdToColorMap[id]);
    });
  }
}
