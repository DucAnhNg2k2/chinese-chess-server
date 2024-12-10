import { Module } from '@nestjs/common';
import { SaveGameHistoryCommand } from './save-game-history.command';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameHistoryEntity } from 'src/databases/game-history.entity';

const command = [SaveGameHistoryCommand];

@Module({
  imports: [TypeOrmModule.forFeature([GameHistoryEntity])],
  exports: [...command],
  providers: [...command],
})
export class GameManagerCommandModule {}
