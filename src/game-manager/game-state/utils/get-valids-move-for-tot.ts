import { Point } from 'src/const/point.const';
import {
  GameChessPiece,
  GameChessPieceColorEnum,
} from '../game-state.interface';

export const getPointsResultCanMoveForTot = (
  point: Point,
  board: Array<Array<GameChessPiece | null>>,
): Array<Point> => {
  const validMoves: Array<Point> = [];
  const isRedSide =
    board[point.x][point.y]?.color === GameChessPieceColorEnum.RED;

  // Quy định các hướng di chuyển cho quân Tốt
  const directions = isRedSide
    ? [
        { dx: 1, dy: 0 },
        { dx: 0, dy: -1 },
        { dx: 0, dy: 1 },
      ] // Quân đỏ di chuyển xuống và ngang
    : [
        { dx: -1, dy: 0 },
        { dx: 0, dy: -1 },
        { dx: 0, dy: 1 },
      ]; // Quân đen di chuyển lên và ngang

  // Kiểm tra nếu quân Tốt đã qua hàng 5 (có thể di chuyển ngang)
  const canMoveSideways = isRedSide ? point.x >= 5 : point.x <= 4;

  directions.forEach(({ dx, dy }) => {
    const newPoint = { x: point.x + dx, y: point.y + dy };

    // Kiểm tra nếu điểm đến nằm trong phạm vi bàn cờ
    if (
      newPoint.x >= 0 &&
      newPoint.x < 10 &&
      newPoint.y >= 0 &&
      newPoint.y < 9
    ) {
      // Nếu quân Tốt chưa qua hàng 5, chỉ có thể di chuyển tiến
      if (!canMoveSideways && dy !== 0) return; // Chỉ cho phép di chuyển dọc

      const destinationPiece = board[newPoint.x][newPoint.y];
      // Kiểm tra ô đến có quân đối phương hoặc trống
      if (
        destinationPiece === null ||
        destinationPiece.color !== board[point.x][point.y]?.color
      ) {
        validMoves.push(newPoint);
      }
    }
  });

  return validMoves;
};
