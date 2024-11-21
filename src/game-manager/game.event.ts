export enum GameEventServer {
  ERROR = 'SERVER_ERROR',
  CREATE_ROOM = 'SERVER_CREATE_ROOM',
  JOIN_ROOM = 'SERVER_JOIN_ROOM',
  START_GAME = 'SERVER_START_GAME',
  LEAVE_ROOM = 'SERVER_LEAVE_ROOM',
  MOVE_PIECE = 'SERVER_MOVE_PIECE',
}

export enum GameEventClient {
  ERROR = 'CLIENT_ERROR',
  CREATE_ROOM = 'CLIENT_CREATE_ROOM',
  START_GAME = 'CLIENT_START_GAME',
}
