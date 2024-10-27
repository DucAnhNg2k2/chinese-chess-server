import { Socket } from 'socket.io';
import { GameEventClient } from 'src/game-manager/game.event';

export const socketEmitError = (client: Socket, message: string) => {
  client.emit(GameEventClient.ERROR, {
    message,
  });
};
