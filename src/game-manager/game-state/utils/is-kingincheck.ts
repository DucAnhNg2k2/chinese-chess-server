import {
  GameChessPiece,
  GameChessPieceColorEnum,
  GameChessPieceTypeEnum,
} from '../game-state.interface';
import { getPointsResultCanMove } from '../game-state.util';
import { findKingPosition } from './find-king-position';

export const isKingInCheck = (
  board: Array<Array<GameChessPiece | null>>,
  currentPlayerColor: GameChessPieceColorEnum,
): boolean => {
  const kingPosition = findKingPosition(board, currentPlayerColor);
  const kingX = kingPosition.x,
    kingY = kingPosition.y;

  const { XE, MA: MÃ, PHAO: PHÁO, TOT: TỐT } = GameChessPieceTypeEnum;
  for (let x = 0; x < board.length; x++) {
    for (let y = 0; y < board[x].length; y++) {
      const piece = board[x][y];
      if (
        piece &&
        piece.color !== currentPlayerColor &&
        [XE, MÃ, PHÁO, TỐT].includes(piece.type)
      ) {
        const validMoves = getPointsResultCanMove({ x, y }, board);
        if (
          validMoves.some((point) => point.x === kingX && point.y === kingY)
        ) {
          return true;
        }
      }
    }
  }
  return false;
};
