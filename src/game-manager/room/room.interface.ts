export interface Room {
  id: string;
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
