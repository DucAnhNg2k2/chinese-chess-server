import { UserStatus } from 'src/const/user.const';

export interface User {
  id: string;
  username: string;
  status: UserStatus;
}

export interface UserMap {
  [userId: string]: User;
}
