import { SaveGameHistoryDto } from 'src/game-manager/dtos/save-game-history.dto';
import { CommandBase } from '../../commons/base/command.base';
import { InjectRepository } from '@nestjs/typeorm';
import { GameHistoryEntity } from 'src/databases/game-history.entity';
import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { GameMoveEntity } from 'src/databases/game-move.entity';

export interface SaveGameHistoryCommandPayload {
  gameHistory: SaveGameHistoryDto['gameHistory'];
  gameMove: SaveGameHistoryDto['gameMove'];
}

@Injectable()
export class SaveGameHistoryCommand
  implements CommandBase<SaveGameHistoryCommandPayload>
{
  constructor(private dataSource: DataSource) {}

  async execute(dto: SaveGameHistoryCommandPayload): Promise<any> {
    return this.dataSource.transaction(async (manager) => {
      const gameHistory = await manager.save(
        GameHistoryEntity,
        dto.gameHistory,
      );
      // update gameHistoryId for gameMove
      dto.gameMove.forEach((move) => {
        move.gameHistoryId = gameHistory.id;
      });
      await manager.save(GameMoveEntity, dto.gameMove);
    });
  }
}
