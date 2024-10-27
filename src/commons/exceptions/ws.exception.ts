import { WsException } from '@nestjs/websockets';
import {
  ArgumentsHost,
  Catch,
  Logger,
  WsExceptionFilter,
} from '@nestjs/common';
import { Socket } from 'socket.io';
import { GameEventServer } from 'src/game-manager/game.event';

@Catch(WsException)
export class WsExceptionResponse implements WsExceptionFilter {
  private readonly logger = new Logger(WsExceptionResponse.name);

  catch(exception: WsException, host: ArgumentsHost) {
    const ctx = host.switchToWs();
    const client = ctx.getClient<Socket>();
    const data = ctx.getData();

    const errorResponse = {
      statusCode: 'error',
      timestamp: new Date().toISOString(),
      error: exception.getError(),
      message: exception.message,
      data,
    };

    this.logger.error(`WS Exception: ${exception.message}`, exception.stack);

    client.emit(GameEventServer.ERROR, errorResponse);
  }
}
