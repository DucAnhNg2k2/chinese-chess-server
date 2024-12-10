import { Module } from '@nestjs/common';
import { GameManager } from './game.manager';
import { RoomGameManager } from './room/room.manager';
import { GameController } from './game.controller';
import { JwtCoreModule } from 'src/modules/jwt/jwt.core.module';
import { UserGameManager } from './user/user.manager';
import { GameStateManager } from './game-state/game-state.manager';
import { UserCommandModule } from 'src/commands/user/user.command';
import { GameControllerDev } from './game.controller.dev';
import { GameManagerCommandModule } from 'src/commands/game-manager/game-manager.command';

@Module({
  imports: [JwtCoreModule, UserCommandModule, GameManagerCommandModule],
  controllers: [GameController, GameControllerDev],
  providers: [GameManager, RoomGameManager, UserGameManager, GameStateManager],
  exports: [GameManager, UserGameManager, RoomGameManager, GameStateManager],
})
export class GameModule {}
