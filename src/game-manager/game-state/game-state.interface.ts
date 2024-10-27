export interface GameState {
  gameId: string;
  roomId: string;
  currentPlayerId: string;
  board: string[][];
  gameOver: boolean;
}
export interface GameStateMap {
  [gameId: string]: GameState;
}
