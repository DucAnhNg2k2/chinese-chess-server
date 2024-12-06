import { BaseModal } from 'src/commons/base/modal.base';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('user_profiles')
export class UserProfileEntity extends BaseModal<UserProfileEntity> {
  @OneToOne(() => UserEntity, (user) => user.userProfile, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @PrimaryColumn({ name: 'user_id', nullable: false, unique: true })
  userId: string;

  @Column({ name: 'full_name', nullable: false })
  fullName: string;

  @Column({ name: 'phone_number', nullable: false })
  phoneNumber: string;

  @Column({ name: 'address', nullable: false })
  address: string;

  @Column({ name: 'avatar', nullable: true, length: 1024 })
  avatar: string;

  @Column({ name: 'total_wins', default: 0 })
  totalWins: number;

  @Column({ name: 'total_loses', default: 0 })
  totalLoses: number;

  @Column({ name: 'total_games', default: 0 })
  totalGames: number;
}
