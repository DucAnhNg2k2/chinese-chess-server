import { Point } from 'src/const/point.const';
import { GameChessPiece } from '../game-state.interface';

export const getPointsResultCanMoveForMa = (
  point: Point,
  board: Array<Array<GameChessPiece | null>>,
): Array<Point> => {
  const directions = [
    { dx: 2, dy: 1, blockX: 1, blockY: 0 },
    { dx: 2, dy: -1, blockX: 1, blockY: 0 },
    { dx: -2, dy: 1, blockX: -1, blockY: 0 },
    { dx: -2, dy: -1, blockX: -1, blockY: 0 },
    { dx: 1, dy: 2, blockX: 0, blockY: 1 },
    { dx: 1, dy: -2, blockX: 0, blockY: -1 },
    { dx: -1, dy: 2, blockX: 0, blockY: 1 },
    { dx: -1, dy: -2, blockX: 0, blockY: -1 },
  ];

  const validMoves: Array<Point> = [];

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
      // Kiểm tra điểm đến có nằm trong bàn cờ
      if (
        newPoint.x >= 0 &&
        newPoint.x < board.length &&
        newPoint.y >= 0 &&
        newPoint.y < board[0].length
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
    }
  });

  return validMoves;
};
