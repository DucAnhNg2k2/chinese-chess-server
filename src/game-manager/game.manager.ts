import { UserGameManager } from './user/user.manager';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtCoreService } from 'src/modules/jwt/jwt.core.service';
import { UserGameStatus } from './user/user.interface';
import { GameEvent } from './game.event';
import { MessageCreateRoomDto } from './dtos/message-create-room.dto';
import { RoomGameManager } from './room/room.manager';
import { randomUUID } from 'crypto';
import { MessageJoinRoomDto } from './dtos/message-join-room.dto';

export interface UserToSocket {
  [userId: string]: Socket;
}
export interface SocketToUser {
  [socketId: string]: string;
}

@WebSocketGateway(8080, { transports: ['websocket'], cors: true })
export class GameManager
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server;

  private userToSocket: UserToSocket = {};
  private socketToUser: SocketToUser = {};
  constructor(
    private readonly jwtCoreService: JwtCoreService,
    private readonly userManager: UserGameManager,
    private readonly roomManager: RoomGameManager,
  ) {}

  afterInit(server: any) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.query.token as string;
    if (!token) {
      client.disconnect();
      return;
    }

    const user = this.jwtCoreService.verify(token);
    if (!user) {
      client.disconnect();
      return;
    }

    this.userToSocket[user.id] = client;
    this.socketToUser[client.id] = user.id;
    this.userManager.addUser({
      id: user.id,
      status: UserGameStatus.ONLINE,
    });
  }

  async handleDisconnect(client: Socket) {
    const userId = this.socketToUser[client.id];

    delete this.userToSocket[userId];
    delete this.socketToUser[client.id];
    this.userManager.removeUser(userId);
    client.disconnect();
  }

  @SubscribeMessage(GameEvent.CREATE_ROOM)
  async createRoom(
    @MessageBody() body: MessageCreateRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    const userId = this.socketToUser[client.id];
    const user = this.userManager.getUserById(userId);
    if (user.status !== UserGameStatus.ONLINE) {
      throw new WsException('User is not online');
    }

    const roomId = randomUUID();
    const room = this.roomManager.createRoom({
      id: roomId,
      ownerId: userId,
      playerIds: [userId],
    });
    user.status = UserGameStatus.IN_ROOM;
  }

  @SubscribeMessage(GameEvent.JOIN_ROOM)
  async joinRoom(
    @MessageBody() dto: MessageJoinRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    const userId = this.socketToUser[client.id];
    const user = this.userManager.getUserById(userId);
    if (user.status !== UserGameStatus.ONLINE) {
      throw new WsException('User is not online');
    }

    const room = this.roomManager.getRoomById(dto.roomId);
    if (!room) {
      throw new WsException('Room not found');
    }

    room.playerIds = [...room.playerIds, userId];
    user.status = UserGameStatus.IN_ROOM;
  }
}
