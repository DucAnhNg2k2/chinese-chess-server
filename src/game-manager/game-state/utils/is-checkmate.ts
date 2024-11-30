import {
  GameChessPiece,
  GameChessPieceColorEnum,
} from '../game-state.interface';
import { getPointsResultCanMove } from '../game-state.util';
import { isKingInCheck } from './is-kingincheck';

/* Tất cả quân của đối thủ đi nước nào cũng bị chiếu tướng => đối thủ đã thua */
export const isCheckMate = (
  board: Array<Array<GameChessPiece | null>>,
  currentPlayerColor: GameChessPieceColorEnum,
) => {
  for (let x = 0; x < board.length; x++) {
    for (let y = 0; y < board[x].length; y++) {
      const piece = board[x][y];
      if (piece && piece.color === currentPlayerColor) {
        // Lấy các nước đi hợp lệ của quân cờ
        const validMoves = getPointsResultCanMove({ x, y }, board);

        // Giả lập từng nước đi để kiểm tra
        for (const move of validMoves) {
          // Lưu trạng thái bàn cờ gốc
          const originalPiece = board[move.x][move.y];
          board[move.x][move.y] = piece; // Di chuyển quân cờ
          board[x][y] = null; // Xóa quân cờ khỏi vị trí cũ

          // Kiểm tra tướng có còn bị chiếu không
          const stillInCheck = isKingInCheck(board, currentPlayerColor);

          // Khôi phục trạng thái bàn cờ
          board[x][y] = piece;
          board[move.x][move.y] = originalPiece;

          if (!stillInCheck) {
            return false;
          }
        }
      }
    }
  }
  return true;
};
