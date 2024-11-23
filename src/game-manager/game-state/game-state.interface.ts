export interface GameState {
  gameId: string;
  roomId: string;
  currentPlayerId: string;
  playerIds: string[];
  board: Array<Array<GameChessPiece | null>>;
  gameOver: boolean;
  winnerId?: string;
  playerIdToColorMap: {
    [playerId: string]: GameChessPieceColorEnum;
  };
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

// người đi trước sẽ là người chơi đỏ
export enum GameChessPieceColorEnum {
  RED = 'RED',
  BLACK = 'BLACK',
}

export interface GameChessPiece {
  type: GameChessPieceTypeEnum;
  color: GameChessPieceColorEnum;
}
