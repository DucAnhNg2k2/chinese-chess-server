export interface Room {
  id: string;
  // name: string;
  playerIds: string[];
  ownerId: string;
}

export interface RoomMap {
  [roomId: string]: Room;
}
