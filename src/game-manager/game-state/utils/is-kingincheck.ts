import { Point } from 'src/const/point.const';
import {
  GameChessPiece,
  GameChessPieceColorEnum,
  GameChessPieceTypeEnum,
} from '../game-state.interface';
import { getPointsResultCanMove } from '../game-state.util';

const findKingPosition = (
  board: Array<Array<GameChessPiece | null>>,
  kingColor: GameChessPieceColorEnum,
): Point | null => {
  // Duyệt qua từng ô trên bàn cờ để tìm quân tướng
  for (let x = 0; x < board.length; x++) {
    for (let y = 0; y < board[x].length; y++) {
      const piece = board[x][y];
      // Kiểm tra nếu là quân tướng và có màu sắc phù hợp
      if (
        piece &&
        piece.type === GameChessPieceTypeEnum.TƯỚNG &&
        piece.color === kingColor
      ) {
        return { x, y }; // Trả về tọa độ quân tướng
      }
    }
  }
  return null; // Không tìm thấy quân tướng
};

export const isKingInCheck = (
  board: Array<Array<GameChessPiece | null>>,
  currentPlayerColor: GameChessPieceColorEnum,
): boolean => {
  // Tìm vị trí quân tướng
  const kingPosition = findKingPosition(board, currentPlayerColor);
  const kingX = kingPosition.x,
    kingY = kingPosition.y;

  const { XE, MÃ, PHÁO, TỐT } = GameChessPieceTypeEnum;
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
