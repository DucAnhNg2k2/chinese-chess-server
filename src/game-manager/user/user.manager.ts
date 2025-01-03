import { Injectable } from '@nestjs/common';
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

  removeUser(userId: string) {
    delete this.users[userId];
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
