import { UserProfileEntity } from 'src/databases/user-profile.entity';

export enum UserGameStatus {
  OFFLINE = 'offline',
  ONLINE = 'online',
  IN_ROOM = 'in_room',
  IN_GAME = 'in_game',
  READY = 'ready',
}
export interface UserGame {
  id: string;
  status: UserGameStatus;
  userProfile: UserProfileEntity;
}

export interface UserGameMap {
  [userId: string]: UserGame;
}
