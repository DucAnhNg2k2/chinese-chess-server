import { GameHistoryEntity } from 'src/databases/game-history.entity';
import { GameMoveEntity } from 'src/databases/game-move.entity';

export interface SaveGameHistoryDto {
  gameHistory: GameHistoryEntity;
  gameMove: GameMoveEntity[];
}
