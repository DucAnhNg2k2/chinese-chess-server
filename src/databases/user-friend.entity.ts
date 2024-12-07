import { BaseModal } from 'src/commons/base/modal.base';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('users_friends')
export class UserFriendEntity extends BaseModal<UserFriendEntity> {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ name: 'user_id', nullable: false })
  userId: string;

  @Column({ name: 'friend_id', nullable: false })
  friendId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'friend_id' })
  friend: UserEntity;
}
