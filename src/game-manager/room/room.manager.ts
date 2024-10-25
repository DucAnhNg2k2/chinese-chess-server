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
  }
}
