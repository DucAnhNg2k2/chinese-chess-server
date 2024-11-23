import { Injectable } from '@nestjs/common';
import { Room, RoomMap } from './room.interface';
import { UserGameManager } from '../user/user.manager';

@Injectable()
export class RoomGameManager {
  private rooms: RoomMap = {};

  constructor(private userGameManager: UserGameManager) {}

  getRooms(): Array<Room> {
    return Object.values(this.rooms);
  }

  getRoomById(roomId: string) {
    return this.rooms[roomId];
  }

  createRoom(room: Room) {
    this.rooms[room.id] = room;
    return room;
  }

  deleteRoom(roomId: string) {
    delete this.rooms[roomId];
  }

  findRoomByPlayerId(playerId: string) {
    const roomIds = Object.keys(this.rooms);
    for (const roomId of roomIds) {
      const room = this.rooms[roomId];
      if (room.playerIds.includes(playerId)) {
        return room;
      }
    }
  }

  getRoomInfo(roomId: string) {
    const room = this.rooms[roomId];
    // get user info
    const userProfiles = room.playerIds.map((playerId) => {
      return this.userGameManager.getUserById(playerId)?.userProfile;
    });
    return {
      ...room,
      userProfiles,
    };
  }
}
