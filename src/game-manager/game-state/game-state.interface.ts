export interface GameState {
  gameId: string;
  roomId: string;
  currentPlayerId: string;
  board: Array<Array<GameChessPiece | null>>;
  gameOver: boolean;
}

export interface GameStateMap {
  [gameId: string]: GameState;
}

export enum GameChessPieceTypeEnum {
  XE = 'XE',
  MÃ = 'MÃ',
  TỊNH = 'TỊNH',
  SĨ = 'SĨ',
  TƯỚNG = 'TƯỚNG',
  PHÁO = 'PHÁO',
  TỐT = 'TỐT',
}
export enum GameChessPieceColorEnum {
  RED = 'RED',
  BLACK = 'BLACK',
}

export interface GameChessPiece {
  type: GameChessPieceTypeEnum;
  color: GameChessPieceColorEnum;
}
