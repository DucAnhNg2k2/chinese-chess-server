import { Point } from 'src/const/point.const';
import { GameChessPiece } from '../game-state.interface';

export const getPointsResultCanMoveForPhao = (
  point: Point,
  board: Array<Array<GameChessPiece | null>>,
): Array<Point> => {
  const validMoves: Array<Point> = [];
  const directions = [
    { dx: 0, dy: 1 }, // Đi xuống
    { dx: 0, dy: -1 }, // Đi lên
    { dx: 1, dy: 0 }, // Đi phải
    { dx: -1, dy: 0 }, // Đi trái
  ];

  directions.forEach(({ dx, dy }) => {
    let x = point.x + dx;
    let y = point.y + dy;
    let isJumping = false;

    while (x >= 0 && x < 10 && y >= 0 && y < 9) {
      const destinationPiece = board[x][y];

      if (destinationPiece === null) {
        if (!isJumping) {
          // Nếu chưa nhảy qua quân cản, có thể đi đến ô trống
          validMoves.push({ x, y });
        }
      } else {
        if (!isJumping) {
          // Nếu gặp quân cản lần đầu, chuyển trạng thái sang "đang nhảy"
          isJumping = true;
        } else {
          // Nếu đã nhảy qua quân cản, kiểm tra quân này để ăn
          if (destinationPiece.color !== board[point.x][point.y]?.color) {
            validMoves.push({ x, y });
          }
          break; // Pháo không thể nhảy qua nhiều quân
        }
      }

      // Cập nhật tọa độ
      x += dx;
      y += dy;
    }
  });

  return validMoves;
};
