import { Injectable } from '@nestjs/common';
import { Room, RoomMap } from './room.interface';

@Injectable()
export class RoomGameManager {
  private rooms: RoomMap = {};

  constructor() {}

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

  handleRoomWhenDisconnect(userId: string) {
    const roomId = Object.keys(this.rooms).find((roomId) => {
      return this.rooms[roomId].playerIds.includes(userId);
    });
    if (!roomId) {
      return;
    }
    const playerIds = this.rooms[roomId].playerIds;
    if (playerIds.length === 1) {
      delete this.rooms[roomId];
      return;
    }
  }
}
