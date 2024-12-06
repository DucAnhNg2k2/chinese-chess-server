import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { GameHistoryEntity } from './game-history.entity';
import { UserEntity } from './user.entity';

@Entity('game_moves')
export class GameMoveEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ name: 'game_history_id', nullable: false })
  gameHistoryId: string;

  @Column({ name: 'player_id', nullable: false })
  playerId: string;

  @Column({ name: 'from_x', type: 'int', nullable: false })
  fromX: number;

  @Column({ name: 'from_y', type: 'int', nullable: false })
  fromY: number;

  @Column({ name: 'to_x', type: 'int', nullable: false })
  toX: number;

  @Column({ name: 'to_y', type: 'int', nullable: false })
  toY: number;

  @Column({ name: 'piece', type: 'json', nullable: false })
  piece: {
    type: string;
    color: string;
  };

  @ManyToOne(() => GameHistoryEntity, (gameHistory) => gameHistory.gameMoves)
  @JoinColumn({ name: 'game_history_id' })
  gameHistory: GameHistoryEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'player_id' })
  player: UserEntity;
}
