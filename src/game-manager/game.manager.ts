import { OnModuleInit } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateRoomCommand } from 'src/commands/game-manager/create-room.command';
import { JoinRoomCommand } from 'src/commands/game-manager/join-room.command';
import { LeaveRoomCommand } from 'src/commands/game-manager/leave-room.command';
import { PlayerReadyGameCommand } from 'src/commands/game-manager/player-ready.command';
import { JwtCoreService } from 'src/modules/jwt/jwt.core.service';
import { MessageCreateRoomDto } from './dtos/message-create-room.dto';
import { MessageJoinRoomDto } from './dtos/message-join-room.dto';
import { MessageStartGameDto } from './dtos/player-ready-game.dto';
import { GameStateManager } from './game-state/game-state.manager';
import { GameEventServer } from './game.event';
import { Room } from './room/room.interface';
import { RoomGameManager } from './room/room.manager';
import { UserGameStatus } from './user/user.interface';
import { UserGameManager } from './user/user.manager';
import { GetUserProfileCommand } from 'src/commands/user/get-user-profile.command';

export interface UserToSocket {
  [userId: string]: Socket;
}
export interface SocketToUser {
  [socketId: string]: string;
}

@WebSocketGateway(8080, {
  transports: ['websocket', 'polling'],
  cors: {
    allowedHeaders: '*',
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class GameManager
  implements
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    OnModuleInit
{
  @WebSocketServer()
  server: Server;

  private userToSocket: UserToSocket = {};
  private socketToUser: SocketToUser = {};
  private startGameCommand: PlayerReadyGameCommand;
  private createRoomCommand: CreateRoomCommand;
  private joinRoomCommand: JoinRoomCommand;
  private leaveRoomCommand: LeaveRoomCommand;
  private usersQueue: string[] = [];

  constructor(
    private readonly jwtCoreService: JwtCoreService,
    private readonly userManager: UserGameManager,
    private readonly roomManager: RoomGameManager,
    private readonly gameStateManager: GameStateManager,
    private readonly getUserProfileCommand: GetUserProfileCommand,
  ) {}

  onModuleInit() {
    this.startGameCommand = new PlayerReadyGameCommand(
      this.userToSocket,
      this.socketToUser,
      this.userManager,
      this.roomManager,
      this.gameStateManager,
      this.server,
    );
    this.createRoomCommand = new CreateRoomCommand(
      this.userToSocket,
      this.socketToUser,
      this.userManager,
      this.roomManager,
      this.gameStateManager,
      this.server,
    );
    this.joinRoomCommand = new JoinRoomCommand(
      this.userToSocket,
      this.socketToUser,
      this.userManager,
      this.roomManager,
      this.gameStateManager,
      this.server,
    );
    this.leaveRoomCommand = new LeaveRoomCommand(
      this.userToSocket,
      this.socketToUser,
      this.userManager,
      this.roomManager,
      this.gameStateManager,
      this.server,
    );
  }

  afterInit(server: any) {}

  async handleConnection(client: Socket) {
    try {
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
      // check xem connect chưa
      // nếu có hủy kết nối cũ
      const oldSocket = this.userToSocket[user.id];
      if (oldSocket) {
        delete this.socketToUser[oldSocket.id];
        oldSocket.disconnect();
      }

      const userProfile = await this.getUserProfileCommand.execute(user);
      this.userToSocket[user.id] = client;
      this.socketToUser[client.id] = user.id;
      this.userManager.addUser({
        id: user.id,
        status: UserGameStatus.ONLINE,
        userProfile,
      });
    } catch (err) {
      console.log('[GameManager]', err);
    }
  }

  async handleDisconnect(client: Socket) {
    const userId = this.socketToUser[client.id];
    if (!userId) {
      return;
    }
    this.leaveRoomCommand.execute({ dto: {}, client });
    this.userManager.removeUser(userId);
    delete this.userToSocket[userId];
    delete this.socketToUser[client.id];
    client.disconnect();
  }

  @SubscribeMessage(GameEventServer.CREATE_ROOM)
  async createRoom(
    @MessageBody() body: MessageCreateRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    const room: Room = await this.createRoomCommand.execute({ client });
  }

  @SubscribeMessage(GameEventServer.JOIN_ROOM)
  async joinRoom(
    @MessageBody() dto: MessageJoinRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    const room: Room = await this.joinRoomCommand.execute({
      dto,
      client,
    });
  }

  @SubscribeMessage(GameEventServer.PLAYER_READY)
  async startGame(
    @MessageBody() dto: MessageStartGameDto,
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.startGameCommand.execute({
      dto,
      client,
    });
  }

  @SubscribeMessage(GameEventServer.LEAVE_ROOM)
  async leaveRoom(
    @MessageBody() dto: MessageJoinRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.leaveRoomCommand.execute({
      dto,
      client,
    });
  }
}
