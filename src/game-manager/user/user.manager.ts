import { Injectable } from '@nestjs/common';
import { UserStatus } from 'src/const/user.const';
import { UserGame, UserGameMap, UserGameStatus } from './user.interface';

@Injectable()
export class UserGameManager {
  private users: UserGameMap = {};

  getUsers(): Array<UserGame> {
    return Object.values(this.users);
  }

  addUser(user: UserGame) {
    this.users[user.id] = user;
  }

  getUserById(userId: string) {
    return this.users[userId];
  }

  updateUserStatus(userId: string, status: UserGameStatus) {
    const user = this.users[userId];
    if (!user) {
      return;
    }

    user.status = status;
  }
}
