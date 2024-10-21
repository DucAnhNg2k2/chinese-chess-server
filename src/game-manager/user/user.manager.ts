import { Injectable } from '@nestjs/common';
import { UserStatus } from 'src/const/user.const';
import { User, UserMap } from './user.interface';

@Injectable()
export class UserManager {
  private users: UserMap = {};

  addUser(user: User) {
    this.users[user.id] = user;
  }

  getUserById(userId: string) {
    return this.users[userId];
  }

  updateUserStatus(userId: string, status: UserStatus) {
    const user = this.users[userId];
    if (!user) {
      return;
    }

    user.status = status;
  }
}
