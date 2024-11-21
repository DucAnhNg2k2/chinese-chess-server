export interface Room {
  id: string;
  // name: string;
  playerIds: string[];
  ownerId: string;
  status: RoomStatus;
}

export enum RoomStatus {
  PENDING = 'pending',
  PLAYING = 'playing',
}

export interface RoomMap {
  [roomId: string]: Room;
}
