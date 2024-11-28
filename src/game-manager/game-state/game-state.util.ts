import { Point } from 'src/const/point.const';
import {
  GameChessPiece,
  GameChessPieceColorEnum,
  GameChessPieceTypeEnum,
} from './game-state.interface';

// board của game cờ tướng
export const initGameStateBoard = (): Array<Array<GameChessPiece | null>> => {
  const createPiece = (
    type: GameChessPieceTypeEnum,
    color: GameChessPieceColorEnum,
  ): GameChessPiece => ({
    type,
    color,
  });
  const { XE, MÃ, TỊNH, SĨ, TƯỚNG, PHÁO, TỐT } = GameChessPieceTypeEnum;
  const { RED, BLACK } = GameChessPieceColorEnum;

  const row1 = [XE, MÃ, TỊNH, SĨ, TƯỚNG, SĨ, TỊNH, MÃ, XE].map((type) =>
    createPiece(type, RED),
  );
  const row2 = Array(9).fill(null);
  const row3 = [null, PHÁO, null, null, null, null, null, PHÁO, null].map(
    (type) => (type ? createPiece(type, RED) : null),
  );
  const row4 = [TỐT, null, TỐT, null, TỐT, null, TỐT, null, TỐT].map((type) =>
    type ? createPiece(type, RED) : null,
  );
  const row5 = Array(9).fill(null);
  const row6 = Array(9).fill(null);
  const row7 = [TỐT, null, TỐT, null, TỐT, null, TỐT, null, TỐT].map((type) =>
    type ? createPiece(type, BLACK) : null,
  );
  const row8 = [null, PHÁO, null, null, null, null, null, PHÁO, null].map(
    (type) => (type ? createPiece(type, BLACK) : null),
  );
  const row9 = Array(9).fill(null);
  const row10 = [XE, MÃ, TỊNH, SĨ, TƯỚNG, SĨ, TỊNH, MÃ, XE].map((type) =>
    createPiece(type, BLACK),
  );

  return [row1, row2, row3, row4, row5, row6, row7, row8, row9, row10];
};

export const getPointsResultCanMove = (
  point: Point,
  board: Array<Array<GameChessPiece | null>>,
) => {
  if (!point) {
    return [];
  }
  const x = point.x,
    y = point.y;
  if (x === null || x === undefined) return [];
  if (y === null || y === undefined) return [];

  const piece = board[x][y];
  if (!piece) {
    return [];
  }

  const { XE, MÃ, TỊNH, SĨ, TƯỚNG, PHÁO, TỐT } = GameChessPieceTypeEnum;
  switch (piece.type) {
    case XE:
      return getPointsResultCanMoveForXe({ x, y }, board);
    case MÃ:
      return getPointsResultCanMoveForMa({ x, y }, board);
    case TỊNH:
      return getPointsResultCanMoveForTinh({ x, y }, board);
    case SĨ:
      return getPointsResultCanMoveForSi({ x, y }, board);
    case TƯỚNG:
      return getPointsResultCanMoveForTuong({ x, y }, board);
    case PHÁO:
      return getPointsResultCanMoveForPhao({ x, y }, board);
    case TỐT:
      return getPointsResultCanMoveForTot({ x, y }, board);
    default:
      return [];
  }
};

const getPointsResultCanMoveForXe = (
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

const getPointsResultCanMoveForMa = (
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

const getPointsResultCanMoveForPhao = (
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

const getPointsResultCanMoveForTinh = (
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

const getPointsResultCanMoveForTuong = (
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

const getPointsResultCanMoveForSi = (
  point: Point,
  board: Array<Array<GameChessPiece | null>>,
): Array<Point> => {
  const validMoves: Array<Point> = [];
  const isRedSide =
    board[point.x][point.y]?.color === GameChessPieceColorEnum.RED;

  // Vùng cung của quân Sĩ (hàng 0 đến 2 cho quân đỏ, hàng 7 đến 9 cho quân đen)
  const minX = isRedSide ? 0 : 7;
  const maxX = isRedSide ? 2 : 9;
  const minY = 3; // Giới hạn cột bên trái của cung
  const maxY = 5; // Giới hạn cột bên phải của cung

  const directions = [
    { dx: 1, dy: 1 }, // Chéo phải xuống
    { dx: 1, dy: -1 }, // Chéo trái xuống
    { dx: -1, dy: 1 }, // Chéo phải lên
    { dx: -1, dy: -1 }, // Chéo trái lên
  ];

  directions.forEach(({ dx, dy }) => {
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

const getPointsResultCanMoveForTot = (
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
