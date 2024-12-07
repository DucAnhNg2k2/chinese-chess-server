export interface GameState {
  gameId: string;
  roomId: string;
  currentPlayerId: string;
  playerIds: string[];
  board: Array<Array<GameChessPiece | null>>;
  gameOver: boolean;
  winnerId?: string;
  startTime: Date;
  endTime: Date;
  playerIdToColorMap: {
    [playerId: string]: GameChessPieceColorEnum;
  };
}

export interface GameStateMap {
  [gameId: string]: GameState;
}

export enum GameChessPieceTypeEnum {
  XE = 'XE',
  MA = 'MA',
  TINH = 'TINH',
  SI = 'SI',
  TUONG = 'TUONG',
  PHAO = 'PHAO',
  TOT = 'TOT',
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
