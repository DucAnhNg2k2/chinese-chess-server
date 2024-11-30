import {
  GameChessPiece,
  GameChessPieceColorEnum,
  GameChessPieceTypeEnum,
} from '../game-state.interface';
import { getPointsResultCanMove } from '../game-state.util';
import { findKingPosition } from './find-king-position';

/* Tất cả quân của đối thủ đi nước nào cũng bị chiếu tướng => đối thủ đã thua */
export const isCheckMate = (
  board: Array<Array<GameChessPiece | null>>,
  currentPlayerColor: GameChessPieceColorEnum,
) => {
  const kingPosition = findKingPosition(board, currentPlayerColor);
  const kingX = kingPosition.x,
    kingY = kingPosition.y;

  // for (let x = 0; x < board.length; x++) {
  //   for (let y = 0; y < board[x].length; y++) {
  //     const piece = board[x][y];
  //     if (piece && piece.color !== currentPlayerColor) {
  //       const validMoves = getPointsResultCanMove({ x, y }, board);
  //       for (const move of validMoves) {
  //         const originalPiece = board[move.x][move.y];
  //         board[move.x][move.y] = piece;
  //         board[x][y] = null;
  //         const kingInCheck = isKingInCheck(
  //           board,
  //           currentPlayerColor,
  //           kingX,
  //           kingY,
  //         );
  //         board[x][y] = piece;
  //         board[move.x][move.y] = originalPiece;
  //         if (!kingInCheck) {
  //           return false;
  //         }
  //       }
  //     }
  //   }
  // }
  return false;
};

// const isCheckmate = (
//   board: Array<Array<GameChessPiece | null>>,
//   currentPlayerColor: GameChessPieceColorEnum,
// ): boolean => {
//   // Bước 1: Kiểm tra tướng có đang bị chiếu không
//   if (!isKingInCheck(board, currentPlayerColor)) {
//     return false; // Không bị chiếu thì không thể hết cờ
//   }

//   // Bước 2: Lấy tất cả các quân cờ của người chơi
//   for (let x = 0; x < board.length; x++) {
//     for (let y = 0; y < board[x].length; y++) {
//       const piece = board[x][y];
//       if (piece && piece.color === currentPlayerColor) {
//         // Lấy các nước đi hợp lệ của quân cờ
//         const validMoves = getPointsResultCanMove({ x, y }, board);

//         // Giả lập từng nước đi để kiểm tra
//         for (const move of validMoves) {
//           // Lưu trạng thái bàn cờ gốc
//           const originalPiece = board[move.x][move.y];
//           board[move.x][move.y] = piece; // Di chuyển quân cờ
//           board[x][y] = null; // Xóa quân cờ khỏi vị trí cũ

//           // Kiểm tra tướng có còn bị chiếu không
//           const stillInCheck = isKingInCheck(board, currentPlayerColor);

//           // Khôi phục trạng thái bàn cờ
//           board[x][y] = piece;
//           board[move.x][move.y] = originalPiece;

//           if (!stillInCheck) {
//             return false; // Có ít nhất một nước đi hợp lệ
//           }
//         }
//       }
//     }
//   }

//   // Không có nước đi hợp lệ để thoát chiếu => Hết cờ
//   return true;
// };
