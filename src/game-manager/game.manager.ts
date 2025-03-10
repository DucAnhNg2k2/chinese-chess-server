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
import { MessagePlayerReadyGameDto } from './dtos/player-ready-game.dto';
import { GameStateManager } from './game-state/game-state.manager';
import { GameEventServer } from './game.event';
import { Room } from './room/room.interface';
import { RoomGameManager } from './room/room.manager';
import { UserGameStatus } from './user/user.interface';
import { UserGameManager } from './user/user.manager';
import { GetUserProfileCommand } from 'src/commands/user/get-user-profile.command';
import { PlayerCancelReadyGameCommand } from 'src/commands/game-manager/player-cancel-ready.command';
import { MovePieceChessDto } from './dtos/move-piece-chess.dto';
import { MovePieceGameCommand } from 'src/commands/game-manager/move-piece.command';
import { GetValidMoveChessDto } from './dtos/get-valid-move.dto';
import { GetValidMovesCommand } from 'src/commands/game-manager/get-valid-moves.command';
import { SaveGameHistoryCommand } from 'src/commands/game-manager/save-game-history.command';
import { InviteRoomCommand } from 'src/commands/game-manager/invite-room.command';
import { InviteRoomDto } from './dtos/invite-room.dto';
import { SurrenderGameCommand } from 'src/commands/game-manager/surrender.command';
import { SurrenderGameDto } from './dtos/surrender.dto';

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
  private playerReadyGameCommand: PlayerReadyGameCommand;
  private playerCancelReadyGameCommand: PlayerCancelReadyGameCommand;
  private createRoomCommand: CreateRoomCommand;
  private joinRoomCommand: JoinRoomCommand;
  private leaveRoomCommand: LeaveRoomCommand;
  private movePieceChessCommand: MovePieceGameCommand;
  private getValidMovesCommand: GetValidMovesCommand;
  private inviteRoomCommand: InviteRoomCommand;
  private surrenderGameCommand: SurrenderGameCommand;
  private usersQueue: string[] = [];

  constructor(
    private readonly jwtCoreService: JwtCoreService,
    private readonly userManager: UserGameManager,
    private readonly roomManager: RoomGameManager,
    private readonly gameStateManager: GameStateManager,
    private readonly getUserProfileCommand: GetUserProfileCommand,
    private readonly saveGameHistoryCommand: SaveGameHistoryCommand,
  ) {}

  onModuleInit() {
    this.playerReadyGameCommand = new PlayerReadyGameCommand(
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
      this.saveGameHistoryCommand,
    );
    this.playerCancelReadyGameCommand = new PlayerCancelReadyGameCommand(
      this.userToSocket,
      this.socketToUser,
      this.userManager,
      this.roomManager,
      this.gameStateManager,
      this.server,
    );
    this.movePieceChessCommand = new MovePieceGameCommand(
      this.userToSocket,
      this.socketToUser,
      this.userManager,
      this.roomManager,
      this.gameStateManager,
      this.server,
      this.saveGameHistoryCommand,
    );
    this.getValidMovesCommand = new GetValidMovesCommand(
      this.userToSocket,
      this.socketToUser,
      this.userManager,
      this.roomManager,
      this.gameStateManager,
      this.server,
    );
    this.inviteRoomCommand = new InviteRoomCommand(
      this.userToSocket,
      this.socketToUser,
      this.userManager,
      this.roomManager,
      this.gameStateManager,
      this.server,
    );
    this.surrenderGameCommand = new SurrenderGameCommand(
      this.userToSocket,
      this.socketToUser,
      this.userManager,
      this.roomManager,
      this.gameStateManager,
      this.server,
      this.saveGameHistoryCommand,
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
        this.handlerSocketDisconnect(oldSocket);
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
    return this.handlerSocketDisconnect(client);
  }

  private handlerSocketDisconnect(client: Socket) {
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
    // console.log('[CREATE_ROOM]', body);
    const room: Room = await this.createRoomCommand.execute({ client });
  }

  @SubscribeMessage(GameEventServer.JOIN_ROOM)
  async joinRoom(
    @MessageBody() dto: MessageJoinRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    // console.log('[JOIN_ROOM]', dto);
    const room: Room = await this.joinRoomCommand.execute({
      dto,
      client,
    });
  }

  @SubscribeMessage(GameEventServer.PLAYER_READY)
  async startGame(
    @MessageBody() dto: MessagePlayerReadyGameDto,
    @ConnectedSocket() client: Socket,
  ) {
    // console.log('[PLAYER_READY]', dto);
    const result = await this.playerReadyGameCommand.execute({
      dto,
      client,
    });
  }

  @SubscribeMessage(GameEventServer.PLAYER_CANCEL_READY)
  async cancelReadyGame(
    @MessageBody() dto: MessagePlayerReadyGameDto,
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.playerCancelReadyGameCommand.execute({
      dto,
      client,
    });
  }

  @SubscribeMessage(GameEventServer.LEAVE_ROOM)
  async leaveRoom(
    @MessageBody() dto: MessageJoinRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    // console.log('[LEAVE_ROOM]', dto);
    const result = await this.leaveRoomCommand.execute({
      dto,
      client,
    });
  }

  @SubscribeMessage(GameEventServer.MOVE_PIECE)
  async movePiece(
    @MessageBody() dto: MovePieceChessDto,
    @ConnectedSocket() client: Socket,
  ) {
    // console.log('[MOVE_PIECE]', dto);
    const result = await this.movePieceChessCommand.execute({
      dto,
      client,
    });
  }

  @SubscribeMessage(GameEventServer.GET_VALID_MOVES)
  async getValidMoves(
    @MessageBody() dto: GetValidMoveChessDto,
    @ConnectedSocket() client: Socket,
  ) {
    // console.log('[GET_VALID_MOVES]', dto);
    return this.getValidMovesCommand.execute({
      dto,
      client,
    });
  }

  @SubscribeMessage(GameEventServer.INVITE_FRIEND)
  async inviteFriends(
    @MessageBody() dto: InviteRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    return this.inviteRoomCommand.execute({
      dto,
      client,
    });
  }

  @SubscribeMessage(GameEventServer.SURRENDER_GAME)
  async surrenderGame(
    @MessageBody() dto: SurrenderGameDto,
    @ConnectedSocket() client: Socket,
  ) {
    return this.surrenderGameCommand.execute({
      dto,
      client,
    });
  }
}
