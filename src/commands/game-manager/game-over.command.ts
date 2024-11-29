// import { Server, Socket } from 'socket.io';
// import { CommandBase } from 'src/commons/base/command.base';
// import { GameStateManager } from 'src/game-manager/game-state/game-state.manager';
// import { SocketToUser, UserToSocket } from 'src/game-manager/game.manager';
// import { RoomGameManager } from 'src/game-manager/room/room.manager';
// import { UserGameManager } from 'src/game-manager/user/user.manager';

// export interface GameOverCommandPayload {
//   client: Socket;
// }

// // only server send
// export class GameOverCommand implements CommandBase<GameOverCommandPayload> {
//   constructor(
//     private readonly userToSocket: UserToSocket,
//     private readonly socketToUser: SocketToUser,
//     private userManager: UserGameManager,
//     private roomManager: RoomGameManager,
//     private gameStateManager: GameStateManager,
//     private server: Server,
//   ) {}

//   async execute(payload: GameOverCommandPayload) {
//     const { client } = payload;

//     const userId = this.socketToUser[client.id];
//     const user = this.userManager.getUserById(userId);
//     const room = this.roomManager.findRoomByPlayerId(userId);

//   }
// }
