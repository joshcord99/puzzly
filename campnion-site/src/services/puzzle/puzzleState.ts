import { PuzzlePiece, PuzzleState } from '@/utils/types';

export function createPuzzleState(pieces: PuzzlePiece[]): PuzzleState {
  return {
    pieces: Object.fromEntries(pieces.map((piece) => [piece.id, piece])),
    completedPieces: [],
    progress: 0,
    lastUpdated: Date.now(),
  };
}

export function updatePiece(
  state: PuzzleState,
  pieceId: string,
  updates: Partial<PuzzlePiece>,
): PuzzleState {
  const piece = state.pieces[pieceId];
  if (!piece) return state;

  const nextPiece = { ...piece, ...updates };
  const completedPieces = Object.values({ ...state.pieces, [pieceId]: nextPiece })
    .filter((item) => item.isPlaced)
    .map((item) => item.id);

  return {
    pieces: { ...state.pieces, [pieceId]: nextPiece },
    completedPieces,
    progress: Math.round((completedPieces.length / Object.keys(state.pieces).length) * 100),
    lastUpdated: Date.now(),
  };
}

export const puzzleStateService = { createPuzzleState, updatePiece };
