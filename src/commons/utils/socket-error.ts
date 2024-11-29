import { Socket } from 'socket.io';
import { GameEventClient } from 'src/game-manager/game.event';

export const socketEmitError = (client: Socket, message: string) => {
  console.log('[socketEmitError]', message);
  client.emit(GameEventClient.ERROR, {
    message,
  });
  return null;
};
