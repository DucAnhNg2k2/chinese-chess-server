import { Module } from '@nestjs/common';
import { GameHistoryController } from './game-history.controller';
import { GameHistoryService } from './game-history.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameHistoryEntity } from 'src/databases/game-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GameHistoryEntity])],
  controllers: [GameHistoryController],
  exports: [GameHistoryService],
  providers: [GameHistoryService],
})
export class GameHistoryModule {}
