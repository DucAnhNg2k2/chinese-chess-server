export enum GameEventServer {
  ERROR = 'SERVER_ERROR',
  CREATE_ROOM = 'SERVER_CREATE_ROOM',
  JOIN_ROOM = 'SERVER_JOIN_ROOM',
  PLAYER_READY = 'SERVER_PLAYER_READY',
  PLAYER_CANCEL_READY = 'SERVER_PLAYER_CANCEL_READY',
  LEAVE_ROOM = 'SERVER_LEAVE_ROOM',
  MOVE_PIECE = 'SERVER_MOVE_PIECE',
  GET_VALID_MOVES = 'SERVER_GET_VALID_MOVES',
  INVITE_FRIEND = 'SERVER_INVITE_FRIEND',
}

export enum GameEventClient {
  ERROR = 'CLIENT_ERROR',
  ROOM_INFORMATION = 'CLIENT_ROOM_INFORMATION',
  PLAYER_JOIN_ROOM = 'CLIENT_PLAYER_JOIN_ROOM',
  PLAYER_LEAVE_ROOM = 'CLIENT_PLAYER_LEAVE_ROOM',
  PLAYER_READY = 'CLIENT_PLAYER_READY',
  PLAYER_CANCEL_READY = 'CLIENT_PLAYER_CANCEL_READY',
  START_GAME = 'CLIENT_START_GAME',
  MOVE_PIECE = 'CLIENT_MOVE_PIECE',
  CURRENT_PLAYER = 'CLIENT_CURRENT_PLAYER',
  GAME_OVER = 'CLIENT_GAME_OVER',
  KING_IN_CHECK = 'CLIENT_KING_IN_CHECK',
  GET_VALID_MOVES = 'CLIENT_GET_VALID_MOVES',
  INVITE_FRIEND = 'CLIENT_INVITE_FRIEND',
}
