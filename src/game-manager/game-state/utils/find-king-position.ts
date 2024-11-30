import { Point } from 'src/const/point.const';
import {
  GameChessPiece,
  GameChessPieceColorEnum,
  GameChessPieceTypeEnum,
} from '../game-state.interface';

export const findKingPosition = (
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
        piece.type === GameChessPieceTypeEnum.TUONG &&
        piece.color === kingColor
      ) {
        return { x, y }; // Trả về tọa độ quân tướng
      }
    }
  }
  return null; // Không tìm thấy quân tướng
};
