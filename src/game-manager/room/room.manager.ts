import { Injectable } from '@nestjs/common';
import { Room, RoomMap } from './room.interface';

@Injectable()
export class RoomManager {
  private rooms: RoomMap = {};

  constructor() {}

  getRooms(): Array<Room> {
    return Object.values(this.rooms);
  }
}
