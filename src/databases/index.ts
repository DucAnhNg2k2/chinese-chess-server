import { GameHistoryEntity } from './game-history.entity';
import { GameMoveEntity } from './game-move.entity';
import { UserFriendEntity } from './user-friend.entity';
import { UserProfileEntity } from './user-profile.entity';
import { UserEntity } from './user.entity';

export const entities = [
  UserEntity,
  UserProfileEntity,
  UserFriendEntity,
  GameHistoryEntity,
  GameMoveEntity,
];
