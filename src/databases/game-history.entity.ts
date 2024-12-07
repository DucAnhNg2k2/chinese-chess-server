import { BaseModal } from 'src/commons/base/modal.base';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { GameMoveEntity } from './game-move.entity';

@Entity('game_histories')
export class GameHistoryEntity extends BaseModal<GameHistoryEntity> {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ name: 'game_id', nullable: false, length: 255, unique: true })
  gameId: string;

  @Column({ name: 'room_id', nullable: false, length: 255 })
  roomId: string;

  @Column({ name: 'player1_id', nullable: false })
  player1Id: string;

  @Column({ name: 'player2_id', nullable: false })
  player2Id: string;

  @Column({ name: 'winner_id' })
  winnerId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'player1_id' })
  player1: UserEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'player2_id' })
  player2: UserEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'winner_id' })
  winner: UserEntity | null;

  @Column({ name: 'start_time', type: 'timestamp', nullable: false })
  startTime: Date;

  @Column({ name: 'end_time', type: 'timestamp', nullable: false })
  endTime: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => GameMoveEntity, (gameMove) => gameMove.gameHistory)
  gameMoves: GameMoveEntity[];
}
