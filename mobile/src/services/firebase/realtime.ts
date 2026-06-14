import { PuzzleState, Session } from '../../utils/types';
import { localStore } from '../localStore';

export const subscribeToSession = (sessionId: string, callback: (data: Session | null) => void) => {
  return localStore.subscribeSession(sessionId, callback);
};

export const subscribeToPuzzleState = (sessionId: string, callback: (state: PuzzleState | null) => void) => {
  return localStore.subscribePuzzle(sessionId, callback);
};

export const subscribeToParticipants = (sessionId: string, callback: (participants: Session['participants']) => void) => {
  return localStore.subscribeSession(sessionId, session => callback(session?.participants || []));
};

export const updatePuzzlePiecePosition = async (
  sessionId: string,
  pieceId: string,
  position: { x: number; y: number },
) => {
  const session = localStore.getSession(sessionId);
  if (!session?.puzzleState) {throw new Error('Puzzle state not found');}
  const piece = session.puzzleState.pieces[pieceId];
  if (!piece) {throw new Error('Puzzle piece not found');}
  session.puzzleState.pieces[pieceId] = { ...piece, position };
  return localStore.saveSession(session);
};

export const getConnectionStatus = () => {
  return true;
};
