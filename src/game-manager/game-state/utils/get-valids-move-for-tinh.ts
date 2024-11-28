import { Point } from 'src/const/point.const';
import {
  GameChessPiece,
  GameChessPieceColorEnum,
} from '../game-state.interface';

export const getPointsResultCanMoveForTinh = (
  point: Point,
  board: Array<Array<GameChessPiece | null>>,
): Array<Point> => {
  const directions = [
    { dx: 2, dy: 2, blockX: 1, blockY: 1 }, // Chéo phải xuống
    { dx: 2, dy: -2, blockX: 1, blockY: -1 }, // Chéo trái xuống
    { dx: -2, dy: 2, blockX: -1, blockY: 1 }, // Chéo phải lên
    { dx: -2, dy: -2, blockX: -1, blockY: -1 }, // Chéo trái lên
  ];

  const validMoves: Array<Point> = [];
  const isRedSide =
    board[point.x][point.y]?.color === GameChessPieceColorEnum.RED;

  directions.forEach(({ dx, dy, blockX, blockY }) => {
    const blockPoint = { x: point.x + blockX, y: point.y + blockY };
    const newPoint = { x: point.x + dx, y: point.y + dy };

    // Kiểm tra ô cản có trống
    if (
      blockPoint.x >= 0 &&
      blockPoint.x < 10 &&
      blockPoint.y >= 0 &&
      blockPoint.y < 9 &&
      board[blockPoint.x][blockPoint.y] === null
    ) {
      // Kiểm tra điểm đến nằm trong phạm vi hợp lệ
      if (
        newPoint.x >= 0 &&
        newPoint.x < 10 &&
        newPoint.y >= 0 &&
        newPoint.y < 9
      ) {
        // Tịnh bên đỏ chỉ ở nửa trên, bên đen chỉ ở nửa dưới
        if ((isRedSide && newPoint.x <= 4) || (!isRedSide && newPoint.x >= 5)) {
          const destinationPiece = board[newPoint.x][newPoint.y];
          // Kiểm tra ô đến có quân đối phương hoặc trống
          if (
            destinationPiece === null ||
            destinationPiece.color !== board[point.x][point.y]?.color
          ) {
            validMoves.push(newPoint);
          }
        }
      }
    }
  });

  return validMoves;
};
