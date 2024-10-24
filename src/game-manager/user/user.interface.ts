import { UserStatus } from 'src/const/user.const';

export enum UserGameStatus {
  OFFLINE = 'offline',
  ONLINE = 'online',
  IN_GAME = 'in_game',
}
export interface UserGame {
  id: string;
  // username: string;
  status: UserGameStatus;
}

export interface UserGameMap {
  [userId: string]: UserGame;
}
