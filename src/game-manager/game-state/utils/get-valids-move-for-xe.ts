import { Point } from 'src/const/point.const';
import { GameChessPiece } from '../game-state.interface';

export const getPointsResultCanMoveForXe = (
  point: Point,
  board: Array<Array<GameChessPiece | null>>,
): Array<Point> => {
  const directions = [
    { dx: -1, dy: 0 }, // Lên
    { dx: 1, dy: 0 }, // Xuống
    { dx: 0, dy: -1 }, // Trái
    { dx: 0, dy: 1 }, // Phải
  ];

  const validMoves: Array<Point> = [];

  directions.forEach(({ dx, dy }) => {
    let x = point.x + dx;
    let y = point.y + dy;

    while (x >= 0 && x < 10 && y >= 0 && y < 9) {
      const destinationPiece = board[x][y];

      if (destinationPiece === null) {
        // Nếu ô trống, thêm vào danh sách các nước đi
        validMoves.push({ x, y });
      } else {
        // Nếu gặp quân đối phương, thêm vào danh sách và dừng
        if (destinationPiece.color !== board[point.x][point.y]?.color) {
          validMoves.push({ x, y });
        }
        break; // Dừng duyệt khi gặp quân cờ
      }

      // Cập nhật tọa độ tiếp theo
      x += dx;
      y += dy;
    }
  });

  return validMoves;
};
