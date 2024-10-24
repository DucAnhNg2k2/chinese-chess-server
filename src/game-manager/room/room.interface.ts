export interface Room {
  id: string;
  name: string;
  playerIds: string[];
}

export interface RoomMap {
  [roomId: string]: Room;
}
