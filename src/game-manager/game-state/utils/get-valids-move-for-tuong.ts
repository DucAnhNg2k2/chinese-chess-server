import { Point } from 'src/const/point.const';
import {
  GameChessPiece,
  GameChessPieceColorEnum,
} from '../game-state.interface';

export const getPointsResultCanMoveForTuong = (
  point: Point,
  board: Array<Array<GameChessPiece | null>>,
): Array<Point> => {
  const validMoves: Array<Point> = [];
  const isRedSide =
    board[point.x][point.y]?.color === GameChessPieceColorEnum.RED;

  // Vùng cung của quân Tướng (hàng 0 đến 2 cho quân đỏ, hàng 7 đến 9 cho quân đen)
  const minX = isRedSide ? 0 : 7;
  const maxX = isRedSide ? 2 : 9;
  const minY = 3; // Giới hạn cột bên trái của cung
  const maxY = 5; // Giới hạn cột bên phải của cung

  const direction = [
    { dx: 0, dy: 1 }, // Phải
    { dx: 0, dy: -1 }, // Trái
    { dx: 1, dy: 0 }, // Xuống
    { dx: -1, dy: 0 }, // Lên
  ];

  direction.forEach(({ dx, dy }) => {
    const newPoint = { x: point.x + dx, y: point.y + dy };

    // Kiểm tra nếu điểm đến nằm trong vùng cung và trong phạm vi bàn cờ
    if (
      newPoint.x >= 0 &&
      newPoint.x < 10 &&
      newPoint.y >= 0 &&
      newPoint.y < 9 &&
      newPoint.x >= minX &&
      newPoint.x <= maxX &&
      newPoint.y >= minY &&
      newPoint.y <= maxY
    ) {
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
