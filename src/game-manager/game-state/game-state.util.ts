import {
  GameChessPiece,
  GameChessPieceColorEnum,
  GameChessPieceTypeEnum,
} from './game-state.interface';

// board của game cờ tướng
export const initGameStateBoard = (): Array<Array<GameChessPiece | null>> => {
  const row1 = [
    { type: GameChessPieceTypeEnum.XE, color: GameChessPieceColorEnum.RED },
    { type: GameChessPieceTypeEnum.MÃ, color: GameChessPieceColorEnum.RED },
    { type: GameChessPieceTypeEnum.TỊNH, color: GameChessPieceColorEnum.RED },
    { type: GameChessPieceTypeEnum.SĨ, color: GameChessPieceColorEnum.RED },
    { type: GameChessPieceTypeEnum.TƯỚNG, color: GameChessPieceColorEnum.RED },
    { type: GameChessPieceTypeEnum.SĨ, color: GameChessPieceColorEnum.RED },
    { type: GameChessPieceTypeEnum.TỊNH, color: GameChessPieceColorEnum.RED },
    { type: GameChessPieceTypeEnum.MÃ, color: GameChessPieceColorEnum.RED },
    { type: GameChessPieceTypeEnum.XE, color: GameChessPieceColorEnum.RED },
  ];
  const row2 = Array(9).fill(null);
  const row3 = [
    null,
    { type: GameChessPieceTypeEnum.PHÁO, color: GameChessPieceColorEnum.RED },
    null,
    null,
    null,
    null,
    null,
    { type: GameChessPieceTypeEnum.PHÁO, color: GameChessPieceColorEnum.RED },
    null,
  ];
  const row4 = [
    { type: GameChessPieceTypeEnum.TỐT, color: GameChessPieceColorEnum.RED },
    null,
    {
      type: GameChessPieceTypeEnum.TỐT,
      color: GameChessPieceColorEnum.RED,
    },
    null,
    { type: GameChessPieceTypeEnum.TỐT, color: GameChessPieceColorEnum.RED },
    null,
    { type: GameChessPieceTypeEnum.TỐT, color: GameChessPieceColorEnum.RED },
  ];
  const row5 = Array(9).fill(null);
  const row6 = Array(9).fill(null);
  const row7 = [
    { type: GameChessPieceTypeEnum.TỐT, color: GameChessPieceColorEnum.BLACK },
    null,
    { type: GameChessPieceTypeEnum.TỐT, color: GameChessPieceColorEnum.BLACK },
    null,
    { type: GameChessPieceTypeEnum.TỐT, color: GameChessPieceColorEnum.BLACK },
    null,
    { type: GameChessPieceTypeEnum.TỐT, color: GameChessPieceColorEnum.BLACK },
  ];
  const row8 = [
    null,
    { type: GameChessPieceTypeEnum.PHÁO, color: GameChessPieceColorEnum.BLACK },
    null,
    null,
    null,
    null,
    null,
    { type: GameChessPieceTypeEnum.PHÁO, color: GameChessPieceColorEnum.BLACK },
    null,
  ];
  const row9 = Array(9).fill(null);
  const row10 = [
    { type: GameChessPieceTypeEnum.XE, color: GameChessPieceColorEnum.BLACK },
    { type: GameChessPieceTypeEnum.MÃ, color: GameChessPieceColorEnum.BLACK },
    { type: GameChessPieceTypeEnum.TỊNH, color: GameChessPieceColorEnum.BLACK },
    { type: GameChessPieceTypeEnum.SĨ, color: GameChessPieceColorEnum.BLACK },
    {
      type: GameChessPieceTypeEnum.TƯỚNG,
      color: GameChessPieceColorEnum.BLACK,
    },
    { type: GameChessPieceTypeEnum.SĨ, color: GameChessPieceColorEnum.BLACK },
    { type: GameChessPieceTypeEnum.TỊNH, color: GameChessPieceColorEnum.BLACK },
    { type: GameChessPieceTypeEnum.MÃ, color: GameChessPieceColorEnum.BLACK },
    { type: GameChessPieceTypeEnum.XE, color: GameChessPieceColorEnum.BLACK },
  ];
  return [row1, row2, row3, row4, row5, row6, row7, row8, row9, row10];
};

const getPointsResultCanMove = (
  x: number,
  y: number,
  board: Array<Array<GameChessPiece | null>>,
) => {
  if (x < 0 || x >= 9 || y < 0 || y >= 10) {
    return [];
  }

  const piece = board[x][y];
  if (!piece) {
    return [];
  }

  switch (piece.type) {
    case GameChessPieceTypeEnum.XE:
      return getPointsResultCanMoveForXe(x, y, board);
    case 'MÃ':
      break;
    case 'TỊNH':
      break;
    case 'SĨ':
      break;
    case 'TƯỚNG':
      break;
    case 'PHÁO':
      break;
    case 'TỐT':
      break;
    default:
      return false;
  }
  return true;
};

const getPointsResultCanMoveForXe = (
  x: number,
  y: number,
  board: Array<Array<GameChessPiece | null>>,
) => {
  const piece = board[x][y];
  if (!piece) {
    return true;
  }
  return false;
};
