import { Server, Socket } from 'socket.io';
import { CommandBase } from 'src/commons/base/command.base';
import { socketEmitError } from 'src/commons/utils/socket-error';
import { GameStateManager } from 'src/game-manager/game-state/game-state.manager';
import { SocketToUser, UserToSocket } from 'src/game-manager/game.manager';
import { RoomGameManager } from 'src/game-manager/room/room.manager';
import { UserGameManager } from 'src/game-manager/user/user.manager';

export interface FindRoomCommandPayload {
  client: Socket;
}
export class FindRoomCommand implements CommandBase<FindRoomCommandPayload> {
  constructor(
    private readonly userToSocket: UserToSocket,
    private readonly socketToUser: SocketToUser,
    private userManager: UserGameManager,
    private roomManager: RoomGameManager,
    private gameStateManager: GameStateManager,
    private server: Server,
  ) {}

  execute(payload: FindRoomCommandPayload) {
    const { client } = payload;

    // Check xem user có tồn tại không
    const userId = this.socketToUser[client.id];
    const user = this.userManager.getUserById(userId);
    if (!user) {
      return socketEmitError(client, 'user-không-tồn-tại');
    }

    // // Check xem user đã ở trong room nào chưa
    // const room = this.roomManager.findRoomByPlayerId(userId);
    // if (room) {
    //   return socketEmitError(client, 'user-đã-ở-trong-room');
    // }

    // // Tìm room chưa đầy
    // const availableRoom = this.roomManager.findAvailableRoom();
    // if (availableRoom) {
    //   availableRoom.addPlayer(user);
    //   this.server
    //     .to(availableRoom.id)
    //     .emit(GameEventClient.PLAYER_JOIN_ROOM, user);
    //   return;
    // }

    // // Tạo room mới
    // const newRoom = this.roomManager.createRoom();
    // newRoom.addPlayer(user);
    // this.server.to(newRoom.id).emit(GameEventClient.PLAYER_JOIN_ROOM, user);
  }
}
