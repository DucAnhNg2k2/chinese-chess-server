import { Module } from '@nestjs/common';
import { GameManager } from './game.manager';
import { RoomManager } from './room/room.manager';
import { GameController } from './game.controller';
import { JwtCoreModule } from 'src/modules/jwt/jwt.core.module';
import { UserGameManager } from './user/user.manager';

@Module({
  imports: [JwtCoreModule],
  controllers: [GameController],
  providers: [GameManager, RoomManager, UserGameManager],
  exports: [GameManager, UserGameManager, RoomManager],
})
export class GameModule {}
