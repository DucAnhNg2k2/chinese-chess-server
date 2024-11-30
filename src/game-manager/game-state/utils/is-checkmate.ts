import {
  GameChessPiece,
  GameChessPieceColorEnum,
  GameChessPieceTypeEnum,
} from '../game-state.interface';
import { getPointsResultCanMove } from '../game-state.util';
import { findKingPosition } from './find-king-position';

/*
Tất cả quân của đối thủ đi nước nào cũng bị chiếu tướng => đối thủ đã thua
*/
export const isCheckMate = (
  board: Array<Array<GameChessPiece | null>>,
  currentPlayerColor: GameChessPieceColorEnum,
) => {
  const kingPosition = findKingPosition(board, currentPlayerColor);
  const kingX = kingPosition.x,
    kingY = kingPosition.y;
};
