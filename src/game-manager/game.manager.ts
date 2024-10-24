import { UserGameManager } from './user/user.manager';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtCoreService } from 'src/modules/jwt/jwt.core.service';
import { UserGameStatus } from './user/user.interface';

export interface SocketUser {
  [userId: string]: Socket;
}

@WebSocketGateway(8080, { transports: ['websocket'], cors: true })
export class GameManager
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server;

  private users: SocketUser = {};
  constructor(
    private readonly jwtCoreService: JwtCoreService,
    private readonly UserManager: UserGameManager,
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

    this.users[user.id] = client;
    this.UserManager.addUser({
      id: user.id,
      status: UserGameStatus.ONLINE,
    });
  }

  async handleDisconnect(client: any) {
    console.log('Client disconnected');
  }
}
