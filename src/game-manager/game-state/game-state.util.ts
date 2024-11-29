import { Point } from 'src/const/point.const';
import {
  GameChessPiece,
  GameChessPieceColorEnum,
  GameChessPieceTypeEnum,
} from './game-state.interface';
import { getPointsResultCanMoveForXe } from './utils/get-valids-move-for-xe';
import { getPointsResultCanMoveForMa } from './utils/get-valids-move.for-ma';
import { getPointsResultCanMoveForPhao } from './utils/get-valids-move-for-phao';
import { getPointsResultCanMoveForTinh } from './utils/get-valids-move-for-tinh';
import { getPointsResultCanMoveForTuong } from './utils/get-valids-move-for-tuong';
import { getPointsResultCanMoveForSi } from './utils/get-valids-move-for-si';
import { getPointsResultCanMoveForTot } from './utils/get-valids-move-for-tot';

// board của game cờ tướng
export const initGameStateBoard = (): Array<Array<GameChessPiece | null>> => {
  const createPiece = (
    type: GameChessPieceTypeEnum,
    color: GameChessPieceColorEnum,
  ): GameChessPiece => ({
    type,
    color,
  });
  const {
    XE,
    MA: MÃ,
    TINH: TỊNH,
    SI: SĨ,
    TUONG: TƯỚNG,
    PHAO: PHÁO,
    TOT: TỐT,
  } = GameChessPieceTypeEnum;
  const { RED, BLACK } = GameChessPieceColorEnum;

  const row1 = [XE, MÃ, TỊNH, SĨ, TƯỚNG, SĨ, TỊNH, MÃ, XE].map((type) =>
    createPiece(type, RED),
  );
  const row2 = Array(9).fill(null);
  const row3 = [null, PHÁO, null, null, null, null, null, PHÁO, null].map(
    (type) => (type ? createPiece(type, RED) : null),
  );
  const row4 = [TỐT, null, TỐT, null, TỐT, null, TỐT, null, TỐT].map((type) =>
    type ? createPiece(type, RED) : null,
  );
  const row5 = Array(9).fill(null);
  const row6 = Array(9).fill(null);
  const row7 = [TỐT, null, TỐT, null, TỐT, null, TỐT, null, TỐT].map((type) =>
    type ? createPiece(type, BLACK) : null,
  );
  const row8 = [null, PHÁO, null, null, null, null, null, PHÁO, null].map(
    (type) => (type ? createPiece(type, BLACK) : null),
  );
  const row9 = Array(9).fill(null);
  const row10 = [XE, MÃ, TỊNH, SĨ, TƯỚNG, SĨ, TỊNH, MÃ, XE].map((type) =>
    createPiece(type, BLACK),
  );

  return [row1, row2, row3, row4, row5, row6, row7, row8, row9, row10];
};

export const getPointsResultCanMove = (
  point: Point,
  board: Array<Array<GameChessPiece | null>>,
) => {
  if (!point) {
    return [];
  }
  const x = point.x,
    y = point.y;
  if (x === null || x === undefined) return [];
  if (y === null || y === undefined) return [];

  const piece = board[x][y];
  if (!piece) {
    return [];
  }

  const {
    XE,
    MA: MÃ,
    TINH: TỊNH,
    SI: SĨ,
    TUONG: TƯỚNG,
    PHAO: PHÁO,
    TOT: TỐT,
  } = GameChessPieceTypeEnum;
  switch (piece.type) {
    case XE:
      return getPointsResultCanMoveForXe({ x, y }, board);
    case MÃ:
      return getPointsResultCanMoveForMa({ x, y }, board);
    case TỊNH:
      return getPointsResultCanMoveForTinh({ x, y }, board);
    case SĨ:
      return getPointsResultCanMoveForSi({ x, y }, board);
    case TƯỚNG:
      return getPointsResultCanMoveForTuong({ x, y }, board);
    case PHÁO:
      return getPointsResultCanMoveForPhao({ x, y }, board);
    case TỐT:
      return getPointsResultCanMoveForTot({ x, y }, board);
    default:
      return [];
  }
};

export const convertTo1D = (board: Array<Array<GameChessPiece | null>>) => {
  return board.reduce((acc, row) => {
    return acc.concat(row);
  }, []);
};
