import { Module } from '@nestjs/common';
import { GameManager } from './game.manager';
import { RoomGameManager } from './room/room.manager';
import { GameController } from './game.controller';
import { JwtCoreModule } from 'src/modules/jwt/jwt.core.module';
import { UserGameManager } from './user/user.manager';
import { GameStateManager } from './game-state/game-state.manager';

@Module({
  imports: [JwtCoreModule],
  controllers: [GameController],
  providers: [GameManager, RoomGameManager, UserGameManager, GameStateManager],
  exports: [GameManager, UserGameManager, RoomGameManager, GameStateManager],
})
export class GameModule {}
